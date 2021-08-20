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
  return (
    <div onClick={onClick} className="wallet-card__header">
      {children}
    </div>
  );
};

interface WalletCardRowProps {
  children: React.ReactNode;
}

export const WalletCardRow = ({ children }: WalletCardRowProps) => (
  <div className="wallet-card__row">{children}</div>
);
