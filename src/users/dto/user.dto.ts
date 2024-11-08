import { Expose } from 'class-transformer';

export class UserDto {
  @Expose() id: string;
  @Expose() login: string;
  @Expose() version: number;
  @Expose() createdAt: number;
  @Expose() updatedAt: number;
}
