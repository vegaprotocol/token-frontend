import React from "react";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";
import "./wallet-card.scss";
import { useAnimateValue } from "../../hooks/use-animate-value";
import vegaWhite from "../../images/vega_white.png";

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

export const WalletCardActions = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="wallet-card__actions">{children}</div>;
};

export const WalletCardAsset = () => {
  return (
    <div className="wallet-card__asset">
      <img alt="Vega" src={vegaWhite} />
      <div className="wallet-card__asset-header">
        <div className="wallet-card__asset-heading">
          <h1>VEGA</h1>
          <h2>COLLATERAL</h2>
        </div>
        <div className="wallet-card__asset-balance">
          <span className="wallet-card__asset-balance--integer">211.</span>
          <span className="wallet-card__asset-balance--decimal">
            839204756388305833
          </span>
        </div>
      </div>
    </div>
  );
};
