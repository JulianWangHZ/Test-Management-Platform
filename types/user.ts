import { LocaleCodeType } from './locale';

export type UserType = {
  id: number | null;
  email: string;
  username: string;
  role: number;
  avatarPath: string | null;
  locale: LocaleCodeType | null;
};

export type TokenType = {
  access_token: string;
  expires_at: number;
  user: UserType | null;
};

export type TokenContextType = {
  token: {
    access_token: string;
    expires_at: number;
    user: UserType | null;
  };
  isSignedIn: () => boolean;
  isAdmin: () => boolean;
  isProjectOwner: (projectId: number) => boolean;
  isProjectManager: (projectId: number) => boolean;
  isProjectDeveloper: (projectId: number) => boolean;
  isProjectReporter: (projectId: number) => boolean;
  refreshProjectRoles: () => void;
  setToken: (token: TokenType) => void;
  storeTokenToLocalStorage: (token: TokenType) => void;
  removeTokenFromLocalStorage: () => void;
};

export type MemberType = {
  id: number | null;
  userId: number;
  projectId: number;
  role: number;
  User: UserType;
};
