import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/errors.service';

@Component({
  selector: 'app-create-tvshow',
  templateUrl: './create-tvshow.component.html',
  styleUrls: ['./create-tvshow.component.scss'],
})
export class CreateTvshowComponent implements OnInit {
  error!: string | null;
  tvShowForm!: FormGroup;
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
    this.tvShowForm = this.fb.group({
      title: ['', Validators.required],
      year: ['', Validators.required],
      bookIsbn: ['', Validators.required],
      plot: ['', Validators.required],
      genre: ['', Validators.required],
      poster: ['', Validators.required],
      seasons: ['', Validators.required],
      network: ['', Validators.required],
    });
  }

  createTvShow() {
    const title = this.tvShowForm.value.title;
    const year = this.tvShowForm.value.year;
    const bookIsbn = this.tvShowForm.value.bookIsbn;
    const plot = this.tvShowForm.value.plot;
    const genre = this.tvShowForm.value.genre;
    const poster = this.tvShowForm.value.poster;
    const seasons = this.tvShowForm.value.seasons;
    const network = this.tvShowForm.value.network;

    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      const tvShow = {
        title: title,
        year: year,
        bookIsbn: bookIsbn,
        plot: plot,
        genre: genre,
        poster: poster,
        seasons: seasons,
        network: network,
      };

      this.http
        .post('http://localhost:3001/tvShows', tvShow, { headers: headers })
        .subscribe(
          (response) => {
            alert('Tv Show created!');
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Error creating tv show:', error);
            this.errorMessage = error.message;
          }
        );
    } else {
      console.error('Token not found in localStorage');
    }
  }
}
