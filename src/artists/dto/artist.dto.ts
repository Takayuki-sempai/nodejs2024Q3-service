import { Expose } from 'class-transformer';

export class ArtistDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() grammy: boolean;
}
