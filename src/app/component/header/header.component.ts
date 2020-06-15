import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth/auth.service';

/**
 * @description Headers for Shopping Cart application
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userLoginFlag: string = 'false';
  loggedInUser: any = null;
  isAuthenticated: Observable<boolean>;

  constructor(private router: Router, private authService: AuthService) {
    
    // on route change to '/login', set the variable showHead to false
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] === '/login') {
          this.userLoginFlag = 'false';
          this.loggedInUser = '';
        } else {
          this.userLoginFlag = sessionStorage.getItem('isUserLoggedin');
          if(sessionStorage.getItem('loggedInUser') !== '') {
            this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
          } 
        }
      }
    });
  }
   

  ngOnInit(): void {
     
  }

  /**
   * Life cycle method: ngAfterViewInit -> Accessing the session data for user login flag and logged in user.
   */
  ngAfterViewInit(){
    this.userLoginFlag = sessionStorage.getItem('isUserLoggedin');
    if(sessionStorage.getItem('isUserLoggedin') !== null && sessionStorage.getItem('isUserLoggedin') !== undefined && sessionStorage.getItem('isUserLoggedin') !== '') {
      this.userLoginFlag = sessionStorage.getItem('isUserLoggedin');
    } else {
      this.userLoginFlag = 'false';
      sessionStorage.setItem('isUserLoggedin', this.userLoginFlag);
    }
    if(sessionStorage.getItem('loggedInUser') !== null && sessionStorage.getItem('loggedInUser') !== undefined && sessionStorage.getItem('loggedInUser') !== '') {
      this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    } else {
      this.loggedInUser = '';
      sessionStorage.setItem('loggedInUser', this.loggedInUser);
    }
   }

 /**
 * @description User logout functionality  
 */  
  logoutUser = () => { this.authService.logoutUser(); }
  
}