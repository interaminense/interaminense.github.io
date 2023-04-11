/**
 * @author Adriano Interaminense
 * Public pages shouldn't use MUI components due future improvements
 */

import { Link } from "react-router-dom";
import { Footer } from "../components/footer/Footer";
import { HTMLRenderer } from "../components/HTMLRenderer";
import { Layout } from "../components/layout/Layout";
import { Links } from "../components/Links/Links";
import { Logo } from "../components/logo/Logo";
import { Paragraph } from "../components/paragraph/Paragraph";
import { Presentation } from "../components/presentation/Presentation";
import { Projects } from "../components/projects/Projects";
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
          <Title>Main Skills</Title>

          <Skills />
        </Layout.Paragraph>

        <Layout.Paragraph>
          <Title>More About Me</Title>

          <Paragraph>
            <HTMLRenderer html={profile?.about as string} />
          </Paragraph>
        </Layout.Paragraph>
      </Layout.Body>
      <div className="layout__projects">
        <Layout.Body size={1200}>
          <Title>Projects For Fun</Title>

          <Layout.Paragraph>
            <Projects featured />

            <Link className="layout__link" to="/projects">
              see all projects
            </Link>
          </Layout.Paragraph>
        </Layout.Body>
      </div>
      <Layout.Body>
        <Layout.Paragraph>
          <Title>Links</Title>

          <Links />
        </Layout.Paragraph>
      </Layout.Body>

      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  );
}
