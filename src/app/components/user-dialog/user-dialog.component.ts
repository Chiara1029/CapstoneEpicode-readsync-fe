import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserResponse, UserUpdate } from 'src/app/interfaces/user';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent implements OnInit {
  user!: UserResponse;
  userId!: string;
  showDialog: boolean = false;
  updateForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserId();
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      username: ['', Validators.required],
    });
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
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
  }

  onUpdateUserSubmit(event: Event): void {
    this.updateUser();
    this.closeDialog();
  }

  updateUser(): void {
    const updateData = this.updateForm.value;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http
      .put<UserResponse>(
        `http://localhost:3001/users/${this.userId}`,
        updateData,
        { headers }
      )
      .subscribe(
        (response) => {
          this.user = response;
          this.router.navigate(['/userprofile']);
          alert('Your profile has been updated!');
        },
        (error) => {
          console.error('Errore:', error);
        }
      );
  }

  openDialog(): void {
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
  }
}
