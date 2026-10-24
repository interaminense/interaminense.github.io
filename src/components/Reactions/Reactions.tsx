import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../AppContext";
import { DataBase } from "../../firebase/database";
import { DBPath, TReactions } from "../../types";
import { TOTAL_REACTION_COUNT } from "../../utils/constants";
import { formatNumber } from "../../utils/numbers";

import { emitBurst } from "../burst/Burst";
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
    <div className={`reactions reactions--${size}`} aria-busy={!reactions}>
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
            value={items[key as keyof TReactions] as number}
          />
        ))}
    </div>
  );
}

interface IReactionProps {
  index: number;
  onClick: (count: number) => void;
  value: number;
  icon: string;
}

function Reaction({ index, onClick, value, icon }: IReactionProps) {
  const [count, setCount] = useState(0);
  const [showReaction, setShowReaction] = useState(false);
  const iconRef = useRef<HTMLSpanElement>(null);
  const previous = useRef<number | null>(null);
  // Like claude-console's cost: each time the saved total goes up (from this
  // visitor or anyone else, it's live), the number pops. The first value,
  // when the page loads, doesn't count as an increase.
  const [pop, setPop] = useState(0);

  useEffect(() => {
    const before = previous.current;

    previous.current = value;

    if (
      before === null ||
      value <= before ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    setPop((n) => n + 1);
  }, [value]);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { auth } = useAppContext();
  const [ableToReaction, setAbleToReaction] = useState(() => {
    const userSession = sessionStorage.getItem(
      auth?.auth.currentUser?.uid as string,
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
          // Instant feedback on every click: the emoji bursts out of itself.
          const box = iconRef.current?.getBoundingClientRect();

          if (box) {
            emitBurst(box.left + box.width / 2, box.top + box.height / 2, icon);
          }

          setCount((newVal) => {
            count = newVal + 1;

            return count;
          });
        }

        timeoutRef.current = setTimeout(() => {
          const userSession = sessionStorage.getItem(
            auth?.auth.currentUser?.uid as string,
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
              }),
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
      {/* Re-keyed on every increase so the pop animation replays. */}
      <span key={pop} className="reactions__pop" data-pop={pop > 0}>
        <span className="reactions__items-total">{formatNumber(value)}</span>
        <span ref={iconRef} className="reactions__items-icon">
          {icon}
        </span>
      </span>

      {showReaction && !ableToReaction && (
        <span className="reactions__animation">max limit reached</span>
      )}
    </div>
  );
}
