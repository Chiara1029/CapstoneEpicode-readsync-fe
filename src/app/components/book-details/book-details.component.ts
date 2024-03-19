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
  newReview: any = {};
  userId!: string;

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
    const userId = this.fetchUserId();
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
          this.reviews = reviews.content;
        },
        (error) => {
          console.error('Error fetching reviews:', error);
        }
      );
  }

  submitReview() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const reviewBody = {
      ...this.newReview,
      bookIsbn: this.book.isbnCode,
      userId: this.userId,
    };

    this.http
      .post('http://localhost:3001/reviews', reviewBody, { headers })
      .subscribe(
        (data: any) => {
          this.reviews.push(data);
          this.newReview = {};
        },
        (error) => {
          console.error('Error submitting review:', error);
        }
      );
  }

  fetchUserId() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.get<any>('http://localhost:3001/users/me', { headers }).subscribe(
      (response) => {
        this.userId = response.toString();
      },
      (error) => {
        console.error('Error fetching user id:', error);
      }
    );
  }
}
