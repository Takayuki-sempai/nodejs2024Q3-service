import { ArtistDto } from '../../artists/dto/artist.dto';
import { AlbumDto } from '../../albums/dto/album.dto';
import { TrackDto } from '../../tracks/dto/track.dto';
import { Expose } from 'class-transformer';

export class FavoritesDto {
  @Expose() artists: ArtistDto[];
  @Expose() albums: AlbumDto[];
  @Expose() tracks: TrackDto[];
}
