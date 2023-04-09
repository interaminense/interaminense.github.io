import { createContext, useContext, useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { Loading } from "../components/Loading";
import { config } from "../firebase/config";
import { DataBase } from "../firebase/database";
import {
  DBPath,
  TProfile,
  TProject,
  TSocialNetwork,
  TLink,
  TReactions,
  TSkill,
} from "../types";

type TData = {
  profile: TProfile | null;
  projects: TProject[] | [];
  socialNetwork: TSocialNetwork[] | [];
  links: TLink[] | [];
  reactions: TReactions[] | [];
  skills: TSkill[] | [];
};

const initialData = {
  profile: null,
  projects: [],
  socialNetwork: [],
  links: [],
  reactions: [],
  skills: [],
};
const DBContext = createContext<TData>(initialData);

function connectDB(path: DBPath) {
  return new DataBase({ path, disableLog: true }, config);
}

const profileDB = connectDB(DBPath.Profile);
const projectsDB = connectDB(DBPath.Projects);
const socialNetworkDB = connectDB(DBPath.SocialNetwork);
const linksDB = connectDB(DBPath.Links);
const reactionsDB = connectDB(DBPath.Reactions);
const skillsDB = connectDB(DBPath.Skills);

console.log(profileDB);

export function DBContextProvider({
  children,
}: React.HTMLAttributes<HTMLElement>) {
  const { auth } = useAppContext();
  const [data, setData] = useState<TData>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function signIn() {
      await auth?.signIn();

      profileDB.listData((profileData) => {
        projectsDB.listData((projectsData) => {
          socialNetworkDB.listData((socialNetworkData) => {
            reactionsDB.listData((reactionsData) => {
              linksDB.listData((linksData) => {
                skillsDB.listData((skillsData) => {
                  setLoading(false);

                  setData({
                    profile: profileData.data[0] as TProfile,
                    projects: projectsData.data as TProject[],
                    reactions: reactionsData.data as TReactions[],
                    skills: skillsData.data as TSkill[],
                    socialNetwork: socialNetworkData.data as TSocialNetwork[],
                    links: linksData.data as TLink[],
                  });
                });
              });
            });
          });
        });
      });
    }

    signIn();
  }, [auth]);

  if (loading) {
    return <Loading />;
  }

  return (
    <DBContext.Provider value={{ ...data }}>{children}</DBContext.Provider>
  );
}

export function useDB() {
  return useContext(DBContext);
}
