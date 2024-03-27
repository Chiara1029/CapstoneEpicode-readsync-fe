import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CreateBookComponent } from './components/create-book/create-book.component';
import { BookslistComponent } from './components/bookslist/bookslist.component';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { BookDialogComponent } from './components/book-dialog/book-dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { CreateMovieComponent } from './components/create-movie/create-movie.component';
import { CreateTvshowComponent } from './components/create-tvshow/create-tvshow.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserComponent,
    BookDetailsComponent,
    CreateBookComponent,
    BookslistComponent,
    UserDialogComponent,
    BookDialogComponent,
    FooterComponent,
    CreateMovieComponent,
    CreateTvshowComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
