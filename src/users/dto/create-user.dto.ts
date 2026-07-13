
import { IsEmail,  IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  firstName!: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsOptional()
  @Length(10, 20)
  mobile?: string;

  @IsUUID()
  roleId!: string;
}
