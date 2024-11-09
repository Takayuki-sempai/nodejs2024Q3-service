import { IsDefined, IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @IsDefined()
  name: string;
  @IsInt()
  year: number;
  @IsOptional()
  @IsUUID()
  artistId: string | null;
}
