import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Book, UserBook, UserBookResponse } from '../../interfaces/book';
import { Review, ReviewResponse } from 'src/app/interfaces/review';
import { UserResponse } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MovieResp } from 'src/app/interfaces/movie';
import { TvShowResp } from 'src/app/interfaces/tvshow';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
})
export class BookDetailsComponent implements OnInit {
  book!: Book;
  reviews: Review[];
  newReview: any = {};
  userRole: string = '';
  userId!: string;
  user!: UserResponse;
  isLoggedIn!: boolean;
  userReviewExists: boolean = false;
  userBook: any = {};
  bookStatus: string = '';
  userBooks!: UserBook[];
  showDialog: boolean = false;
  hasReviewed: boolean = false;
  movies!: MovieResp[];
  tvShows!: TvShowResp[];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authSrv: AuthService,
    private router: Router
  ) {
    this.reviews = [];
    this.userBooks = [];
    this.authSrv.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
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
    this.fetchUserBooks();
  }

  fetchUserBooks(page: number = 0, size: number = 10, sort: string = 'id') {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    this.http
      .get<UserBookResponse>(`http://localhost:3001/userBooks`, {
        headers,
        params,
      })
      .subscribe((userBooksPage) => {
        this.userBooks = userBooksPage.content;
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
          this.getMovies();
          this.getTvShows();
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
          if (this.user && this.user.username) {
            this.hasReviewed = this.reviews.some(
              (review) => review.user.username === this.user.username
            );
          }
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
        this.fetchUserDetails();
      },
      (error) => {
        console.error('Error fetching user id:', error);
      }
    );
  }

  fetchUserDetails() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http
      .get<any>(`http://localhost:3001/users/${this.userId}`, { headers })
      .subscribe(
        (response) => {
          this.user = response;
          this.userRole = response.userRole;
          this.hasReviewed = this.reviews.some(
            (review) => review.user.username === this.user.username
          );
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
  }

  delete(book: any) {
    const isbnCode = book.isbnCode;
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const confirmed = confirm('Are you sure?');
    if (confirmed) {
      this.http
        .delete<any>(`http://localhost:3001/books/${isbnCode}`, { headers })
        .subscribe(
          () => {
            alert('The book has been successfully deleted.');
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Error deleting this book:', error);
          }
        );
    }
  }

  createUserBook() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const userBookBody = {
      isbnCode: this.book.isbnCode,
      userId: this.userId,
      bookStatus: this.bookStatus,
    };
    const existingUserBook = this.userBooks.find(
      (book) => book.book.id === this.book.id && book.user.id === this.user.id
    );
    if (existingUserBook && existingUserBook.user.id === this.user.id) {
      this.http
        .put(
          `http://localhost:3001/userBooks/${existingUserBook.id}`,
          userBookBody,
          { headers }
        )
        .subscribe(
          () => {
            alert('The book has been successfully updated in your list.');
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    } else {
      this.http
        .post('http://localhost:3001/userBooks', userBookBody, { headers })
        .subscribe(
          (response) => {
            alert('The book has been added to your list!');
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    }
  }

  onSelectChange() {
    this.createUserBook();
  }

  openDialog(): void {
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  getMovies() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<MovieResp[]>(`http://localhost:3001/movies/${this.book.isbnCode}`, {
        headers,
      })
      .subscribe(
        (movies) => {
          this.movies = movies;
        },
        (error) => {
          console.error('Error fetching movie details:', error);
        }
      );
  }

  getTvShows() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<TvShowResp[]>(
        `http://localhost:3001/tvShows/${this.book.isbnCode}`,
        { headers }
      )
      .subscribe(
        (tvShows) => {
          this.tvShows = tvShows;
        },
        (error) => {
          console.error('Error fetching TV show details:', error);
        }
      );
  }
}
