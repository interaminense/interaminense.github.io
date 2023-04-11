/**
 * @author Adriano Interaminense
 * Public pages shouldn't use MUI components due future improvements
 */

import { Footer } from "../components/footer/Footer";
import { Layout } from "../components/layout/Layout";
import { Logo } from "../components/logo/Logo";
import { Projects as ProjectsComponent } from "../components/projects/Projects";
import { SocialNetwork } from "../components/social-network/SocialNetwork";
import { Title } from "../components/title/Title";

export function Projects() {
  return (
    <Layout>
      <Layout.Header>
        <Logo />

        <SocialNetwork />
      </Layout.Header>

      <Layout.Body>
        <Layout.Breadcrumb />
      </Layout.Body>

      <Layout.Body size={1200}>
        <Title>Projects For Fun</Title>

        <Layout.Paragraph>
          <ProjectsComponent />
        </Layout.Paragraph>
      </Layout.Body>

      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  );
}
