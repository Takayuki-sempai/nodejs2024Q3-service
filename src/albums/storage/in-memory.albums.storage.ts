import { Injectable } from '@nestjs/common';
import { InMemoryTracksStorage } from '../../tracks/storage/in-memory.tracks.storage';
import { Album } from '../entities/album.entity';
import { InMemoryFavoritesStorage } from '../../favorites/storage/in-memory.favorites.storage';

@Injectable()
export class InMemoryAlbumsStorage {
  constructor(
    private readonly tracksStorage: InMemoryTracksStorage,
    private readonly favoritesStorage: InMemoryFavoritesStorage,
  ) {}

  private entities: Map<string, Album> = new Map();

  findAll(): Album[] {
    return [...this.entities.values()];
  }

  findAllByIdIn(ids: string[]): Album[] {
    return [...this.entities.values()].filter((entity) =>
      ids.includes(entity.id),
    );
  }

  findById(id: string): Album | undefined {
    return this.entities.get(id);
  }

  save(entity: Album): Album {
    this.entities.set(entity.id, entity);
    return entity;
  }

  remove(id: string): boolean {
    this.removeFromTracksCascade(id);
    this.favoritesStorage.removeAlbum(id);
    return this.entities.delete(id);
  }

  private removeFromTracksCascade(id: string) {
    const tracks = this.tracksStorage
      .findAll()
      .filter((track) => track.albumId == id);
    tracks.forEach((track) => {
      track.albumId = null;
      this.tracksStorage.save(track);
    });
  }
}
