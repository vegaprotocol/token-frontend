import "./heading.scss";

import vegaWhite from "../../images/vega_white.png";
import { Link } from "react-router-dom";
import { PixelatedText } from "../pixelated-text";

export interface HeadingProps {
  title: string;
}

export const Heading = ({ title }: HeadingProps) => {
  return (
    <header className="heading">
      <div className="heading__nav">
        <div className="heading__logo-container">
          <Link to="/">
            <img alt="Vega" src={vegaWhite} className="heading__logo" />
          </Link>
        </div>
      </div>
      <div className="heading__title-container">
        <h1 className="heading__title">
          <PixelatedText text={title} />
        </h1>
      </div>
    </header>
  );
};
