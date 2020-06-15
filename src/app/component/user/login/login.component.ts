import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http/http.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

/**
 * Angular Component: User Login
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/**
 * @description Angular Component - Login to Shopping cart App with registered users
 */
export class LoginComponent implements OnInit {
  userLoginFlag: string = '';
  isLoginFormSubmitted: boolean = false;
  usersInfo: any = [];
  userBaseURL: string = `${environment.baseURL}/user`;
  userLoginData: any;

  model: any = {
    userName: '',
    pwd: ''
  };

  constructor(private dataService: HttpService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.userLoginFlag = sessionStorage.getItem('isUserLoggedin');
  }

  /**
   * @description Unsubscribe login fuctionality with Http Service
   */
  ngOnDestroy() {
    if (this.userLoginData !== undefined) {
      this.userLoginData.unsubscribe();
    }
  }

  /**
   * @description User login
   * @param {NgForm} loginRef
   */
  submitLoginForm = (loginRef) => {
    this.isLoginFormSubmitted = true;
    if (loginRef.valid) {
      let userName = loginRef.form.controls.userName.value;
      let pwd = loginRef.form.controls.pwd.value;
      this.useAuthServiceToLogin(userName, pwd);
      console.log('Login form: ', this.model);
    }
  }

  /**
   * @description User login with Auth guard service
   * @param {string} userName
   * @param {string} pwd
   */
  useAuthServiceToLogin = (userName: string, pwd: string) => {
    this.authService.loginUser(userName, pwd, this.userBaseURL).subscribe(data => {
      console.log('##########Start: LoginComponent -> useAuthServiceToLogin response data ########');
      if (data) {
        console.log('User login success');
        this.router.navigate(['/profile']);
      } else {
        console.log('User login success');
        this.router.navigate(['']);
      }
      console.log('##########Start: LoginComponent -> useAuthServiceToLogin  response data ########');
    });
  }

  /**
   * @description Navigation to Registration page
   */
  navigateToUserReg = () => {
    this.router.navigate(['/user-reg']);
  }

  /**
   * @description Clearing Reg form
   * * @param {NgForm} loginRef
   */
  clearUserRegForm = (loginRef) => {
    if (loginRef != undefined) {
      loginRef.reset();
      loginRef.clearAsyncValidators();
      this.isLoginFormSubmitted = false;
    }
  }

  
}
