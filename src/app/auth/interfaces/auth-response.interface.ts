import { User } from "./user.interface";

export interface AuthResponse {
    accessToken:  string;
    expires?:     Date;
    refreshToken: string
    success:      boolean;
    message:      string;
    userInfo:     User;
}