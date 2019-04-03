export interface User {
    username: string;
    password: string;
    passwordConfirmation: string;
    originalPassword?: string;
    userId: number;
    name: string;
    email: string;
    createdAt?: Date;
    createdDate?: string;
    createdTime?: string;
    updatedAt?: Date;
    updatedDate?: string;
    updatedTime?: string;
    deleted: boolean;
  }