import React, { createContext, useReducer } from "react";

export enum Type {
  ToggleTheme = "TOGGLE_THEME",
}

export enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",
}

type ThemeAction = { type: Type.ToggleTheme; payload: Theme };

type ThemeState = {
  theme: Theme;
};

type ThemeContextType = {
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
};

const initialState: ThemeState = {
  theme: Theme.Light,
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case Type.ToggleTheme: {
      setTheme(action.payload);

      return {
        ...state,
        theme: action.payload,
      };
    }
    default:
      return state;
  }
};

export const ThemeContext = createContext<ThemeContextType>({
  state: initialState,
  dispatch: () => {},
});

// TODO - Create warning to the user accepts or not cookies policy

function setTheme(theme: Theme) {
  const expirationDate = new Date();

  expirationDate.setDate(expirationDate.getDate() + 30);
  document.cookie = `theme="${theme}"; expires="${expirationDate.toUTCString()}"; path=/`;
}

function getTheme() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    if (cookie.indexOf("theme=") === 0) {
      return cookie
        .substring("theme=".length, cookie.length)
        .replace(/"/g, "") as Theme;
    }
  }

  return Theme.Light;
}

export function ThemeProvider({ children }: React.HTMLAttributes<HTMLElement>) {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  console.log(getTheme());

  return (
    <ThemeContext.Provider
      value={{
        state: { ...state, theme: getTheme() },
        dispatch,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
