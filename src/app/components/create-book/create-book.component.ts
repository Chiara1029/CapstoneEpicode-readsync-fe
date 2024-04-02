import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ErrorService } from '../../services/errors.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.scss'],
})
export class CreateBookComponent implements OnInit {
  error!: string | null;
  createForm!: FormGroup;
  errorMessage!: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private errorSrv: ErrorService,
    private http: HttpClient
  ) {
    this.errorSrv.error.subscribe((res) => {
      this.error = res;
    });
  }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbnCode: ['', Validators.required],
      plot: ['', Validators.required],
      genre: ['', Validators.required],
      cover: ['', Validators.required],
    });
  }

  createBook() {
    const title = this.createForm.value.title;
    const author = this.createForm.value.author;
    const isbnCode = this.createForm.value.isbnCode;
    const plot = this.createForm.value.plot;
    const genre = this.createForm.value.genre;
    const cover = this.createForm.value.cover;

    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      const book = {
        title: title,
        author: author,
        isbnCode: isbnCode,
        plot: plot,
        genre: genre,
        cover: cover,
      };

      this.http
        .post('http://localhost:3001/books', book, { headers: headers })
        .subscribe(
          (response) => {
            alert('Book created!');
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Error creating book:', error);
            this.errorMessage = error.message;
          }
        );
    } else {
      console.error('Token not found in localStorage');
    }
  }
}
