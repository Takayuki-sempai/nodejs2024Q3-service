import { IsDefined, IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateTrackDto {
  @IsDefined()
  name: string;
  @IsOptional()
  @IsUUID()
  artistId: string | null;
  @IsOptional()
  @IsUUID()
  albumId: string | null;
  @IsInt()
  duration: number;
}
