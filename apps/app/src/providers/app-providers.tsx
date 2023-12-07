import { AuthContext } from "./AuthContext";
import useLocalStorageState from 'use-local-storage-state';
export const AppProviders = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorageState<string>('accessToken', {
    defaultValue: "",
    storageSync: true
  });

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AppProviders;
