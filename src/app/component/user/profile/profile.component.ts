import { Component, OnInit, AfterViewInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http/http.service';
import { map } from 'rxjs/operators';

/**
 * Angular Component: User Profile
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  accBaseURL: string = `${environment.baseURL}/account`;
  loggedInUser: any = null;
  bankAccount: any = null;
  account: any = null;
  accGetData:any;
  userId: number = 0;

  constructor(private router: Router, private dataService: HttpService) {}

  ngOnInit()  {
    if (sessionStorage.getItem('loggedInUser') !== null && sessionStorage.getItem('loggedInUser') !== undefined && sessionStorage.getItem('loggedInUser') !== '') {
      this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
      
      this.userId = this.loggedInUser.id; 
      this.getUserAccountDetails(this.userId);

      if (sessionStorage.getItem('bankAccount') !== null && sessionStorage.getItem('bankAccount') !== undefined && sessionStorage.getItem('bankAccount') !== '') {
        this.bankAccount = JSON.parse(sessionStorage.getItem('bankAccount'));
      }
    }
  }

  ngOnDestroy() {
    if (this.accGetData !== undefined) {
      this.accGetData.unsubscribe();
    }
  }

  /**
   * @description Fetching User account functionality
   * @param {number} userId
   */
  getUserAccountDetails = (userId: number) => {
   this.accGetData = this.dataService.getData(`${this.accBaseURL}?userId=${userId}`).subscribe((response) => {
      console.log('Bank Account -> GetData response: ', response);
      if (response !== undefined && response.length > 0) {
        let account: any = response[0];
        this.account = account;
        sessionStorage.setItem('bankAccount', JSON.stringify(account));
        console.log('User account: ', account);
        return account;
      } else {
        alert('NO Bank Accounts for user...');
      }
    }, (error) => {
      alert(`Account details fecth: error: ${error}`);
    }, () => {

    });
    return;
  }

}
