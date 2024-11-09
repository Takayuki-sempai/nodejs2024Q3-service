import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { InMemoryTracksStorage } from './storage/in-memory.tracks.storage';
import { plainToInstance } from 'class-transformer';
import { v4 as uuid4 } from 'uuid';
import { TrackDto } from './dto/track.dto';
import { Track } from './entities/track.entity';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly storage: InMemoryTracksStorage) {}

  create(createTrackDto: CreateTrackDto): TrackDto {
    const entity = plainToInstance(Track, {
      ...createTrackDto,
      id: uuid4(),
    });
    const savedEntity = this.storage.save(entity);
    return this.entityToDto(savedEntity);
  }

  findAll(): TrackDto[] {
    return this.storage.findAll().map(this.entityToDto);
  }

  findOne(id: string): TrackDto {
    const entity = this.storage.findById(id);
    if (!entity) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return this.entityToDto(entity);
  }

  update(id: string, updateTrackDto: UpdateTrackDto): TrackDto {
    const entity = this.storage.findById(id);
    if (!entity) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    const updatedEntity = this.storage.save(
      plainToInstance(Track, { id, ...updateTrackDto }),
    );
    return this.entityToDto(updatedEntity);
  }

  remove(id: string) {
    const isDeleted = this.storage.remove(id);
    if (!isDeleted) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }

  private entityToDto(entity: Track): TrackDto {
    return plainToInstance(TrackDto, entity, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });
  }
}
