import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/service/http/http.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';

/**
 * @description custom
 */
function minumumAmountCheck (control: AbstractControl): {[key: string]: boolean} | null {  
  let amount = isInteger(control.value) ? parseInt(control.value) : parseFloat(control.value);  
  if(amount < 0) {
    return {'minumumCheck': true};
  }
  return null;
}

/**
 * Function to check the input is number or string 
 */
function isInteger(num) {
  if(num !== undefined && num !== '') {
    return num.toString().indexOf('.') === -1;
  }
  return false;
}

/**
 * Angular Component: Fund Transfer
 */
@Component({
  selector: 'app-ftransfer',
  templateUrl: './ftransfer.component.html',
  styleUrls: ['./ftransfer.component.css']
})
export class FtransferComponent implements OnInit {
  userBaseURL: string = `${environment.baseURL}/user`;
  txnBaseURL: string = `${environment.baseURL}/transaction`;
  accBaseURL: string = `${environment.baseURL}/account`;
  benefBaseURL: string = `${environment.baseURL}/beneficiary`;

  beneficiaryInfo: Array<any> = [];
  beneficiaryAccInfo: Array<any> = [];
  transferFunds: FormGroup;
  isUserFormSubmitted: boolean = false;
  getBenefAccData: any;
  postTxnData: any;
  updateAccTxnData: any;
  selectedProperty: any;
  loggedInUser: any = null;
  bankAccount: any = null;
  benefAcctIdArr: Array<string> = [];

  constructor(private dataService: HttpService, private router: Router) { }

  /***
    * @description Action on component initialization
    */
   ngOnInit(): void {
    this.transferFunds = new FormGroup({
      beneficiaryAcc: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+([.][0-9]+)?$/), minumumAmountCheck])
    });

    if (sessionStorage.getItem('loggedInUser') != null && sessionStorage.getItem('loggedInUser') != undefined && sessionStorage.getItem('loggedInUser') != '') {
      this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

      if (sessionStorage.getItem('bankAccount') != null && sessionStorage.getItem('bankAccount') != undefined && sessionStorage.getItem('bankAccount') != '') {
        this.bankAccount = JSON.parse(sessionStorage.getItem('bankAccount'));
      }
    }

    this.fetchBeneficiaryInfo();
    console.log(`benefAcctIdArr: `, this.benefAcctIdArr);
    
  }

  


  /**
   * @deprecated fecth registered beneficiaries
   */
  fetchBeneficiaryInfo = () => {
    let userId: string = '';
    let acctId: string = '';

    if(this.loggedInUser !== null && this.loggedInUser !== undefined) {
      userId = this.loggedInUser.id;
    }

    if(this.bankAccount !== null && this.bankAccount !== undefined) {
      acctId = this.bankAccount.id;
    }    

    this.getBenefAccData = this.dataService.getData(`${this.benefBaseURL}?userId=${userId}&acctId=${acctId}`).subscribe((response) => {
      console.log('Login user -> GetData response: ', response);
      if (response !== undefined && response.length > 0) {  
        for(let i = 0; i < response.length; i++) {
          this.benefAcctIdArr.push(response[i].benefAcctId);
          this.fetchBeneficiaryAccountInfo(response[i].benefAcctId);
        }        
      } else {
        alert('Beneficiaries accounts not available to the user');
      }
    }, (error) => {
      alert(`Beneficiaries fetch: fail with error: ${error}`);
    }, () => {

    });
  }
  
  /**
   * @description Fetch beneficiary account details
   * @param {string} benefAcctId
   */
  fetchBeneficiaryAccountInfo = (benefAcctId: string) => {
    this.getBenefAccData = this.dataService.getData(`${this.accBaseURL}?id=${benefAcctId}`).subscribe((response) => {
      console.log('Login user -> GetData response: ', response);
      if (response !== undefined && response.length > 0) {
        this.beneficiaryAccInfo.push(response[0]);
      } else {
        alert('Beneficiaries not available to the user');
      }
    }, (error) => {
      alert(`Beneficiaries fetch: fail with error: ${error}`);
    }, () => {

    });
  }

  trackByAccountId = (index: number, account: any) => {
    return account.id;
  }

  /**
   * @description Transfer funds functionality...
   */
  transferFundsToBenef = () => {
    this.isUserFormSubmitted = true;
    if (this.transferFunds.valid) {
      const amount = parseFloat(this.transferFunds.controls.amount.value);
      const acctId = this.transferFunds.controls.beneficiaryAcc.value;
      const benefAcc = this.beneficiaryAccInfo.filter(item => item.id === parseInt(acctId));
      console.log(JSON.stringify(benefAcc));
      this.doTransfer(benefAcc[0], amount);      
      alert('Transaction has been done successfully...')
    }
  }

  /**
   * @description Busniness logc for fund transfer
   * @param {any} benefAcc
   * @param {number} amount
   */
  doTransfer = (benefAcc: any, amount: number) => {
    let fromAcc: any = this.bankAccount;
    const avalBal = parseFloat(fromAcc.openingBal);

    if (avalBal < amount) {
      alert('Insufficient balance');
    } else {
      benefAcc.openingBal = `${parseFloat(benefAcc.openingBal) + amount}`;
      this.updateAccount(benefAcc, amount);
      this.logTransactionDetails(benefAcc.id, benefAcc.accHodlerName, 'credit', amount);

      fromAcc.openingBal = `${avalBal - amount}`;
      this.updateAccount(fromAcc, amount);
      this.logTransactionDetails(fromAcc.id, fromAcc.accHodlerName, 'debit', amount);

      this.transferFunds.reset();
      Object.keys(this.transferFunds.controls).forEach(key => {
        this.transferFunds.controls[key].setErrors(null);
      });
    }
  }

  /**
   * @description Account update functionality
   * @param {any} acc
   * @param {number} amount
   * @param {string} type
   * 
   */
  updateAccount = (acc: any, amount: number) => {
    this.updateAccTxnData = this.dataService.updateData(`${this.accBaseURL}/${acc.id}`, acc).subscribe((response) => {
      console.log(`Transaction update has been done for user: : ${acc.accHodlerName}`, response);
    }, (error) => {
      alert(`Transaction update has fail with error: ${error}`);
    }, () => {

    });
  }

  /**
   * @description Functionality for logging the transaction
   * @param {any} txn
   * @param {string} accUser
   */
  logTransactionDetails = (acctId: number, accUser: string, type: string, amount: number) => {
    let txn = {
      acctId,
      txnType: type,
      txnDate: new Date(),
      txmAmount: `${amount}`
    }

    this.postTxnData = this.dataService.postData(this.txnBaseURL, txn).subscribe((response) => {
      console.log('Transaction saved successfully...', accUser, 'Response: ', response);
    }, (error) => {
      console.log('error on Transaction save: ', error);
    }, () => {

    });
  }

  /**
 * @description functionality for unscbscribing
 */
ngOnDestroy() {
  if (this.getBenefAccData !== undefined) {
    this.getBenefAccData.unsubscribe();
  }

  if (this.postTxnData !== undefined) {
    this.postTxnData.unsubscribe();
  }

  if (this.updateAccTxnData !== undefined) {
    this.updateAccTxnData.unsubscribe();
  }
}
}
