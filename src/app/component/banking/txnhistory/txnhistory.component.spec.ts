import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnhistoryComponent } from './txnhistory.component';

describe('TxnhistoryComponent', () => {
  let component: TxnhistoryComponent;
  let fixture: ComponentFixture<TxnhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxnhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxnhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
