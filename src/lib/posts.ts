import { type CollectionEntry, getCollection } from "astro:content";
import { getTagSlug } from "@/utils/tagUrl";

export async function getPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

// 与标签路由使用同一 slug 聚合；同一篇文章的大小写变体只计一次，显示名保留原样。
export function getTagsWithCount(posts: CollectionEntry<"blog">[]) {
  const tags = new Map<string, { tag: string; count: number }>();

  for (const post of posts) {
    const seen = new Set<string>();
    for (const tag of post.data.tags) {
      if (!tag) continue;
      const slug = getTagSlug(tag);
      if (seen.has(slug)) continue;
      seen.add(slug);

      const existing = tags.get(slug);
      if (existing) existing.count += 1;
      else tags.set(slug, { tag, count: 1 });
    }
  }

  return Array.from(tags.values()).sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN")
  );
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
