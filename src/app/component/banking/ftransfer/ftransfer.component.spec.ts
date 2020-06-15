import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FtransferComponent } from './ftransfer.component';

describe('FtransferComponent', () => {
  let component: FtransferComponent;
  let fixture: ComponentFixture<FtransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
