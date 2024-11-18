import { Expose } from 'class-transformer';

export class AlbumDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() year: number;
  @Expose() artistId: string | null = null;
}
