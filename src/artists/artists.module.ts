import { forwardRef, Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { InMemoryArtistsStorage } from './storage/in-memory.artists.storage';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, InMemoryArtistsStorage],
  exports: [InMemoryArtistsStorage],
  imports: [forwardRef(() => TracksModule)],
})
export class ArtistsModule {}
