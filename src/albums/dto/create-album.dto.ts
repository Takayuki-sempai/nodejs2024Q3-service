import { IsDefined, IsInt } from 'class-validator';

export class CreateAlbumDto {
  @IsDefined()
  name: string;
  @IsInt()
  year: number;
  artistId: string | null;
}
