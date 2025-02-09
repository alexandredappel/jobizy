import { useEffect, useState, useRef } from "react";

export const RotatingText = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number>(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (measureRef.current) {
      const maxWidth = Math.max(...words.map(word => {
        measureRef.current!.textContent = word;
        return measureRef.current!.getBoundingClientRect().width;
      }));
      setWidth(maxWidth);
    }
  }, [words]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  const getTransform = (i: number) => {
    if (i === index) return 'translateY(0)';
    if (i === ((index - 1 + words.length) % words.length)) return 'translateY(-100%)';
    return 'translateY(100%)';
  };

  return (
    <>
      <span 
        ref={measureRef}
        className="text-[#439915] font-bold absolute opacity-0 pointer-events-none"
        aria-hidden="true"
      />
      
      <span className="inline-block relative" style={{ width: width ? `${width}px` : 'auto' }}>
        <span className="relative block overflow-hidden w-full" style={{ height: "1.2em", lineHeight: "1.2em" }}>
          {words.map((word, i) => (
            <span
              key={word}
              className="text-[#439915] font-bold absolute w-full text-center transition-all duration-500"
              style={{
                transform: getTransform(i),
                opacity: i === index ? 1 : 0,
                top: 0,
                left: 0,
                right: 0,
                height: "100%",
                display: "block"
              }}
            >
              {word}
            </span>
          ))}
        </span>
      </span>
    </>
  );
};
