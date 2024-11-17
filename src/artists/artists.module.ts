import { forwardRef, Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { InMemoryArtistsStorage } from './storage/in-memory.artists.storage';
import { PrismaModule } from '../prisma/prisma.module';
import { TracksModule } from '../tracks/tracks.module';
import { AlbumsModule } from '../albums/albums.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, InMemoryArtistsStorage],
  exports: [InMemoryArtistsStorage],
  imports: [
    PrismaModule,
    forwardRef(() => TracksModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => FavoritesModule),
  ],
})
export class ArtistsModule {}
