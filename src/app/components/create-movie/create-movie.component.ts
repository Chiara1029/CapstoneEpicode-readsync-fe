import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/errors.service';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.scss'],
})
export class CreateMovieComponent implements OnInit {
  error!: string | null;
  movieForm!: FormGroup;
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
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      year: ['', Validators.required],
      bookIsbn: ['', Validators.required],
      plot: ['', Validators.required],
      genre: ['', Validators.required],
      poster: ['', Validators.required],
      director: ['', Validators.required],
      distributor: ['', Validators.required],
    });
  }

  createMovie() {
    const title = this.movieForm.value.title;
    const year = this.movieForm.value.year;
    const bookIsbn = this.movieForm.value.bookIsbn;
    const plot = this.movieForm.value.plot;
    const genre = this.movieForm.value.genre;
    const poster = this.movieForm.value.poster;
    const director = this.movieForm.value.director;
    const distributor = this.movieForm.value.distributor;

    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      const movie = {
        title: title,
        year: year,
        bookIsbn: bookIsbn,
        plot: plot,
        genre: genre,
        poster: poster,
        director: director,
        distributor: distributor,
      };

      this.http
        .post('http://localhost:3001/movies', movie, { headers: headers })
        .subscribe(
          (response) => {
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Error creating movie:', error);
            this.errorMessage = error.message;
          }
        );
    } else {
      console.error('Token not found in localStorage');
    }
  }
}
