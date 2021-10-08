import React from "react";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";
import "./wallet-card.scss";
import { useAnimateValue } from "../../hooks/use-animate-value";

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
  useAnimateValue(ref, value);

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
