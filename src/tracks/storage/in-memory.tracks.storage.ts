import { Injectable } from '@nestjs/common';
import { Track } from '../entities/track.entity';

@Injectable()
export class InMemoryTracksStorage {
  private entities: Map<string, Track> = new Map();

  findAll(): Track[] {
    return [...this.entities.values()];
  }

  findById(id: string): Track | undefined {
    return this.entities.get(id);
  }

  save(entity: Track): Track {
    this.entities.set(entity.id, entity);
    return entity;
  }

  remove(id: string): boolean {
    return this.entities.delete(id);
  }
}
