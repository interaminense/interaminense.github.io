import { useEffect, useState } from "react";
import { DataBase } from "../../firebase/database";
import { DBPath, TReactions } from "../../types";
import { formatNumber } from "../../utils/numbers";
import { Loading } from "../Loading";

import "./Reactions.scss";

const reactionsDB = new DataBase({ path: DBPath.Reactions });

interface IReactionsProps {
  reactionId: string;
  size?: "small" | "default";
}

export function Reactions({ reactionId, size = "default" }: IReactionsProps) {
  const [reactions, setReactions] = useState<TReactions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reactionsDB?.getLive(reactionId, (reaction) => {
      setReactions(reaction as TReactions);
      setLoading(false);
    });
  }, [reactionId]);

  async function handleUpdateReaction(key: string) {
    const newReactions = {
      ...reactions,
      [key]: (reactions?.[key as keyof TReactions] as number) + 1,
    };

    setReactions(newReactions as TReactions);

    await reactionsDB.update(reactionId, newReactions as TReactions);
  }

  if (loading) {
    return <Loading />;
  }

  const { createDate, id, ...reactionsKeys } = reactions as TReactions;

  const items = reactionsKeys as Partial<TReactions>;

  return (
    <div className={`reactions reactions--${size}`}>
      {reactions &&
        Object.keys(reactionsKeys).map((key) => (
          <div
            onClick={() => handleUpdateReaction(key)}
            className="reactions__items"
            key={key}
          >
            <span className="reactions__items-total">
              {formatNumber(items[key as keyof TReactions] as number)}
            </span>
            <span className="reactions__items-icon">{key}</span>
          </div>
        ))}
    </div>
  );
}
