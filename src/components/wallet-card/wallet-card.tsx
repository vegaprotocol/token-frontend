import React from "react";
import { BigNumber } from "../../lib/bignumber";
import { Colors } from "../../config";
import { formatNumber } from "../../lib/format-number";
import "./wallet-card.scss";

const FLASH_DURATION = 1200; // Duration of flash animation in milliseconds

interface WalletCardProps {
  children: React.ReactNode;
}

export const WalletCard = ({ children }: WalletCardProps) => (
  <div className="wallet-card invert">{children}</div>
);

interface WalletCardHeaderProps {
  children: React.ReactNode;
}

export const WalletCardHeader = ({ children }: WalletCardHeaderProps) => {
  return <div className="wallet-card__header">{children}</div>;
};

interface WalletCardContentProps {
  children: React.ReactNode;
}

export const WalletCardContent = ({ children }: WalletCardContentProps) => {
  return <div className="wallet-card__content">{children}</div>;
};

function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T | undefined>();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export const WalletCardRow = ({
  label,
  value,
  valueSuffix,
  dark = false,
}: {
  label: string;
  value?: BigNumber | null;
  valueSuffix?: string;
  dark?: boolean;
}) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const previous = usePrevious(value);
  if (value && previous && value.isLessThan(previous)) {
    ref.current?.animate(
      [
        { backgroundColor: Colors.VEGA_RED, color: Colors.WHITE },
        { backgroundColor: Colors.VEGA_RED, color: Colors.WHITE, offset: 0.8 },
        { backgroundColor: Colors.GRAY_LIGHT, color: Colors.WHITE },
      ],
      FLASH_DURATION
    );
  } else if (value && previous && value.isGreaterThan(previous)) {
    ref.current?.animate(
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
  return (
    <div
      className={`wallet-card__row ${dark ? "wallet-card__row--dark" : ""}`}
      ref={ref}
    >
      <span>{label}</span>
      <span>
        {value ? formatNumber(value) : ""} {valueSuffix}
      </span>
    </div>
  );
};

export const WalletCardActions = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="wallet-card__actions">{children}</div>;
};
