import React from "react";

export const PixelatedText = ({ text = "" }: { text?: string }) => {
  // useMemo so it doesn't re-randomize the text on every render
  const chars = React.useMemo(() => {
    const charArray = text.split("");
    const threshold = 1 - 3 / (charArray.length - 1);
    return charArray.map((char, i) => (
      <span
        key={i}
        className={Math.random() > threshold ? "text-pixelated" : ""}
      >
        {char}
      </span>
    ));
  }, [text]);

  return <>{chars}</>;
};
