import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryFavoritesStorage {
  private artists: string[] = [];
  private albums: string[] = [];
  private tracks: string[] = [];

  getAllArtists(): string[] {
    return [...this.artists];
  }

  getAllAlbums(): string[] {
    return [...this.albums];
  }

  getAllTracks(): string[] {
    return [...this.tracks];
  }

  addArtist(artistId: string) {
    if (!this.artists.includes(artistId)) this.artists.push(artistId);
  }

  addAlbum(albumId: string) {
    if (!this.albums.includes(albumId)) this.albums.push(albumId);
  }

  addTrack(trackId: string) {
    if (!this.tracks.includes(trackId)) this.tracks.push(trackId);
  }
}
