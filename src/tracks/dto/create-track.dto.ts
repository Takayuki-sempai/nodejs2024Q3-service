import { IsDefined, IsInt } from 'class-validator';

export class CreateTrackDto {
  @IsDefined()
  name: string;
  artistId: string | null;
  albumId: string | null;
  @IsInt()
  duration: number;
}
