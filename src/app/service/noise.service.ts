import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, retry, throwError } from 'rxjs';

@Injectable()
export class NoiseService {
  apiURL = 'http://localhost:49154';
  constructor(private http: HttpClient) {}

  getSimplex2d(width: number, height: number): Observable<number[][]> {
    return this.http
      .get<number[][]>(this.apiURL + '/Noise/',  { params: {
          width: width, 
          height: height
        }})
      .pipe(retry(1));
  }

  catchError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }
}