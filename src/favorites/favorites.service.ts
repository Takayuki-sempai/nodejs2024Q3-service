import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesDto } from './dto/favorite.dto';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { Favorites } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private readonly storage: PrismaService) {}

  async findAll(): Promise<FavoritesDto> {
    const favorites = await this.storage.favorites.findFirst({
      include: {
        artists: true,
        albums: true,
        tracks: true,
      },
    });
    return this.entityToDto(
      FavoritesDto,
      favorites || {
        artists: [],
        albums: [],
        tracks: [],
      },
    );
  }

  async addArtist(id: string) {
    const favorites = await this.getOrCreate();
    try {
      await this.storage.favorites.update({
        where: { id: favorites.id },
        data: {
          artists: {
            connect: { id: id },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exists`,
      );
    }
  }

  async removeArtist(id: string) {
    const favorites = await this.getOrCreate();
    try {
      await this.storage.favorites.update({
        where: { id: favorites.id },
        data: {
          artists: {
            disconnect: { id: id },
          },
        },
      });
    } catch {
      throw new NotFoundException(
        `Artist with id ${id} not found in favorites`,
      );
    }
  }

  async addAlbum(id: string) {
    const favorites = await this.getOrCreate();
    try {
      await this.storage.favorites.update({
        where: { id: favorites.id },
        data: {
          albums: {
            connect: { id: id },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exists`,
      );
    }
  }

  async removeAlbum(id: string) {
    const favorites = await this.getOrCreate();
    try {
      await this.storage.favorites.update({
        where: { id: favorites.id },
        data: {
          albums: {
            disconnect: { id: id },
          },
        },
      });
    } catch {
      throw new NotFoundException(`Album with id ${id} not found in favorites`);
    }
  }

  async addTrack(id: string) {
    const favorites = await this.getOrCreate();
    try {
      await this.storage.favorites.update({
        where: { id: favorites.id },
        data: {
          tracks: {
            connect: { id: id },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exists`,
      );
    }
  }

  async removeTrack(id: string) {
    const favorites = await this.getOrCreate();
    try {
      await this.storage.favorites.update({
        where: { id: favorites.id },
        data: {
          tracks: {
            disconnect: { id: id },
          },
        },
      });
    } catch {
      throw new NotFoundException(`Track with id ${id} not found in favorites`);
    }
  }

  private async getOrCreate(): Promise<Favorites> {
    let favorites = await this.storage.favorites.findFirst();
    if (!favorites) {
      favorites = await this.storage.favorites.create({ data: {} });
    }
    return favorites;
  }

  private entityToDto<T>(cls: ClassConstructor<T>, entity: T): T {
    return plainToInstance(cls, entity, {
      excludeExtraneousValues: true,
    });
  }
}
