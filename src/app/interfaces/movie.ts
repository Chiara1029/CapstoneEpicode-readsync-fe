import { Book } from './book';

export interface Movie {
  id: number;
  title: string;
  year: number;
  plot: string;
  poster: string;
  genre: string;
  bookIsbn: string;
  director: string;
  distributor: string;
}

export interface MovieResp {
  title: string;
  year: number;
  plot: string;
  poster: string;
  genre: string;
  book: Book;
  director: string;
  distributor: string;
}
