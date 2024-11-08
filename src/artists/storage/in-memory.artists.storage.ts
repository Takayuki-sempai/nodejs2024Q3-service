import { Injectable } from '@nestjs/common';
import { Artist } from '../entities/artist.entity';

@Injectable()
export class InMemoryArtistsStorage {
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
    return this.entities.delete(id);
  }
}
