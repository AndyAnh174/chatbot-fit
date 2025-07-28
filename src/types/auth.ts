export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  expires_in?: string;
  error?: string;
}

export interface AdminProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  last_login: string;
  is_active: boolean;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface AuthContextType {
  user: AdminProfile | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}