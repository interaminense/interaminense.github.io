import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Paragraph } from "./Paragraph";
import { Presentation } from "./Presentation";

import "./Layout.scss";
import { Breadcrumb } from "./Breadcrumb";
import { Logo } from "../logo/Logo";
import { SocialNetwork } from "../social-network/SocialNetwork";
import { ThemeSwitch } from "../theme-switch/ThemeSwitch";

export function Layout({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="layout">
      <Layout.Header>
        <div>
          <Logo />
        </div>

        <div className="layout--d-flex">
          <ThemeSwitch />
          <SocialNetwork />
        </div>
      </Layout.Header>

      {children}
    </div>
  );
}

Layout.Header = Header;
Layout.Presentation = Presentation;
Layout.Footer = Footer;
Layout.Body = Body;
Layout.Paragraph = Paragraph;
Layout.Breadcrumb = Breadcrumb;
