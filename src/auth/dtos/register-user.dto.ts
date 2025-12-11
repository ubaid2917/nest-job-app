import { IsString, IsEmail, IsNotEmpty, IsDefined, IsOptional } from 'class-validator';
import { Role } from '../../user/enums/role.enum';

export class RegisterUserDto {
  @IsDefined({ message: 'Name is required' })
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsDefined({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsDefined({ message: 'Password is required' })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;

  @IsDefined({ message: 'Role is required' })
  @IsString({ message: 'Role must be a string (e.g., user/admin)' })
  @IsNotEmpty({ message: 'Role cannot be empty' })
  role: Role;

  @IsDefined({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Resume URL must be a string' })
  resumeUrl?: string;

  @IsOptional()
  @IsString({ message: 'Profile image URL must be a string' })
  profileImage?: string;

}
