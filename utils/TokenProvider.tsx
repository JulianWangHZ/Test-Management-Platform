'use client';
import { createContext } from 'react';
import { TokenContextType } from '@/types/user';

const defaultContext: TokenContextType = {
  token: { access_token: '', expires_at: 0, user: null },
  isSignedIn: () => true,
  isAdmin: () => true,
  isProjectOwner: () => true,
  isProjectManager: () => true,
  isProjectDeveloper: () => true,
  isProjectReporter: () => true,
  refreshProjectRoles: () => {},
  setToken: () => {},
  storeTokenToLocalStorage: () => {},
  removeTokenFromLocalStorage: () => {},
};

const TokenContext = createContext<TokenContextType>(defaultContext);

const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  return <TokenContext.Provider value={defaultContext}>{children}</TokenContext.Provider>;
};

export { TokenContext };
export default TokenProvider;
