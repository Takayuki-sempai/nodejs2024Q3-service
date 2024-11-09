import { Injectable } from '@nestjs/common';
import { InMemoryTracksStorage } from '../../tracks/storage/in-memory.tracks.storage';
import { Album } from '../entities/album.entity';

@Injectable()
export class InMemoryAlbumsStorage {
  constructor(private readonly tracksStorage: InMemoryTracksStorage) {}

  private entities: Map<string, Album> = new Map();

  findAll(): Album[] {
    return [...this.entities.values()];
  }

  findById(id: string): Album | undefined {
    return this.entities.get(id);
  }

  save(entity: Album): Album {
    this.entities.set(entity.id, entity);
    return entity;
  }

  remove(id: string): boolean {
    const tracks = this.tracksStorage
      .findAll()
      .filter((track) => track.albumId == id);
    tracks.forEach((track) => {
      track.albumId = null;
      this.tracksStorage.save(track);
    });
    return this.entities.delete(id);
  }
}
