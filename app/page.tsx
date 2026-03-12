import { BLOG_DESCRIPTION, BLOG_TITLE } from "@/lib/constants";

export default function Home() {
  return (
    <div>
      <h1>{BLOG_TITLE}</h1>
      <p>{BLOG_DESCRIPTION}</p>
    </div>
  );
}
