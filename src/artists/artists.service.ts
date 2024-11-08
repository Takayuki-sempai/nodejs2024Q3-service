import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuid4 } from 'uuid';
import { InMemoryArtistsStorage } from './storage/in-memory.artists.storage';
import { plainToInstance } from 'class-transformer';
import { Artist } from './entities/artist.entity';
import { ArtistDto } from './dto/artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly storage: InMemoryArtistsStorage) {}

  create(createArtistDto: CreateArtistDto): ArtistDto {
    const entity = plainToInstance(Artist, {
      ...createArtistDto,
      id: uuid4(),
    });
    const savedEntity = this.storage.save(entity);
    return this.entityToDto(savedEntity);
  }

  findAll(): ArtistDto[] {
    return this.storage.findAll().map(this.entityToDto);
  }

  findOne(id: string): ArtistDto {
    const entity = this.storage.findById(id);
    if (!entity) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return this.entityToDto(entity);
  }

  update(id: string, updateArtistDto: UpdateArtistDto): ArtistDto {
    const entity = this.storage.findById(id);
    if (!entity) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    const updatedEntity = this.storage.save(
      plainToInstance(Artist, { ...entity, ...updateArtistDto }),
    );
    return this.entityToDto(updatedEntity);
  }

  remove(id: string) {
    const isDeleted = this.storage.remove(id);
    if (!isDeleted) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }

  private entityToDto(entity: Artist): ArtistDto {
    return plainToInstance(ArtistDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}
