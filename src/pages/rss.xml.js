import rss from "@astrojs/rss";
import { getPosts } from "@/lib/posts";

export async function GET(context) {
  const posts = await getPosts();

  return rss({
    title: "Issue Blog",
    description: "A blog powered by GitHub Issues.",
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id.replace(/\.(md|mdx)$/i, "")}/`,
    })),
  });
}
