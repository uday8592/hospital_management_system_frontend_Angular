export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'RECEPTIONIST';
}

export interface AuthResponse {
  token: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'RECEPTIONIST';
}

export interface SessionUser {
  token: string;
  email: string;
  role: string;
}
