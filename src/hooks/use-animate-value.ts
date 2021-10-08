import React from "react";
import { BigNumber } from "../lib/bignumber";
import { Colors } from "../config";
import { usePrevious } from "./use-previous";

const FLASH_DURATION = 1200; // Duration of flash animation in milliseconds

export function useAnimateValue(
  elRef: React.MutableRefObject<HTMLElement | null>,
  value?: BigNumber | null
) {
  const previous = usePrevious(value);
  if (value && previous && value.isLessThan(previous)) {
    elRef.current?.animate(
      [
        { backgroundColor: Colors.VEGA_RED, color: Colors.WHITE },
        { backgroundColor: Colors.VEGA_RED, color: Colors.WHITE, offset: 0.8 },
        { backgroundColor: Colors.GRAY_LIGHT, color: Colors.WHITE },
      ],
      FLASH_DURATION
    );
  } else if (value && previous && value.isGreaterThan(previous)) {
    elRef.current?.animate(
      [
        { backgroundColor: Colors.VEGA_GREEN, color: Colors.WHITE },
        {
          backgroundColor: Colors.VEGA_GREEN,
          color: Colors.WHITE,
          offset: 0.8,
        },
        { backgroundColor: Colors.GRAY_LIGHT, color: Colors.WHITE },
      ],
      FLASH_DURATION
    );
  }
}
