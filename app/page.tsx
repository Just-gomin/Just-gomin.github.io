export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col justify-center gap-16">
      <p className="text-(length:--font-size-display) font-bold">
        Done is better than Perfect.
      </p>
      <p className="text-(length:--font-size-display) font-bold">
        Read, write, organize.
      </p>
      <p className="text-(length:--font-size-display) font-bold">
        Working on{" "}
        <a
          href="https://www.beyo.io"
          className="font-bold underline underline-offset-8"
          target="_blank"
          rel="noopener noreferrer"
        >
          beyo
        </a>{" "}
        as{" "}
        <a
          href="/resume"
          className="font-bold underline underline-offset-8"
          target="_blank"
          rel="noopener noreferrer"
        >
          Product Engineer
        </a>{" "}
        now.
      </p>
    </div>
  );
}
