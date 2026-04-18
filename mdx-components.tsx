import { MDXComponents } from "mdx/types";
import React from "react";
import { codeToHtml } from "shiki";

function Heading1({ children }: React.ComponentPropsWithoutRef<"h1">) {
  return (
    <h1 className="mt-8 mb-4 text-(length:--font-size-heading) font-bold">
      {children}
    </h1>
  );
}

function Heading2({ children }: React.ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 className="mt-6 mb-3 text-(length:--font-size-subheading) font-bold">
      {children}
    </h2>
  );
}

function Heading3({ children }: React.ComponentPropsWithoutRef<"h3">) {
  return (
    <h3 className="mt-4 mb-2 text-(length:--font-size-body) font-bold">
      {children}
    </h3>
  );
}

function Paragraph({ children }: React.ComponentPropsWithoutRef<"p">) {
  return <p className="mb-4 leading-relaxed">{children}</p>;
}

function Code({ children }: React.ComponentPropsWithoutRef<"code">) {
  return (
    <code className="font-nanum-gothic-coding rounded bg-black/5 px-1">
      {children}
    </code>
  );
}

async function Pre({ children }: React.ComponentPropsWithoutRef<"pre">) {
  if (!React.isValidElement(children)) {
    return <pre>{children}</pre>;
  }

  const props = children.props as { className?: string; children?: string };
  const lang = props.className?.match(/language-(\w+)/)?.[1] ?? "text";
  const codeString = props.children ?? "";

  const highlighted = await codeToHtml(codeString, {
    lang,
    theme: "vitesse-light",
  });

  return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

function Anchor({ href, children }: React.ComponentPropsWithoutRef<"a">) {
  return (
    <a
      href={href}
      className="underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function UnorderedList({ children }: React.ComponentPropsWithoutRef<"ul">) {
  return (
    <ul className="mb-4 list-inside list-disc space-y-1 pl-4">{children}</ul>
  );
}

function OrderedList({ children }: React.ComponentPropsWithoutRef<"ol">) {
  return (
    <ol className="mb-4 list-inside list-decimal space-y-1 pl-4">{children}</ol>
  );
}

function ListItem({ children }: React.ComponentPropsWithoutRef<"li">) {
  return <li>{children}</li>;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    p: Paragraph,
    code: Code,
    pre: Pre,
    a: Anchor,
    ul: UnorderedList,
    ol: OrderedList,
    li: ListItem,
  };
}
