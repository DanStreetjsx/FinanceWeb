export interface ApiResponse<T> {
  message: string;
  status: 'success' | 'error';
  data?: T | null;
  error?: {
    code: string;
    details?: string;
  };
}

// Respuesta específica para el login
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginResponse extends AuthResponse {}

export interface User {
  id: number;
  name: string;
  phone_prefix?: string;
  phone_number: string;
  role?: string;
  whatsapp_link?: string;
}

// Define los nombres de los endpoints
export const AuthEndpoints = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY: '/auth/verify',
  VERIFY_TOKEN: '/auth/verify',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',
  UPDATE_PROFILE: '/auth/profile',
  REQUEST_RESET_PASSWORD: '/auth/request-reset-password',
  RESET_PASSWORD: '/auth/reset-password'
} as const;

// Interfaces de parámetros para cada endpoint (request)
export interface LoginRequest {
  phone_number: string;
  phone_prefix?: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  phone_number: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone_prefix?: string;
  phone_number?: string;
  password?: string;
  password_confirmation?: string;
}

export interface RequestResetPasswordRequest {
  phone_number: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Datos del usuario decodificados del token
export interface UserData extends User {}

// Interfaz del repositorio de autenticación - define lo que la implementación de API debe implementar
export interface IAuthRepository {
  login(request: LoginRequest): Promise<ApiResponse<AuthResponse>>;
  register(request: RegisterRequest): Promise<ApiResponse<void>>;
  verifyToken(token: string): Promise<ApiResponse<User>>;
  refreshToken(): Promise<ApiResponse<{ token: string }>>;
  logout(): Promise<void>;
  updateProfile(request: UpdateProfileRequest): Promise<ApiResponse<User>>;
  requestResetPassword(request: RequestResetPasswordRequest): Promise<ApiResponse<void>>;
  resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<void>>;
}