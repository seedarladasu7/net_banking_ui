import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/service/http/http.service';
import { environment } from '../../../../environments/environment'
import { Router } from '@angular/router';

/**
 * @description Angular component:  Beneficiary Registration
 */
@Component({
  selector: 'app-regbenef',
  templateUrl: './regbenef.component.html',
  styleUrls: ['./regbenef.component.css']
})
export class RegbenefComponent implements OnInit {
  userLoginFlag: string = '';
  usersInfo: Array<any> = [];
  beneficiaryForm: FormGroup;
  regStatus: string = '';
  isBenefFormSubmitted: boolean = false;
  userBaseURL: string = `${environment.baseURL}/user`;
  acctBaseURL: string = `${environment.baseURL}/account`;
  benefBaseURL: string = `${environment.baseURL}/beneficiary`;
  getAcctData: any;
  postBenefData; any;
  beneficiaryAcct: any;

  constructor(private dataService: HttpService, private router: Router) { }

  /***
   * @description Action on component initialization
   */
  ngOnInit(): void {
    this.beneficiaryForm = new FormGroup({
      benefNickName: new FormControl('', [Validators.required]),
      benefAcctNo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]),
      benefMobileNo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(13)])
    });
  }

  

  formControls = () => { return this.beneficiaryForm.controls; }

  /**
   * @description Submit beneficiary form to register
   */
  registerBeneficiary = () => {
    this.isBenefFormSubmitted = true;
    if (this.beneficiaryForm.valid) {
      // Object de-construct
      const mobNo = this.beneficiaryForm.controls.benefMobileNo.value;
      const acctNo = this.beneficiaryForm.controls.benefAcctNo.value;
      const nickName = this.beneficiaryForm.controls.benefNickName.value;
      this.getAcctData = this.dataService.getData(`${this.acctBaseURL}?accNumber=${acctNo}&mobileNo=${mobNo}`).subscribe((response) => {
        if (response !== undefined && response.length > 0) {
          this.beneficiaryAcct = response[0];
          this.saveBeneficiary(nickName);
        } else {
          alert('Invalid beneficiary details')
        }
      }, (error) => {
        console.log('error on Beneficiary register: ', error);
      }, () => {
        this.clearUserRegForm();
        //this.router.navigate(['/user-list']);
      });
    } else {
      console.log('Invalid beneficiary form');
    }
  }


  /**
   * @deprecated Save beneficiary
   * @param {string} nickName
   */
  saveBeneficiary = (nickName: string) => {

    if (this.beneficiaryAcct !== undefined && this.beneficiaryAcct !== null) {
      let userId: number = 0;
      let acctId: number = 0;
      if (sessionStorage.getItem('loggedInUser') !== null && sessionStorage.getItem('loggedInUser') !== undefined) {
        userId = JSON.parse(sessionStorage.getItem('loggedInUser')).id;
      }

      if (sessionStorage.getItem('bankAccount') !== null && sessionStorage.getItem('bankAccount') !== undefined) {
        acctId = JSON.parse(sessionStorage.getItem('bankAccount')).id;
      }
      // Object shortend property
      let benef = {
        userId: `${userId}`,
        acctId: `${acctId}`,
        benefAcctId: `${this.beneficiaryAcct.id}`,
        benefUserId: this.beneficiaryAcct.userId,
        benefNickName: nickName,
        addedOn: new Date()
      };

      this.postBenefData = this.dataService.postData(this.benefBaseURL, benef).subscribe((response) => {
        console.log('Beneficiary data has been saved successfully...', response);
        this.regStatus = 'Beneficiary registration successful...';
      }, (error) => {
        console.log('error on Beneficiary register: ', error);
      }, () => {
        this.clearUserRegForm();
        //this.router.navigate(['/user-list']);
      });

    }
  }


  /**
   * @description Clearing Login form
   */
  clearUserRegForm = () => {
    this.beneficiaryForm.reset();
    this.beneficiaryForm.clearAsyncValidators();
    this.isBenefFormSubmitted = false;
  }

  /**
   * @description Unsubscribe login fuctionality with Http Service
   */
  ngOnDestroy() {
    if (this.getAcctData !== undefined) {
      this.getAcctData.unsubscribe();
    }

    if (this.postBenefData !== undefined) {
      this.postBenefData.unsubscribe();
    }
  }

}
