import "./loader.scss";
import React from "react";

export const Loader = () => {
  const [, forceRender] = React.useState(false);
  React.useEffect(() => {
    const interval = setInterval(() => {
      forceRender((x) => !x);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="loader">
      {new Array(9).fill(null).map((_, i) => {
        return (
          <span
            key={i}
            style={{
              opacity: Math.random() > 0.5 ? 1 : 0,
            }}
          />
        );
      })}
    </span>
  );
};
