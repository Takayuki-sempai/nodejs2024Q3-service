import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InMemoryAlbumsStorage } from './storage/in-memory.albums.storage';
import { plainToInstance } from 'class-transformer';
import { v4 as uuid4 } from 'uuid';
import { InMemoryArtistsStorage } from '../artists/storage/in-memory.artists.storage';
import { Album } from './entities/album.entity';
import { AlbumDto } from './dto/album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly storage: InMemoryAlbumsStorage,
    private readonly artistsStorage: InMemoryArtistsStorage,
  ) {}

  create(createAlbumDto: CreateAlbumDto): AlbumDto {
    this.validateArtist(createAlbumDto.artistId);
    const entity = plainToInstance(Album, {
      ...createAlbumDto,
      id: uuid4(),
    });
    const savedEntity = this.storage.save(entity);
    return this.entityToDto(savedEntity);
  }

  findAll(): AlbumDto[] {
    return this.storage.findAll().map(this.entityToDto);
  }

  findOne(id: string): AlbumDto {
    const entity = this.storage.findById(id);
    if (!entity) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return this.entityToDto(entity);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): AlbumDto {
    this.validateArtist(updateAlbumDto.artistId);
    const entity = this.storage.findById(id);
    if (!entity) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    const updatedEntity = this.storage.save(
      plainToInstance(Album, { id, ...updateAlbumDto }),
    );
    return this.entityToDto(updatedEntity);
  }

  remove(id: string) {
    const isDeleted = this.storage.remove(id);
    if (!isDeleted) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }

  private validateArtist(artistId: string | null) {
    if (artistId != null) {
      const artist = this.artistsStorage.findById(artistId);
      if (!artist) {
        throw new NotFoundException(`Artist ${artistId} not found`);
      }
    }
  }

  private entityToDto(entity: Album): AlbumDto {
    return plainToInstance(AlbumDto, entity, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });
  }
}
