import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http/http.service';

/**
 * Angular component: Transaction History
 */
@Component({
  selector: 'app-txnhistory',
  templateUrl: './txnhistory.component.html',
  styleUrls: ['./txnhistory.component.css']
})
export class TxnhistoryComponent implements OnInit {

  txnBaseURL: string = `${environment.baseURL}/transaction`;
  loggedInUser: any = null;
  bankAccount: any = null;
  acctId: number = 0;
  txnGetData: any;
  acctTxnInfo: Array<any> = [];

  constructor(private router: Router, private dataService: HttpService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('loggedInUser') != null && sessionStorage.getItem('loggedInUser') != undefined && sessionStorage.getItem('loggedInUser') != '') {
      this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

      if (sessionStorage.getItem('bankAccount') != null && sessionStorage.getItem('bankAccount') != undefined && sessionStorage.getItem('bankAccount') != '') {
        this.bankAccount = JSON.parse(sessionStorage.getItem('bankAccount'));

        this.acctId = this.bankAccount.id;
        this.getUserTransactionDetails(this.acctId);
      }

    }
  }

 

  /**
   * @description Getting transaction details
   * @param {string} acctId
   */
  getUserTransactionDetails = (acctId) => {
    this.txnGetData = this.dataService.getData(`${this.txnBaseURL}/?acctId=${acctId}`).subscribe((response) => {
      console.log('Bank Transaction -> GetData response: ', response);
      if (response !== undefined && response.length > 0) {
        this.acctTxnInfo = response;
      } else {
        alert('No transactions available to this user');
      }
    }, (error) => {
      alert(`Account transaction details fecth: error: ${error}`);
    }, () => {

    });
  }

  /**
   * @description Track by function
   */
  trackTransactionId = (index: number, txn: any) => {
    return txn.id;
  }

  ngOnDestroy() {
    if (this.txnGetData !== undefined) {
      this.txnGetData.unsubscribe();
    }
  }

}
