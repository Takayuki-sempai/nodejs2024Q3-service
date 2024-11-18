import { Expose } from 'class-transformer';

export class TrackDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() artistId: string | null = null;
  @Expose() albumId: string | null = null;
  @Expose() duration: number;
}
