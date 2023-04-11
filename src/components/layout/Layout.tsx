import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Paragraph } from "./Paragraph";
import { Presentation } from "./Presentation";

import "./Layout.scss";
import { Breadcrumb } from "./Breadcrumb";

export function Layout({ children }: React.HTMLAttributes<HTMLElement>) {
  return <div className="layout">{children}</div>;
}

Layout.Header = Header;
Layout.Presentation = Presentation;
Layout.Footer = Footer;
Layout.Body = Body;
Layout.Paragraph = Paragraph;
Layout.Breadcrumb = Breadcrumb;
