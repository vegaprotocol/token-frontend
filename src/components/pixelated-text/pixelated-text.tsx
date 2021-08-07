export const PixelatedText = ({
  text,
  threshold = 0.6,
}: {
  text: string;
  threshold?: number;
}) => {
  return (
    <>
      {text.split("").map((char) => (
        <span className={Math.random() > threshold ? "text-pixelated" : ""}>
          {char}
        </span>
      ))}
    </>
  );
};
