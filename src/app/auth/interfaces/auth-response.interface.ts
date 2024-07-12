import { User } from "./user.interface";

export interface AuthResponse {
    token:    string;
    success:  boolean;
    message:  string;
    userInfo: User;
}