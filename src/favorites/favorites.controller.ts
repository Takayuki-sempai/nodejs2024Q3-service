import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeTrack(id);
  }
}
