import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

export interface User {
  id: string;
  token: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const defaultUser: User = {
  id: "",
  token: "",
  name: "",
  email: "",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : defaultUser;
  });

  const setUser = (newUser: User) => {
    setUserState(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const clearUser = () => {
    setUserState(defaultUser);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
