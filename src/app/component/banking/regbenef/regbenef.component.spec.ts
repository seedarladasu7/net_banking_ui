import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegbenefComponent } from './regbenef.component';

describe('RegbenefComponent', () => {
  let component: RegbenefComponent;
  let fixture: ComponentFixture<RegbenefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegbenefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegbenefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
