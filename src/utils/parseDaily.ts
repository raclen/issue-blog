/**
 * 每日分享 Markdown 解析
 *
 * 约定格式：
 *   ## 10 月 23 日
 *   - [名称](https://example.com) — 一句话简介
 *
 * 采用逐行正则而非 AST：格式是行导向的（一行标题、一行条目），没有嵌套；
 * 且需要保留 desc 的原始行内 Markdown 交给 renderInline 处理。
 */

export type DailyEntry = {
  name: string;
  url: string;
  desc: string;
};

export type DailyDay = {
  date: string; // 2026-10-23
  dayLabel: string; // 10 月 23 日
  dayNumber: string; // 23
  weekday: string; // 周五
  anchorId: string; // day-2026-10-23
  entries: DailyEntry[];
};

export type DailyMonth = {
  month: string; // 2026-10
  year: number;
  monthNumber: number;
  label: string; // 2026 年 10 月
  days: DailyDay[]; // 按日期倒序
  entryCount: number;
};

const MONTH_ID = /^(\d{4})-(0[1-9]|1[0-2])$/;
const DAY_HEADING = /^##\s+(.+?)\s*$/;
const DAY_CN = /(\d{1,2})\s*月\s*(\d{1,2})\s*日/;
const DAY_ISO = /^\d{4}-(\d{1,2})-(\d{1,2})$/;
const DAY_MD = /^(\d{1,2})[/.](\d{1,2})$/;
const ENTRY_LINE = /^\s{0,3}[-*]\s+\[([^\]]+)\]\(([^)\s]+)\)\s*(.*)$/;
const CONTINUATION = /^\s{2,}\S/;
const DESC_PREFIX = /^\s*(?:[—–]{1,2}|-{1,2}|[：:])\s*/;

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const pad = (n: number) => String(n).padStart(2, "0");

/** 校验 id 是否为合法的月份文件名，非法直接抛错（比 schema 报错更直观） */
export function isValidMonthId(id: string): boolean {
  return MONTH_ID.test(id);
}

export function monthLabel(month: string): string {
  const matched = MONTH_ID.exec(month);
  return matched ? `${matched[1]} 年 ${Number(matched[2])} 月` : month;
}

/** 从 `## ...` 的文本里取出「日」，并按真实日历校验 */
function parseDayNumber(text: string, year: number, month: number): number | null {
  const trimmed = text.trim();
  const cn = DAY_CN.exec(trimmed);
  const iso = DAY_ISO.exec(trimmed);
  const md = DAY_MD.exec(trimmed);

  let day: number;
  let headingMonth: number;
  if (cn) {
    headingMonth = Number(cn[1]);
    day = Number(cn[2]);
  } else if (iso) {
    headingMonth = Number(iso[1]);
    day = Number(iso[2]);
  } else if (md) {
    headingMonth = Number(md[1]);
    day = Number(md[2]);
  } else {
    return null;
  }

  // 标题里显式写了月份就必须与文件名一致，否则 `## 2 月 30 日` 会被错当成 10 月 30 日
  if (headingMonth !== month) return null;
  // 使用文件中的真实年份做 UTC 回读，拒绝非闰年 2 月 29 日等不存在的日期。
  return new Date(Date.UTC(year, month - 1, day)).getUTCDate() === day ? day : null;
}

function getOrCreateDay(
  days: DailyDay[],
  year: number,
  month: number,
  day: number
): DailyDay {
  const date = `${year}-${pad(month)}-${pad(day)}`;
  const existing = days.find(item => item.date === date);
  // 同一天写了两次时合并到同一个 day，避免重复锚点
  if (existing) return existing;

  const created: DailyDay = {
    date,
    dayLabel: `${month} 月 ${day} 日`,
    dayNumber: String(day),
    // 用 UTC 取星期，完全不经过本地时区
    weekday: WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()],
    anchorId: `day-${date}`,
    entries: [],
  };
  days.push(created);
  return created;
}

/** 把 md body 解析成按日分组的结构，days 按日期倒序 */
export function parseDailyMonth(
  month: string,
  body: string,
  title?: string
): DailyMonth {
  const matched = MONTH_ID.exec(month);
  if (!matched) {
    throw new Error(
      `[daily] 文件名必须是 2026-10 这种格式，实际收到 "${month}"`
    );
  }
  const year = Number(matched[1]);
  const monthNumber = Number(matched[2]);

  const days: DailyDay[] = [];
  let current: DailyDay | null = null;

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trimEnd();

    // 1) 日期分节标题
    const heading = DAY_HEADING.exec(line);
    if (heading) {
      const day = parseDayNumber(heading[1], year, monthNumber);
      current = day === null ? null : getOrCreateDay(days, year, monthNumber, day);
      continue;
    }
    // 第一个日期节之前的内容、非日期小节内的内容，一律忽略
    if (!current) continue;

    // 2) 条目行
    const entry = ENTRY_LINE.exec(line);
    if (entry) {
      current.entries.push({
        name: entry[1].trim(),
        url: entry[2].trim(),
        // 去掉简介前的分隔符（— / – / -- / ：），允许完全省略
        desc: entry[3].replace(DESC_PREFIX, "").trim(),
      });
      continue;
    }

    // 3) 缩进续行：并入上一条简介
    if (CONTINUATION.test(line) && current.entries.length > 0) {
      const last = current.entries[current.entries.length - 1];
      last.desc = `${last.desc} ${line.trim()}`.trim();
    }
    // 其余（空行、散落段落）静默忽略
  }

  // 按日期倒序，与书写顺序无关，保证目录稳定
  const sortedDays = days.sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    month,
    year,
    monthNumber,
    label: title ?? `${year} 年 ${monthNumber} 月`,
    days: sortedDays,
    entryCount: sortedDays.reduce((sum, day) => sum + day.entries.length, 0),
  };
}

/**
 * 极简行内 Markdown → HTML：只支持 `代码`、**粗体**、[文字](链接)。
 * 中文正文不用斜体，故不处理 *em*。
 * 先整体转义再做替换，避免简介里的尖括号破坏结构。
 */
export function renderInline(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
}
