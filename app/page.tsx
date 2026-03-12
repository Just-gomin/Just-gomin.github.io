import { BLOG_DESCRIPTION, BLOG_TITLE } from "@/lib/constants";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>{BLOG_TITLE}</h1>
      <p>{BLOG_DESCRIPTION}</p>
      <Link href={"/resume"}>RESUME</Link>
    </div>
  );
}
