import { generatePostStaticParams, getPost } from "@/features/post";

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = generatePostStaticParams;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  try {
    const _ = getPost(slug);
    const { default: Post } = await import(`@/content/posts/${slug}/index.mdx`);

    return <Post />;
  } catch (e) {
    console.error(`Not valid slug. slug: ${slug}, `);
    throw e;
  }
}
