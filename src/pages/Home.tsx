/**
 * @author Adriano Interaminense
 * Public pages shouldn't use MUI components due future improvements
 */

import { Footer } from "../components/footer/Footer";
import { HTMLRenderer } from "../components/HTMLRenderer";
import { Layout } from "../components/layout/Layout";
import { Links } from "../components/Links";
import { Logo } from "../components/logo/Logo";
import { Presentation } from "../components/presentation/Presentation";
import { Skills } from "../components/Skills";
import { SocialNetwork } from "../components/social-network/SocialNetwork";
import { Title } from "../components/title/Title";
import { useProfileDB } from "../contexts/ProfileDBContext";

export function Home() {
  const { profile } = useProfileDB();

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

        <Layout.Paragraph>
          <Title label="More About Me" />

          <HTMLRenderer html={profile?.about as string} />
        </Layout.Paragraph>
        <Layout.Paragraph>
          <Title label="Main Skills" />

          <Skills />
        </Layout.Paragraph>
        <Layout.Paragraph>
          <Title label="Links" />

          <Links />
        </Layout.Paragraph>
        <Layout.Paragraph>P4</Layout.Paragraph>
      </Layout.Body>
      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  );
}
