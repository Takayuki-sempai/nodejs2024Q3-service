import { Injectable } from '@nestjs/common';
import { Artist } from '../entities/artist.entity';
import { InMemoryTracksStorage } from '../../tracks/storage/in-memory.tracks.storage';

@Injectable()
export class InMemoryArtistsStorage {
  constructor(private readonly tracksStorage: InMemoryTracksStorage) {}

  private entities: Map<string, Artist> = new Map();

  findAll(): Artist[] {
    return [...this.entities.values()];
  }

  findById(id: string): Artist | undefined {
    return this.entities.get(id);
  }

  save(entity: Artist): Artist {
    this.entities.set(entity.id, entity);
    return entity;
  }

  remove(id: string): boolean {
    const tracks = this.tracksStorage
      .findAll()
      .filter((track) => track.artistId == id);
    tracks.forEach((track) => {
      track.artistId = null;
      this.tracksStorage.save(track);
    });
    return this.entities.delete(id);
  }
}
