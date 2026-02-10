import type { AxiosError, AxiosRequestConfig } from 'axios';

import api from '../api';
import { 
  AuthEndpoints
} from './AuthRepository';

import type { 
  User,
  ApiResponse,
  LoginRequest,
  AuthResponse,
  IAuthRepository,
  RegisterRequest,
  ResetPasswordRequest,
  RequestResetPasswordRequest
} from './AuthRepository';

// Constantes para el almacenamiento
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export class AuthRepositoryApi implements IAuthRepository {
  constructor() {
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Interceptor de response para manejar errores y refresh token
    api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // Si el error es 401 y no es un intento de refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem(TOKEN_KEY);
            if (refreshToken) {
              const response = await this.refreshToken();
              if (response.status === 'success' && response.data?.token) {
                localStorage.setItem(TOKEN_KEY, response.data.token);
                return api(originalRequest);
              }
            }
          } catch {
            this.clearAuthData();
          }
        }
        return Promise.reject(error);
      }
    );
  }
  
  private clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  
  async login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      // El backend devuelve directamente { token, user, ... }
      const response = await api.post<AuthResponse>(
        `${AuthEndpoints.LOGIN}`,
        request
      );
      
      const authData = response.data;
      
      if (authData && authData.token) {
        // Imprimir la respuesta para depuración
        console.log("Respuesta de login exitosa:", authData);
        
        // Guardar token en localStorage
        localStorage.setItem(TOKEN_KEY, authData.token);
        
        // Guardar usuario completo
        if (authData.user) {
          console.log("Guardando usuario en localStorage:", authData.user);
          localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
        }

        return {
          status: 'success',
          message: 'Login exitoso',
          data: authData
        };
      }
      
      return {
        status: 'error',
        message: 'Respuesta inválida del servidor',
        data: null
      };
    } catch (error) {
      console.error("Error en login:", error);
      return this.handleError(error);
    }
  }

  async register(request: RegisterRequest): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<void>(
        `${AuthEndpoints.REGISTER}`,
        request
      );
      
      return {
        status: 'success',
        message: 'Usuario registrado exitosamente',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async verifyToken(token?: string): Promise<ApiResponse<User>> {
    try {
      const tokenToVerify = token || localStorage.getItem(TOKEN_KEY);
      if (!tokenToVerify) {
        return {
          status: 'error',
          message: 'No hay token disponible',
          data: null
        };
      }

      const response = await api.post<User>(
        `${AuthEndpoints.VERIFY_TOKEN}`
      );
      
      
      return {
        status: 'success',
        message: 'Token verificado',
        data: response.data
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'isAxiosError' in error && error.isAxiosError) {
        return {
          status: 'error',
          message: 'Token inválido o expirado',
          data: null
        };
      }
      
      return {
        status: 'error',
        message: 'Error al verificar el token',
        data: null
      };
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    // El backend actual no soporta refresh tokens, usamos el mismo token o fallamos
    return {
      status: 'error',
      message: 'Refresh token no soportado en esta versión',
    };
  }

  async logout(): Promise<void> {
    try {
      await api.post(`${AuthEndpoints.LOGOUT}`);
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      // Siempre limpiar datos locales
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  async updateProfile(request: any): Promise<ApiResponse<User>> {
    try {
      const response = await api.put<ApiResponse<User>>(
        `${AuthEndpoints.UPDATE_PROFILE}`,
        request
      );
      
      const result = response.data;
      
      if (result.status === 'success' && result.data) {
        localStorage.setItem(USER_KEY, JSON.stringify(result.data));
      }

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async requestResetPassword(data: RequestResetPasswordRequest): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>(
        `${AuthEndpoints.REQUEST_RESET_PASSWORD}`,
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>(
        `${AuthEndpoints.RESET_PASSWORD}`,
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): ApiResponse<any> {
    if (error && typeof error === 'object' && 'isAxiosError' in error && error.isAxiosError) {
      const axiosError = error as AxiosError;
      const response = axiosError.response?.data as ApiResponse<any>;
      return {
        message: response?.message || axiosError.message,
        status: 'error',
        error: {
          code: axiosError.response?.status?.toString() || 'UNKNOWN',
          details: response?.error?.details
        }
      };
    }
    
    return {
      message: 'Error desconocido',
      status: 'error',
      error: {
        code: 'UNKNOWN',
        details: error instanceof Error ? error.message : undefined
      }
    };
  }
}

// Crear una instancia singleton para usar en toda la aplicación
export const authRepository: IAuthRepository = new AuthRepositoryApi();