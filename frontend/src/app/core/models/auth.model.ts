export interface User {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    avatarUrl?: string;
    bio?: string;
    headline?: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    tokenType: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: 'STUDENT' | 'INSTRUCTOR';
}
