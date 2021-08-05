import "./callout.scss";

export const Callout = ({
  children,
  intent,
  icon,
}: {
  children: React.ReactNode;
  intent?: "success" | "error" | "warn";
  icon?: React.ReactNode;
}) => {
  const className = ["callout", intent ? `callout--${intent}` : ""].join(" ");
  return (
    <div className={className}>
      {icon && <div>{icon}</div>}
      <div>{children}</div>
    </div>
  );
};
