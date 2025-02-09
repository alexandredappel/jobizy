import { useEffect, useState, useRef } from "react";

export const RotatingText = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
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
      setIsAnimating(true);
      setIndex((current) => (current + 1) % words.length);
      setTimeout(() => setIsAnimating(false), 500); // Durée de la transition
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <>
      <span 
        ref={measureRef}
        className="text-[#439915] font-bold absolute opacity-0 pointer-events-none"
        aria-hidden="true"
      />
      
      <span className="inline-block relative" style={{ width: width ? `${width}px` : 'auto' }}>
        <span className="relative block overflow-hidden w-full" style={{ height: "1.2em", lineHeight: "1.2em" }}>
          {words.map((word, i) => {
            const isCurrentWord = i === index;
            const isPreviousWord = i === ((index - 1 + words.length) % words.length);
            
            return (
              <span
                key={word}
                className="text-[#439915] font-bold absolute w-full text-center transition-all duration-500"
                style={{
                  transform: isAnimating ? 'translateY(-100%)' : 'translateY(0)',
                  opacity: isCurrentWord ? 1 : 0,
                  top: isCurrentWord ? 'auto' : '100%',
                  bottom: isCurrentWord ? 0 : 'auto',
                  left: 0,
                  right: 0,
                  height: "100%",
                  display: "block",
                  transition: "all 500ms ease"
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
      </span>
    </>
  );
};
