import { Book } from './book';

export interface TvShow {
  id: number;
  title: string;
  year: number;
  plot: string;
  poster: string;
  genre: string;
  bookIsbn: string;
  seasons: number;
  network: string;
}

export interface TvShowResp {
  id: number;
  title: string;
  year: number;
  plot: string;
  poster: string;
  genre: string;
  book: Book;
  seasons: number;
  network: string;
}
