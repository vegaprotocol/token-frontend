import React from "react";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";
import "./wallet-card.scss";
import { useAnimateValue } from "../../hooks/use-animate-value";

interface WalletCardProps {
  children: React.ReactNode;
  dark?: boolean;
}

export const WalletCard = ({ dark, children }: WalletCardProps) => (
  <div className={`wallet-card ${dark ? "wallet-card--inverted" : ""}`}>
    {children}
  </div>
);

interface WalletCardHeaderProps {
  children: React.ReactNode;
  dark?: boolean;
}

export const WalletCardHeader = ({ children, dark }: WalletCardHeaderProps) => {
  return (
    <div
      className={`wallet-card__header ${
        dark ? "wallet-card__header--inverted" : ""
      }`}
    >
      {children}
    </div>
  );
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
  bold = false,
}: {
  label: string;
  value?: BigNumber | null;
  valueSuffix?: string;
  dark?: boolean;
  bold?: boolean;
}) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  useAnimateValue(ref, value);

  return (
    <div
      className={`wallet-card__row ${dark ? "wallet-card__row--dark" : ""} ${
        bold ? "wallet-card__row--bold" : ""
      }`}
      ref={ref}
    >
      <span>{label}</span>
      {value && (
        <span>
          {value ? formatNumber(value) : ""} {valueSuffix}
        </span>
      )}
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

export interface WalletCardAssetProps {
  image: string;
  name: string;
  symbol: string;
  balance: BigNumber;
  decimals: number;
  border?: boolean;
}

export const WalletCardAsset = ({
  image,
  name,
  symbol,
  balance,
  decimals,
  border,
}: WalletCardAssetProps) => {
  const [integers, decimalsPlaces] = React.useMemo(() => {
    // @ts-ignore
    const separator = BigNumber.config().FORMAT.decimalSeparator as string;
    const [integers, decimalsPlaces] = formatNumber(balance, decimals)
      .toString()
      .split(separator);
    return [integers, decimalsPlaces];
  }, [balance, decimals]);
  return (
    <div className="wallet-card__asset">
      <img
        alt="Vega"
        src={image}
        className={`wallet-card__asset-image ${
          border ? "wallet-card__asset-image--border" : ""
        }`}
      />
      <div className="wallet-card__asset-header">
        <div className="wallet-card__asset-heading">
          <h1>{name}</h1>
          <h2>{symbol}</h2>
        </div>
        <div className="wallet-card__asset-balance">
          <span className="wallet-card__asset-balance--integer">
            {integers}.
          </span>
          <span className="wallet-card__asset-balance--decimal">
            {decimalsPlaces}
          </span>
        </div>
      </div>
    </div>
  );
};
