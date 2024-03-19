import { Component, OnInit } from '@angular/core';
import { Book } from '../../interfaces/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  books!: Book[];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getAllBooks(0, 10, 'id').subscribe(
      (data) => {
        this.books = data.content;
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }
}
