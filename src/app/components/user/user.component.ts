import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse } from 'src/app/interfaces/user';
import { Book, UserBook } from 'src/app/interfaces/book';
import { map } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  userId!: string;
  user!: UserResponse;
  currentlyReading!: Book[];
  readBooks!: Book[];
  toRead!: Book[];

  constructor(private http: HttpClient) {}

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
        this.getCurrentlyReadingBooks();
        this.getReadBooks();
        this.getToReadBooks();
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
}
