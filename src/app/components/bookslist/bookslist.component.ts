import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Book, UserBook } from 'src/app/interfaces/book';
import { UserResponse } from 'src/app/interfaces/user';

@Component({
  selector: 'app-bookslist',
  templateUrl: './bookslist.component.html',
  styleUrls: ['./bookslist.component.scss'],
})
export class BookslistComponent implements OnInit {
  userId!: string;
  user!: UserResponse;
  currentlyReading!: Book[];
  readBooks!: Book[];
  toRead!: Book[];
  userBook!: UserBook[];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserId();
  }

  fetchUserId() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.get<any>('http://localhost:3001/users/me', { headers }).subscribe(
      (response) => {
        this.userId = response.toString();
        this.fetchUserDetails();
        this.getUserBooks();
        this.route.params.subscribe((params) => {
          const section = params['status'];
          if (section === 'currentlyReading') {
            this.getCurrentlyReadingBooks();
          } else if (section === 'read') {
            this.getReadBooks();
          } else if (section === 'toRead') {
            this.getToReadBooks();
          }
        });
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

  getReadBooks() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http
      .get<UserBook[]>(`http://localhost:3001/users/${this.userId}/read`, {
        headers,
      })
      .pipe(map((response) => response.map((userBook) => userBook.book)))
      .subscribe((books) => {
        this.readBooks = books;
      });
  }

  getToReadBooks() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http
      .get<UserBook[]>(`http://localhost:3001/users/${this.userId}/toRead`, {
        headers,
      })
      .pipe(map((response) => response.map((userBook) => userBook.book)))
      .subscribe((books) => {
        this.toRead = books;
      });
  }

  search(event: any) {
    if (!event.target.value) {
      this.fetchUserId();
    } else {
      const searchTerm = event.target.value.toLowerCase();
      if (this.currentlyReading && this.currentlyReading.length > 0) {
        this.currentlyReading = this.currentlyReading.filter((book) =>
          book.title.toLowerCase().includes(searchTerm)
        );
      }
      if (this.toRead && this.toRead.length > 0) {
        this.toRead = this.toRead.filter((book) =>
          book.title.toLowerCase().includes(searchTerm)
        );
      }
      if (this.readBooks && this.readBooks.length > 0) {
        this.readBooks = this.readBooks.filter((book) =>
          book.title.toLowerCase().includes(searchTerm)
        );
      }
    }
  }

  getUserBooks() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http
      .get<UserBook[]>(`http://localhost:3001/userBooks/getAll`, {
        headers,
      })
      .pipe(map((response) => response.map((userBook) => userBook)))
      .subscribe((books) => {
        this.userBook = books;
      });
  }

  delete(bookId: number) {
    const userBookToDelete = this.userBook.find(
      (userBook) => userBook.book.id === bookId
    );
    if (!userBookToDelete) {
      console.error('UserBook not found for the given Book ID.');
      return;
    }
    const userBookId = userBookToDelete.id;
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const confirmed = confirm('Are you sure?');
    if (confirmed && this.userId === userBookToDelete.user.id) {
      this.http
        .delete<any>(`http://localhost:3001/userBooks/${userBookId}`, {
          headers,
        })
        .subscribe(
          () => {
            alert('The book has been successfully deleted.');
            this.router.navigate(['/userprofile']);
          },
          (error) => {
            console.error('Error deleting this book:', error);
          }
        );
    }
  }
}
