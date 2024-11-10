import { Injectable } from '@nestjs/common';
import { Track } from '../entities/track.entity';
import { InMemoryFavoritesStorage } from '../../favorites/storage/in-memory.favorites.storage';

@Injectable()
export class InMemoryTracksStorage {
  constructor(private readonly favoritesStorage: InMemoryFavoritesStorage) {}

  private entities: Map<string, Track> = new Map();

  findAll(): Track[] {
    return [...this.entities.values()];
  }

  findAllByIdIn(ids: string[]): Track[] {
    return [...this.entities.values()].filter((entity) =>
      ids.includes(entity.id),
    );
  }

  findById(id: string): Track | undefined {
    return this.entities.get(id);
  }

  save(entity: Track): Track {
    this.entities.set(entity.id, entity);
    return entity;
  }

  remove(id: string): boolean {
    this.favoritesStorage.removeTrack(id);
    return this.entities.delete(id);
  }
}
