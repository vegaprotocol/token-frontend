import "./callout.scss";

export const Callout = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="callout">
      {icon && <div>{icon}</div>}
      <div>{children}</div>
    </div>
  );
};
