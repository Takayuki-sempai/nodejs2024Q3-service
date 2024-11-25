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

  removeArtist(artistId: string): boolean {
    const exists = this.artists.some((id) => id !== artistId);
    if (exists) {
      this.artists = this.artists.filter((id) => id !== artistId);
    }
    return exists;
  }

  removeAlbum(albumId: string) {
    const exists = this.albums.some((id) => id !== albumId);
    if (exists) {
      this.albums = this.albums.filter((id) => id !== albumId);
    }
    return exists;
  }

  removeTrack(trackId: string) {
    const exists = this.tracks.some((id) => id !== trackId);
    if (exists) {
      this.tracks = this.tracks.filter((id) => id !== trackId);
    }
    return exists;
  }
}
