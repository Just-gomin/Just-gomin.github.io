"use client";

import { useEffect, useState } from "react";
import { type Segment, totalLength, visibleSegments } from "../lib/typewriter";
import { Cursor } from "./Cursor";

type TypewriterProps = {
  /** 단순 문자열. `segments`가 있으면 무시합니다. */
  text?: string;
  /** 링크가 섞인 글. */
  segments?: Segment[];
  /** 글자 사이 간격(ms). */
  speed?: number;
  /** 시작 전 기다림(ms). */
  delay?: number;
  onDone?: () => void;
  /** 타이핑하는 동안 커서를 보여 줍니다. */
  cursor?: boolean;
};

/** 글자를 하나씩 타이핑하듯 보여 줍니다. */
export function Typewriter({
  text = "",
  segments,
  speed = 24,
  delay = 0,
  onDone,
  cursor = true,
}: TypewriterProps) {
  const parts = segments ?? [{ text }];
  const total = totalLength(parts);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let typed = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      typed += 1;
      setCount(typed);
      if (typed < total) timer = setTimeout(tick, speed);
      else onDone?.();
    };
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
    // 글이 바뀌면 부모가 key를 바꿔 처음부터 다시 그립니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, speed, delay]);

  return (
    <span>
      {visibleSegments(parts, count).map((part, index) =>
        part.href ? (
          <a
            key={index}
            className="link"
            href={part.href}
            target={part.external ? "_blank" : undefined}
            rel={part.external ? "noreferrer" : undefined}
          >
            {part.text}
          </a>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
      {cursor && count < total && <Cursor accent />}
    </span>
  );
}
