import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private $error = new BehaviorSubject<string | null>(null);
  error = this.$error.asObservable();

  constructor() {}

  setError(err: string) {
    this.$error.next(err);
  }
}
