import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryFavoritesStorage } from './storage/in-memory.favorites.storage';
import { InMemoryAlbumsStorage } from '../albums/storage/in-memory.albums.storage';
import { InMemoryArtistsStorage } from '../artists/storage/in-memory.artists.storage';
import { InMemoryTracksStorage } from '../tracks/storage/in-memory.tracks.storage';
import { FavoritesDto } from './dto/favorite.dto';
import { ArtistDto } from '../artists/dto/artist.dto';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { AlbumDto } from '../albums/dto/album.dto';
import { TrackDto } from '../tracks/dto/track.dto';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly storage: InMemoryFavoritesStorage,
    private readonly tracksStorage: InMemoryTracksStorage,
    private readonly albumsStorage: InMemoryAlbumsStorage,
    private readonly artistsStorage: InMemoryArtistsStorage,
  ) {}

  findAll(): FavoritesDto {
    const artistsIds = this.storage.getAllArtists();
    const artists = this.artistsStorage.findAllByIdIn(artistsIds);
    const albumsIds = this.storage.getAllAlbums();
    const albums = this.albumsStorage.findAllByIdIn(albumsIds);
    const trackIds = this.storage.getAllTracks();
    const tracks = this.tracksStorage.findAllByIdIn(trackIds);
    return this.entityToDto(FavoritesDto, {
      artists: artists.map((artist) => this.entityToDto(ArtistDto, artist)),
      albums: albums.map((album) => this.entityToDto(AlbumDto, album)),
      tracks: tracks.map((track) => this.entityToDto(TrackDto, track)),
    });
  }

  addArtist(id: string) {
    this.storage.addArtist(id);
  }

  removeArtist(id: string) {
    const isDeleted = this.storage.removeArtist(id);
    if (!isDeleted) {
      throw new NotFoundException(
        `Artist with id ${id} not found in favorites`,
      );
    }
  }

  addAlbum(id: string) {
    this.storage.addAlbum(id);
  }

  removeAlbum(id: string) {
    const isDeleted = this.storage.removeAlbum(id);
    if (!isDeleted) {
      throw new NotFoundException(`Album with id ${id} not found in favorites`);
    }
  }

  addTrack(id: string) {
    this.storage.addTrack(id);
  }

  removeTrack(id: string) {
    const isDeleted = this.storage.removeTrack(id);
    if (!isDeleted) {
      throw new NotFoundException(`Track with id ${id} not found in favorites`);
    }
  }

  private entityToDto<T>(cls: ClassConstructor<T>, entity: T): T {
    return plainToInstance(cls, entity, {
      excludeExtraneousValues: true,
    });
  }
}
