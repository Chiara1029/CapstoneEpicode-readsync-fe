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

export interface UserBookResponse {
  content: UserBook[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
