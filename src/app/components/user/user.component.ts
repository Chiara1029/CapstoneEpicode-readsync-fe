import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse } from 'src/app/interfaces/user';
import { Book, UserBook } from 'src/app/interfaces/book';
import { Subscription, map } from 'rxjs';
import { Review } from 'src/app/interfaces/review';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  userId!: string;
  user!: UserResponse | null;
  currentlyReading!: Book[];
  readBooks!: Book[];
  toRead!: Book[];
  reviews!: Review[];
  numCurrentlyReading: number = 0;
  numReadBooks: number = 0;
  numToRead: number = 0;
  @ViewChild('fileInput') fileInput!: ElementRef;
  showDialog: boolean = false;
  userSubscription!: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userSrv: UserService
  ) {}

  ngOnInit(): void {
    this.fetchUserId();
    this.userSubscription = this.userSrv.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  fetchUserId() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.get<any>('http://localhost:3001/users/me', { headers }).subscribe(
      (response) => {
        this.userId = response.toString();
        this.userSrv.fetchUserDetails(this.userId);
        this.getCurrentlyReadingBooks();
        this.getReadBooks();
        this.getToReadBooks();
        this.getUserReviews();
      },
      (error) => {
        console.error('Error fetching user id:', error);
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
        this.numCurrentlyReading = books.length;
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
        this.numReadBooks = books.length;
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
        this.numToRead = books.length;
      });
  }

  getUserReviews() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http
      .get<Review[]>(`http://localhost:3001/users/${this.userId}/reviews`, {
        headers,
      })
      .subscribe(
        (response) => {
          this.reviews = response;
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  uploadAvatar(file: File) {
    const formData: FormData = new FormData();
    formData.append('avatar', file, file.name);

    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    this.http
      .patch<User>(
        `http://localhost:3001/users/${this.userId}/avatar`,
        formData,
        { headers }
      )
      .subscribe(
        (response) => {
          this.user!.avatar = response.avatar;
        },
        (error) => {
          console.error('Error uploading avatar:', error);
        }
      );
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.uploadAvatar(file);
    }
  }

  delete(user: any) {
    const userId = this.userId;
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const confirmed = confirm('Are you sure?');
    if (confirmed) {
      this.http
        .delete<any>(`http://localhost:3001/users/${userId}`, { headers })
        .subscribe(
          () => {
            alert('The user has been successfully deleted.');
            this.router.navigate(['']);
          },
          (error) => {
            console.error('Error deleting this user:', error);
          }
        );
    }
  }

  openDialog(): void {
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
  }
}
