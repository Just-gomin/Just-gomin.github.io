export default function Home() {
  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-48px)] gap-16">
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
          className="underline underline-offset-8 font-bold"
          target="_blank"
          rel="noopener noreferrer"
        >
          beyo
        </a>{" "}
        as{" "}
        <a
          href="/resume"
          className="underline underline-offset-8 font-bold"
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
