import { generateNoteStaticParams, getNote } from "@/features/note";

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = generateNoteStaticParams;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const note = getNote(slug);
  return {
    title: note.title,
    description: note.description,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  try {
    const _ = getNote(slug);
    const { default: Note } = await import(`@/content/notes/${slug}/index.mdx`);

    return <Note />;
  } catch (e) {
    console.error(`Not valid slug. slug: ${slug}, `);
    throw e;
  }
}
