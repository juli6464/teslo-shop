import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginUserDto {
  
  @IsString()
  @IsEmail()
  email: string;

  //password con 1 mayuscula 1 minuscula y 1 numero
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
  /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string;

}