import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { InMemoryArtistsStorage } from './storage/in-memory.artists.storage';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, InMemoryArtistsStorage],
})
export class ArtistsModule {}
