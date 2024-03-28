import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserResponse } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3001/users';

  private userSubject = new BehaviorSubject<UserResponse | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchUserDetails(userId: string) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http.get<any>(`${this.baseUrl}/${userId}`, { headers }).subscribe(
      (response) => {
        this.updateUser(response);
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  updateUser(user: UserResponse) {
    this.userSubject.next(user);
  }
}
