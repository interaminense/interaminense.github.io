import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../AppContext";
import { DataBase } from "../../firebase/database";
import { DBPath, TReactions } from "../../types";
import { TOTAL_REACTION_COUNT } from "../../utils/constants";
import { formatNumber } from "../../utils/numbers";

import { Skeleton } from "../skeleton/Skeleton";

import "./Reactions.scss";

const reactionsDB = new DataBase({ path: DBPath.Reactions });

interface IReactionsProps {
  reactionId: string;
  size?: "small" | "default";
}

export function Reactions({ reactionId, size = "default" }: IReactionsProps) {
  const [reactions, setReactions] = useState<TReactions | null>(null);

  useEffect(() => {
    reactionsDB?.getLive(reactionId, (reaction) => {
      setReactions(reaction as TReactions);
    });
  }, [reactionId]);

  async function handleUpdateReaction(key: string, count: number) {
    const newReactions = {
      ...reactions,
      [key]: (reactions?.[key as keyof TReactions] as number) + count,
    };

    await reactionsDB.update(reactionId, newReactions as TReactions);
  }

  const { createDate, id, ...reactionsKeys } = (reactions as TReactions) || {};

  const items = reactionsKeys as Partial<TReactions>;

  return (
    <div
      className={`reactions reactions--${size}`}
      aria-busy={!reactions}
    >
      {!reactions &&
        Array.from({ length: 5 }, (_, index) => (
          <Skeleton
            key={index}
            shape="pill"
            inline
            className="reactions__items"
            width={size === "small" ? 34 : 52}
            height={size === "small" ? 14 : 18}
          />
        ))}

      {reactions &&
        Object.keys(reactionsKeys).map((key, index) => (
          <Reaction
            index={index}
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
  index: number;
  onClick: (count: number) => void;
  value: string;
  icon: string;
}

function Reaction({ index, onClick, value, icon }: IReactionProps) {
  const [count, setCount] = useState(0);
  const [showReaction, setShowReaction] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { auth } = useAppContext();
  const [ableToReaction, setAbleToReaction] = useState(() => {
    const userSession = sessionStorage.getItem(
      auth?.auth.currentUser?.uid as string
    );
    const userSessionObj = userSession ? JSON.parse(userSession) : null;

    return !userSessionObj || userSessionObj?.count <= TOTAL_REACTION_COUNT;
  });

  return (
    <div
      onClick={() => {
        let count = 0;

        clearTimeout(timeoutRef.current);

        if (ableToReaction) {
          setCount((newVal) => {
            count = newVal + 1;

            return count;
          });
        }

        timeoutRef.current = setTimeout(() => {
          const userSession = sessionStorage.getItem(
            auth?.auth.currentUser?.uid as string
          );

          const userSessionObj = userSession ? JSON.parse(userSession) : {};

          if (
            count > TOTAL_REACTION_COUNT ||
            userSessionObj.count > TOTAL_REACTION_COUNT
          ) {
            setAbleToReaction(false);
          } else {
            sessionStorage.setItem(
              auth?.auth.currentUser?.uid as string,
              JSON.stringify({
                ...userSessionObj,
                count: userSessionObj.count ? userSessionObj.count + count : 1,
              })
            );

            setAbleToReaction(true);
            onClick(count);
          }

          setShowReaction(true);

          setTimeout(() => {
            count = 0;
            setCount(count);
            setShowReaction(false);
          }, 500);
        }, 500);
      }}
      className="reactions__items fade-in"
      style={{ "--fade-delay": `${index * 40}ms` } as React.CSSProperties}
    >
      <span className="reactions__items-total">{value}</span>
      <span className="reactions__items-icon">{icon}</span>

      {showReaction &&
        (ableToReaction ? (
          <span className="reactions__animation">+{count}</span>
        ) : (
          <span className="reactions__animation">max limit reached</span>
        ))}
    </div>
  );
}
