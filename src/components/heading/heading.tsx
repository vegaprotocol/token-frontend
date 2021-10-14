import "./heading.scss";
import { PixelatedText } from "../pixelated-text";

export interface HeadingProps {
  title?: string;
}

export const Heading = ({ title }: HeadingProps) => {
  if (!title) return null;

  return (
    <>
      <header className="heading">
        <div className="heading__title-container">
          <h1 className="heading__title">
            <PixelatedText text={title} />
          </h1>
        </div>
      </header>
    </>
  );
};
