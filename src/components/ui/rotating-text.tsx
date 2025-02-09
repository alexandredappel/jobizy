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
    <span className="inline-block relative">
      <span className="relative h-[1.5em] block overflow-hidden">
        {words.map((word, i) => (
          <span
            key={word}
            className="text-[#439915] font-bold absolute inset-0 flex items-center justify-center transition-all duration-500"
            style={{
              transform: `translateY(${(i - index) * 100}%)`,
              opacity: i === index ? 1 : 0,
            }}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
};
