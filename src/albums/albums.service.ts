import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { plainToInstance } from 'class-transformer';
import { Album } from './entities/album.entity';
import { AlbumDto } from './dto/album.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private readonly storage: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumDto> {
    await this.validateArtist(createAlbumDto.artistId);
    const savedEntity = await this.storage.album.create({
      data: createAlbumDto,
    });
    return this.entityToDto(savedEntity);
  }

  async findAll(): Promise<AlbumDto[]> {
    const entities = await this.storage.album.findMany();
    return entities.map(this.entityToDto);
  }

  async findOne(id: string): Promise<AlbumDto> {
    const entity = await this.storage.album.findUnique({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return this.entityToDto(entity);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<AlbumDto> {
    await this.validateArtist(updateAlbumDto.artistId);
    try {
      const updatedEntity = await this.storage.album.update({
        where: { id },
        data: updateAlbumDto,
      });
      return this.entityToDto(updatedEntity);
    } catch {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }

  async remove(id: string) {
    const deleted = await this.storage.album.deleteMany({ where: { id } });
    if (deleted.count != 1) {
      throw new NotFoundException(`Album with id ${id} not found`);
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

  private entityToDto(entity: Album): AlbumDto {
    return plainToInstance(AlbumDto, entity, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });
  }
}
