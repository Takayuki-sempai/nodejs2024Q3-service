import { IsDefined } from 'class-validator';

export class UpdatePasswordDto {
  @IsDefined()
  oldPassword: string;
  @IsDefined()
  newPassword: string;
}
