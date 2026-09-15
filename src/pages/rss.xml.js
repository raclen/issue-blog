import rss from "@astrojs/rss";
import { getPosts } from "@/lib/posts";
import config from "@/config";

export async function GET(context) {
  const posts = await getPosts();

  return rss({
    title: config.site.title,
    description: config.site.description || "A blog powered by GitHub Issues.",
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id.replace(/\.(md|mdx)$/i, "")}/`,
    })),
  });
}
