import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  firstName!: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @Length(10, 20)
  mobile?: string;

  @IsNotEmpty()
  @IsUUID()
  roleId!: string;
}
