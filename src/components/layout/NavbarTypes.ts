
import { ReactNode } from 'react';

export interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  rightContent?: ReactNode;
}
