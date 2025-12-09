import BlogSidebar from "../components/BlogSidebar";
import BlogMiniMap from "../components/BlogMiniMap";
import Markdown from "../components/Markdown";
import { getAllPosts } from "../../utils/posts/posts";

export default function BlogHome() {
  const posts = getAllPosts();
  const latest = posts[0];

  return (
    <div className="flex">
      <BlogSidebar posts={posts} />

      <main className="flex-1 p-8 prose max-w-3xl">
        <h1>{latest.title}</h1>
        <Markdown content={latest.content} />
      </main>

      <BlogMiniMap />
    </div>
  );
}