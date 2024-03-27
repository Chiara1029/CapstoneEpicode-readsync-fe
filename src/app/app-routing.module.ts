import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CreateBookComponent } from './components/create-book/create-book.component';
import { BookslistComponent } from './components/bookslist/bookslist.component';
import { CreateMovieComponent } from './components/create-movie/create-movie.component';
import { CreateTvshowComponent } from './components/create-tvshow/create-tvshow.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: RegisterComponent,
  },
  {
    path: 'userprofile',
    component: UserComponent,
  },
  {
    path: 'books/:isbnCode',
    component: BookDetailsComponent,
  },
  {
    path: 'createbook',
    component: CreateBookComponent,
  },
  {
    path: 'bookslist/:status',
    component: BookslistComponent,
  },
  {
    path: 'createmovie',
    component: CreateMovieComponent,
  },
  {
    path: 'createtvshow',
    component: CreateTvshowComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
