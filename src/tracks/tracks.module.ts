import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { InMemoryTracksStorage } from './storage/in-memory.tracks.storage';

@Module({
  controllers: [TracksController],
  providers: [TracksService, InMemoryTracksStorage],
})
export class TracksModule {}
