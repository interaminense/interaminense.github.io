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
import { Loading } from "../components/Loading";
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

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout>
      <Layout.Body>
        <Layout.Breadcrumb />
      </Layout.Body>

      <DetailedProjectComponent project={project as TProject} />

      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  );
}
