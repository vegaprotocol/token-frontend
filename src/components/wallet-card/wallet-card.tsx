import "./wallet-card.scss";

interface WalletCardProps {
  children: React.ReactNode;
}

export const WalletCard = ({ children }: WalletCardProps) => (
  <div className="wallet-card">{children}</div>
);

interface WalletCardHeaderProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const WalletCardHeader = ({
  children,
  onClick,
}: WalletCardHeaderProps) => {
  const className = [
    "wallet-card__header",
    onClick ? "wallet-card__header--expandable" : "",
  ].join(" ");
  return (
    <div onClick={onClick} className={className}>
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

interface WalletCardRowProps {
  children: React.ReactNode;
}

export const WalletCardRow = ({ children }: WalletCardRowProps) => (
  <div className="wallet-card__row">{children}</div>
);
