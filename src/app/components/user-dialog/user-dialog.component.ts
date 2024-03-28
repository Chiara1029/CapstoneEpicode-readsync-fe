import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserResponse, UserUpdate } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent implements OnInit {
  user!: UserResponse | null;
  userId!: string;
  showDialog: boolean = false;
  updateForm!: FormGroup;
  userSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private userSrv: UserService
  ) {}

  ngOnInit(): void {
    this.fetchUserId();
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      username: ['', Validators.required],
    });
    this.userSubscription = this.userSrv.user$.subscribe((user) => {
      this.user = user;
      this.updateForm.patchValue({
        name: this.user!.name,
        lastName: this.user!.lastName,
        email: this.user!.email,
        username: this.user!.username,
      });
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
      },
      (error) => {
        console.error('Error fetching user id:', error);
      }
    );
  }

  onUpdateUserSubmit(event: Event): void {
    event.preventDefault();
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
          this.userSrv.fetchUserDetails(this.userId);
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
