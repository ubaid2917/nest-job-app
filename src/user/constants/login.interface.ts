import { User } from 'src/user/entities/user.entity';

export interface LoginResponse {
  user: Omit<User, 'password'>;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
