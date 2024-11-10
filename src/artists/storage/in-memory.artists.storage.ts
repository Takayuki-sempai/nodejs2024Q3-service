import { Injectable } from '@nestjs/common';
import { Artist } from '../entities/artist.entity';
import { InMemoryTracksStorage } from '../../tracks/storage/in-memory.tracks.storage';
import { InMemoryAlbumsStorage } from '../../albums/storage/in-memory.albums.storage';

@Injectable()
export class InMemoryArtistsStorage {
  constructor(
    private readonly tracksStorage: InMemoryTracksStorage,
    private readonly albumsStorage: InMemoryAlbumsStorage,
  ) {}

  private entities: Map<string, Artist> = new Map();

  findAll(): Artist[] {
    return [...this.entities.values()];
  }

  findAllByIdIn(ids: string[]): Artist[] {
    return [...this.entities.values()].filter((entity) =>
      ids.includes(entity.id),
    );
  }

  findById(id: string): Artist | undefined {
    return this.entities.get(id);
  }

  save(entity: Artist): Artist {
    this.entities.set(entity.id, entity);
    return entity;
  }

  remove(id: string): boolean {
    this.removeFromTracksCascade(id);
    this.removeFromAlbumsCascade(id);
    return this.entities.delete(id);
  }

  private removeFromTracksCascade(id: string) {
    const tracks = this.tracksStorage
      .findAll()
      .filter((track) => track.artistId == id);
    tracks.forEach((track) => {
      track.artistId = null;
      this.tracksStorage.save(track);
    });
  }

  private removeFromAlbumsCascade(id: string) {
    const albums = this.albumsStorage
      .findAll()
      .filter((album) => album.artistId == id);
    albums.forEach((album) => {
      album.artistId = null;
      this.albumsStorage.save(album);
    });
  }
}
