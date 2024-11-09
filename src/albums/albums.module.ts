import { forwardRef, Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { InMemoryAlbumsStorage } from './storage/in-memory.albums.storage';
import { ArtistsModule } from '../artists/artists.module';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, InMemoryAlbumsStorage],
  exports: [InMemoryAlbumsStorage],
  imports: [forwardRef(() => ArtistsModule), forwardRef(() => TracksModule)],
})
export class AlbumsModule {}
