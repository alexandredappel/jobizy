
import { useEffect, useState } from "react";

export const RotatingText = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="inline-flex flex-col h-[1.2em] overflow-hidden">
      {words.map((word, i) => (
        <span
          key={word}
          className={`text-[#439915] font-bold absolute transition-transform duration-500`}
          style={{
            transform: `translateY(${(i - index) * 100}%)`,
            opacity: i === index ? 1 : 0,
            transition: "transform 0.5s ease, opacity 0.5s ease"
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};
