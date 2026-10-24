/**
 * @author Adriano Interaminense
 * Public pages shouldn't use MUI components due future improvements
 */

import { useParams } from "react-router-dom";
import { Footer } from "../components/footer/Footer";
import { Layout } from "../components/layout/Layout";
import { DetailedProject as DetailedProjectComponent } from "../components/detailed-project/DetailedProject";
import { useEffect, useState } from "react";
import { DBPath, TProject } from "../types";
import { Skeleton, SkeletonText } from "../components/skeleton/Skeleton";
import { DataBase } from "../firebase/database";

const projectsDB = new DataBase({ path: DBPath.Projects });

export function DetailedProject() {
  const { id } = useParams();

  const [project, setProject] = useState<TProject>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsDB.get(id as string).then((project) => {
      setProject(project as TProject);

      setLoading(false);
    });
  }, [id]);

  return (
    <Layout>
      <Layout.Body>
        <Layout.Breadcrumb />
      </Layout.Body>

      {loading ? (
        <Layout.Body size={1200}>
          <div aria-busy="true">
            <Layout.Paragraph>
              <Skeleton width={110} height="1em" />
            </Layout.Paragraph>
            <Skeleton width="55%" height="2.5rem" style={{ margin: "1rem 0 2rem" }} />
            <Skeleton height="clamp(200px, 40vw, 480px)" />
            <Layout.Paragraph>
              <SkeletonText lines={4} />
            </Layout.Paragraph>
          </div>
        </Layout.Body>
      ) : (
        <div className="fade-in">
          <DetailedProjectComponent project={project as TProject} />
        </div>
      )}

      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  );
}
