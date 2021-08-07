import React from "react";

export const PixelatedText = ({
  text,
  threshold = 0.6,
}: {
  text: string;
  threshold?: number;
}) => {
  // useMemo so it doesn't re-randomize the text on every render
  const chars = React.useMemo(() => {
    console.log("update spans");
    return text.split("").map((char, i) => (
      <span
        key={i}
        className={Math.random() > threshold ? "text-pixelated" : ""}
      >
        {char}
      </span>
    ));
  }, [text, threshold]);

  return <>{chars}</>;
};
