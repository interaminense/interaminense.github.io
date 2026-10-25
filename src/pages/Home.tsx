/**
 * @author Adriano Interaminense
 * Public pages shouldn't use MUI components due future improvements
 */

import { Link } from "react-router-dom";
import { Footer } from "../components/footer/Footer";
import { HTMLRenderer } from "../components/HTMLRenderer";
import { Layout } from "../components/layout/Layout";
import { Links } from "../components/Links/Links";
import { Paragraph } from "../components/paragraph/Paragraph";
import { Presentation } from "../components/presentation/Presentation";
import { Projects } from "../components/projects/Projects";
import { SkeletonText } from "../components/skeleton/Skeleton";
import { SiteActivity, SiteNumbers } from "../components/site-activity/SiteActivity";
import { Skills } from "../components/Skills";
import { Title } from "../components/title/Title";
import { useProfileDB } from "../contexts/ProfileDBContext";

export function Home() {
  const { profile } = useProfileDB();

  return (
    <Layout>
      <Layout.Body size={1200}>
        <SiteNumbers />

        <Layout.Presentation>
          <Presentation />
        </Layout.Presentation>

        <section className="layout__section">
          <Title>Skills</Title>

          <Skills />
        </section>

        <section className="layout__section">
          <Title>About me</Title>

          {!profile ? (
            <SkeletonText lines={8} />
          ) : (
            <div className="fade-in">
              <Paragraph>
                <HTMLRenderer html={profile?.about as string} />
              </Paragraph>
            </div>
          )}
        </section>
      </Layout.Body>

      <section className="layout__projects">
        <Layout.Body size={1200}>
          <Title>Side projects</Title>

          <Projects featured />

          <Link
            className="layout__link"
            to={"/projects"}
            onClick={() => {
              window.Analytics.track("clickOnSeeAllButton", {});
            }}
          >
            See all projects
          </Link>
        </Layout.Body>
      </section>

      <Layout.Body size={1200}>
        <section className="layout__section layout__section--stacked">
          <Title>Visitors</Title>

          <SiteActivity />
        </section>

        <section className="layout__section">
          <Title>Links</Title>

          <Links />
        </section>
      </Layout.Body>

      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  );
}

export default Home;
