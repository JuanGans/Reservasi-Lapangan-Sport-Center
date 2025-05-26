// COBA-COBA (REACT CONTEXT)

import { createContext, useContext } from "react";

interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  no_hp: string;
  user_img: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType>({ user: null, setUser: () => {} });
export const useUser = () => useContext(UserContext);
