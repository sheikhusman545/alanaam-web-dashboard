import React from "react";

interface AppContextType {
  user: any;
  setUser: (user: any) => void;
}

// Create context with default value to prevent undefined errors
const defaultContextValue: AppContextType = {
  user: null,
  setUser: () => {},
};

const AppContext = React.createContext<AppContextType>(defaultContextValue);

export default AppContext;

