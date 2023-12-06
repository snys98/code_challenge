import { createContext, useState } from "react";

export const AuthContext = createContext<{ accessToken?: string, setAccessToken(token:string):void }>({ accessToken: undefined, setAccessToken(token) {
  this.accessToken = token;
}, });
export const AppProviders = ({ children }) => {
  const [accessToken, setAccessToken] = useState("Initial value");

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AppProviders;
