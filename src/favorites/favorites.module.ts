import { forwardRef, Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { InMemoryFavoritesStorage } from './storage/in-memory.favorites.storage';
import { TracksModule } from '../tracks/tracks.module';
import { AlbumsModule } from '../albums/albums.module';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, InMemoryFavoritesStorage],
  exports: [InMemoryFavoritesStorage],
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => ArtistsModule),
  ],
})
export class FavoritesModule {}
