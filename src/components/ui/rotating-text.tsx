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
      setIndex(current => (current + 1) % words.length);
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
            let offset = i - index;
            // Ajuster l'offset pour créer un roulement continu
            if (offset > words.length / 2) offset -= words.length;
            if (offset < -words.length / 2) offset += words.length;
            
            return (
              <span
                key={word}
                className="text-[#439915] font-bold absolute w-full text-center transition-all duration-500"
                style={{
                  transform: `translateY(${offset * 100}%)`,
                  opacity: offset === 0 ? 1 : 0.2,
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "100%"
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
