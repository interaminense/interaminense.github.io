/**
 * @author Adriano Interaminense
 * Public pages shouldn't use MUI components due future improvements
 */

import { Footer } from "../components/Footer";
import { Layout } from "../components/layout/Layout";
import { Logo } from "../components/logo/Logo";
import { Presentation } from "../components/Presentation";
import { SocialNetwork } from "../components/social-network/SocialNetwork";
import { useDB } from "../contexts/DBContext";

export function Home() {
  const dbs = useDB();
  console.log(dbs);
  return (
    <Layout>
      <Layout.Header>
        <Logo />
        <SocialNetwork />
      </Layout.Header>
      <Layout.Body>
        <Layout.Presentation>
          <Presentation />
        </Layout.Presentation>
        <Layout.Paragraph>P1</Layout.Paragraph>
        <Layout.Paragraph>P2</Layout.Paragraph>
        <Layout.Paragraph>P3</Layout.Paragraph>
        <Layout.Paragraph>P4</Layout.Paragraph>
      </Layout.Body>
      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  );
}
