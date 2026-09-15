import { slugifyStr } from "./slugify";

export function getTagSlug(tag: string): string {
  const s = slugifyStr(tag);
  return s || encodeURIComponent(tag);
}

export function getTagUrl(tag: string): string {
  return `/tags/${getTagSlug(tag)}/`;
}
