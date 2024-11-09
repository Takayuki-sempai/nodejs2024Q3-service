import { forwardRef, Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { InMemoryTracksStorage } from './storage/in-memory.tracks.storage';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService, InMemoryTracksStorage],
  exports: [InMemoryTracksStorage],
  imports: [forwardRef(() => ArtistsModule)],
})
export class TracksModule {}
