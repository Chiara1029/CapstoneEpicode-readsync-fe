import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book';

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = 'http://localhost:3001/books';

  constructor(private http: HttpClient) {}

  getAllBooks(
    page: number,
    size: number,
    sort: string
  ): Observable<Page<Book>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}&sort=${sort}`;
    const authToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${authToken}`
    );
    return this.http.get<Page<Book>>(url, { headers });
  }
}
