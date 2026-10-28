export interface Login {
    email: string;
    password: string;
}

export interface Register {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type registerRequest = Omit<Register, 'confirmPassword'>;