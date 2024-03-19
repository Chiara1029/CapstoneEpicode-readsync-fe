import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Book } from '../../interfaces/book';
import { Review, ReviewResponse } from 'src/app/interfaces/review';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
})
export class BookDetailsComponent implements OnInit {
  book!: Book;
  reviews: Review[];

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.reviews = [];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const isbnCode = params.get('isbnCode');
      if (isbnCode) {
        this.getBookDetails(isbnCode);
        this.getReviews(isbnCode);
      } else {
        console.error('ISBN code not found in URL');
      }
    });
  }

  getBookDetails(isbnCode: string): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<Book>(`http://localhost:3001/books/${isbnCode}`, { headers })
      .subscribe(
        (book) => {
          this.book = book;
        },
        (error) => {
          console.error('Error fetching book details:', error);
        }
      );
  }

  getReviews(
    isbnCode: string,
    page: number = 0,
    size: number = 10,
    sort: string = 'id'
  ): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    this.http
      .get<ReviewResponse>(`http://localhost:3001/reviews/${isbnCode}`, {
        headers,
        params,
      })
      .subscribe(
        (reviews) => {
          console.log(this.reviews);
          console.log(reviews);
          this.reviews = reviews.content;
        },
        (error) => {
          console.error('Error fetching reviews:', error);
        }
      );
  }
}
