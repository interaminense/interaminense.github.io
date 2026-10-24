/**
 * @author Adriano Interaminense
 * Public pages shouldn't use MUI components due future improvements
 */

import { Link, useSearchParams } from "react-router-dom";
import { Footer } from "../components/footer/Footer";
import { Layout } from "../components/layout/Layout";
import { Projects as ProjectsComponent } from "../components/projects/Projects";
import { Title } from "../components/title/Title";

export function Projects() {
  const [searchParams] = useSearchParams();
  const skill = searchParams.get("skill") ?? undefined;

  return (
    <Layout>
      <Layout.Body size={1200}>
        <Layout.Breadcrumb />
      </Layout.Body>

      <Layout.Body size={1200}>
        <div className="projects-page__heading">
          <Title>{skill ? `Projects using ${skill}` : "Side projects"}</Title>

          {skill && (
            <Link className="projects-page__clear" to="/projects">
              Show all projects
            </Link>
          )}
        </div>

        <Layout.Paragraph>
          <ProjectsComponent skill={skill} />
        </Layout.Paragraph>
      </Layout.Body>

      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  );
}
