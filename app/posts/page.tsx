import { getAllPosts } from "@/features/post";
import { format } from "date-fns";
import Link from "next/link";

export default function Posts() {
  const postList = getAllPosts();

  return (
    <div>
      <Link href="/">/</Link>
      <p>This is Posts page.</p>
      <br />
      {postList.map((post) => (
        <Link key={post.slug} href={`/posts/${post.slug}`}>
          <p>
            {post.title} | {format(post.date, "yyyy-MM-dd")} |{" "}
            {post.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
