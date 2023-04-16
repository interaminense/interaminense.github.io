// @ts-nocheck

import { useEffect, useRef, useState } from "react";
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

  async function handleUpdateReaction(key: string, count: number) {
    console.log(count);
    const newReactions = {
      ...reactions,
      [key]: (reactions?.[key as keyof TReactions] as number) + count,
    };

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
          <Reaction
            key={key}
            icon={key}
            onClick={(count) => handleUpdateReaction(key, count)}
            value={formatNumber(items[key as keyof TReactions] as number)}
          />
        ))}
    </div>
  );
}

interface IReactionProps {
  onClick: (count: number) => void;
  value: string;
  icon: string;
}

function Reaction({ onClick, value, icon }: IReactionProps) {
  const [count, setCount] = useState(0);
  const [showReaction, setShowReaction] = useState(false);
  const timeoutRef = useRef(null);

  return (
    <div
      onClick={() => {
        let count = 0;
        clearTimeout(timeoutRef.current);
        setCount((newVal) => {
          count = newVal + 1;

          return count;
        });

        timeoutRef.current = setTimeout(() => {
          setShowReaction(true);
          onClick(count);

          setTimeout(() => {
            count = 0;
            setCount(count);
            setShowReaction(false);
          }, 500);
        }, 500);
      }}
      className="reactions__items"
    >
      <span className="reactions__items-total">{value}</span>
      <span className="reactions__items-icon">{icon}</span>

      {showReaction && <span className="reactions__animation">+{count}</span>}
    </div>
  );
}
