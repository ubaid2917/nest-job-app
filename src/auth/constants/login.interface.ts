import { User } from '../../user/entities/user.entity';

export interface LoginResponse {
  user: Omit<User, 'password'>;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
