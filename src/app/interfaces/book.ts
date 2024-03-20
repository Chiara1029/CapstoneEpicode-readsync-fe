export interface Book {
  id: number;
  title: string;
  author: string;
  isbnCode: string;
  plot: string;
  genre: string;
  cover: string;
}

export interface UserBook {
  id: number;
  user: any;
  book: Book;
  startDate: string;
  endDate: string;
  bookStatus: string;
}
