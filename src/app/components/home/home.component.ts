import { Component, OnInit } from '@angular/core';
import { Book, UserBook } from '../../interfaces/book';
import { BookService } from '../../services/book.service';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  books!: Book[];
  userId!: string;
  user!: UserResponse;
  isLoggedIn!: boolean;
  userRole: string = '';
  currentlyReading!: Book[];

  constructor(
    private authSrv: AuthService,
    private bookService: BookService,
    private http: HttpClient
  ) {
    this.authSrv.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.fetchUserId();
    this.authSrv.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
      if (this.isLoggedIn) {
        this.fetchUserId();
      }
    });
  }

  loadBooks() {
    //GET with Pagination
    // this.bookService.getAllBooks(0, 10, 'id').subscribe(
    //   (data) => {
    //     this.books = data.content;
    //   },
    //   (error) => {
    //     console.error('Error fetching books:', error);
    //   }
    // );

    //Simple GET
    this.bookService.getBooks().subscribe(
      (books) => {
        this.books = books;
      },
      (error) => {
        console.error('Error fetching books:', error);
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
        this.getCurrentlyReadingBooks();
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
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
  }

  getCurrentlyReadingBooks() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http
      .get<UserBook[]>(
        `http://localhost:3001/users/${this.userId}/currentlyReading`,
        { headers }
      )
      .pipe(map((response) => response.map((userBook) => userBook.book)))
      .subscribe((books) => {
        this.currentlyReading = books;
      });
  }

  search(event: any) {
    if (!event.target.value) {
      this.loadBooks();
    }
    const searchTerm = event.target.value.toLowerCase();
    this.books = this.books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm)
    );
  }
}
