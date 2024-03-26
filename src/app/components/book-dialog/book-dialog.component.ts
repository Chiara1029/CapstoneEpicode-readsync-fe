import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/interfaces/book';

@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.scss'],
})
export class BookDialogComponent implements OnInit {
  book!: Book;
  showDialog: boolean = false;
  updateForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const isbnCode = params.get('isbnCode');
      if (isbnCode) {
        this.getBookDetails(isbnCode);
      } else {
        console.error('ISBN code not found in URL');
      }
    });
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbnCode: ['', Validators.required],
      plot: ['', Validators.required],
      genre: ['', Validators.required],
      cover: ['', Validators.required],
    });
  }

  getBookDetails(isbnCode: string): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<Book>(`http://localhost:3001/books/${isbnCode}`, { headers })
      .subscribe(
        (book) => {
          this.book = book;
          this.updateForm.patchValue({
            title: this.book.title,
            author: this.book.author,
            isbnCode: this.book.isbnCode,
            plot: this.book.plot,
            genre: this.book.genre,
            cover: this.book.cover,
          });
        },
        (error) => {
          console.error('Error fetching book details:', error);
        }
      );
  }

  onUpdateBookSubmit(event: Event): void {
    event.preventDefault();
    this.updateBook();
    this.closeDialog();
  }

  updateBook(): void {
    const updateData = this.updateForm.value;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http
      .put<Book>(
        `http://localhost:3001/books/${this.book.isbnCode}`,
        updateData,
        { headers }
      )
      .subscribe(
        (response) => {
          this.book = response;
          alert('The book has been updated!');
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
