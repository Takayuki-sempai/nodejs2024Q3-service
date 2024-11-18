import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { plainToInstance } from 'class-transformer';
import { TrackDto } from './dto/track.dto';
import { Track } from './entities/track.entity';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(private readonly storage: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<TrackDto> {
    await this.validateArtist(createTrackDto.artistId);
    await this.validateAlbum(createTrackDto.albumId);
    const savedEntity = await this.storage.track.create({
      data: createTrackDto,
    });
    return this.entityToDto(savedEntity);
  }

  async findAll(): Promise<TrackDto[]> {
    const entities = await this.storage.track.findMany();
    return entities.map(this.entityToDto);
  }

  async findOne(id: string): Promise<TrackDto> {
    const entity = await this.storage.track.findUnique({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return this.entityToDto(entity);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<TrackDto> {
    await this.validateArtist(updateTrackDto.artistId);
    await this.validateAlbum(updateTrackDto.albumId);
    try {
      const updatedEntity = await this.storage.track.update({
        where: { id },
        data: updateTrackDto,
      });
      return this.entityToDto(updatedEntity);
    } catch {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  async remove(id: string) {
    const deleted = await this.storage.track.deleteMany({ where: { id } });
    if (deleted.count != 1) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  private async validateArtist(artistId: string | null) {
    if (artistId != null) {
      const artist = await this.storage.artist.findUnique({
        where: { id: artistId },
      });
      if (!artist) {
        throw new NotFoundException(`Artist ${artistId} not found`);
      }
    }
  }

  private async validateAlbum(albumId: string | null) {
    if (albumId != null) {
      const album = await this.storage.album.findUnique({
        where: { id: albumId },
      });
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
