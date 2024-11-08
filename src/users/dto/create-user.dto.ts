import { IsDefined } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  login: string;
  @IsDefined()
  password: string;
}
