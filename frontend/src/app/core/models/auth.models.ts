export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface JwtResponse {
    token: string;
    type: string;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}

export interface MessageResponse {
    message: string;
}
