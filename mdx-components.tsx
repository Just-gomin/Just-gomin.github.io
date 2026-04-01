import { MDXComponents } from "mdx/types";
import React from "react";
import { codeToHtml } from "shiki";

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

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components, pre: Pre };
}
