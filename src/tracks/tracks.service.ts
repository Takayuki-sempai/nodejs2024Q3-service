import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { InMemoryTracksStorage } from './storage/in-memory.tracks.storage';
import { plainToInstance } from 'class-transformer';
import { v4 as uuid4 } from 'uuid';
import { TrackDto } from './dto/track.dto';
import { Track } from './entities/track.entity';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InMemoryArtistsStorage } from '../artists/storage/in-memory.artists.storage';
import { InMemoryAlbumsStorage } from '../albums/storage/in-memory.albums.storage';

@Injectable()
export class TracksService {
  constructor(
    private readonly storage: InMemoryTracksStorage,
    private readonly albumsStorage: InMemoryAlbumsStorage,
    private readonly artistsStorage: InMemoryArtistsStorage,
  ) {}

  create(createTrackDto: CreateTrackDto): TrackDto {
    this.validateArtist(createTrackDto.artistId);
    this.validateAlbum(createTrackDto.albumId);
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
    this.validateArtist(updateTrackDto.artistId);
    this.validateAlbum(updateTrackDto.albumId);
    const entity = this.storage.findById(id);
    if (!entity) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    const updatedEntity = this.storage.save(
      plainToInstance(Track, { id, ...updateTrackDto }),
    );
    return this.entityToDto(updatedEntity);
  }

  remove(id: string) {
    const isDeleted = this.storage.remove(id);
    if (!isDeleted) {
      throw new NotFoundException(`Track with id ${id} not found`);
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

  private validateAlbum(albumId: string | null) {
    if (albumId != null) {
      const album = this.albumsStorage.findById(albumId);
      if (!album) {
        throw new NotFoundException(`Album ${albumId} not found`);
      }
    }
  }

  private entityToDto(entity: Track): TrackDto {
    return plainToInstance(TrackDto, entity, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });
  }
}
