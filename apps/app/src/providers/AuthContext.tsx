import { createContext } from "react";


export type AuthContext = {
  accessToken?: string;
  setAccessToken(token: string): void;
};

export const AuthContext = createContext<AuthContext>({
  accessToken: undefined, setAccessToken(token) {
    this.accessToken = token;
  },
});
