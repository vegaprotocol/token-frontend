import { Heading } from "../heading";
import { Notice } from "../notice";

const vestingAddress = "0x23d1bFE8fA50a167816fBD79D7932577c06011f4";

interface DefaultTemplateProps {
  children: React.ReactNode;
  title?: React.ReactNode | string;
}

export function DefaultTemplate({ children, title }: DefaultTemplateProps) {
  return (
    <div className="app-wrapper">
      <Heading title={title} />
      <main>{children}</main>
      <footer>
        <Notice vestingAddress={vestingAddress} />
      </footer>
    </div>
  );
}
