import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from './user';
import { HttpService } from '../http/http.service';
import { HttpClient } from '@angular/common/http';

/**
 * @description Angular Service: Authentication Service
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userLoginData: any;
  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public user: Observable<User>;

  public get userValue(): User {
    return this.userSubject.value;
  }

  constructor(private router: Router, private dataService: HttpService, private http: HttpClient) {
    // this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    // this.user = this.userSubject.asObservable();
  }

  ngOnInit() {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }
  /**
   * @description User login functionality
   * @param {string} userName
   * @param {string} pwd
   * @param {string} userBaseURL
   */
  loginUser = (userName: string, pwd: string, userBaseURL: string) => {

    return this.http.get<any>(`${userBaseURL}?userName=${userName}&pwd=${pwd}`).pipe(map(userArr => {
      if (userArr !== undefined && userArr.length > 0) {
        let user: any = userArr[0];
        localStorage.setItem('user', JSON.stringify(user));
        console.log('User login success');
        sessionStorage.setItem('isUserLoggedin', 'true');
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        this.userSubject.next(user);        
      } else {
        alert('User not available, login failed');
      } 
      return of(this.userSubject);
    }));
  }

  /**
   * @description  Functionality for logging out user
   */
  logoutUser = () => {
    this.userSubject.next(null);
    sessionStorage.setItem('isUserLoggedin', 'false');
    sessionStorage.removeItem('loggedInUser');
    localStorage.removeItem('user');
    sessionStorage.removeItem('bankAccount')
    this.router.navigate(['/login']);
  }
}
