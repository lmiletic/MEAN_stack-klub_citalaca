import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdobravanjekorisnikaComponent } from './odobravanjekorisnika.component';

describe('OdobravanjekorisnikaComponent', () => {
  let component: OdobravanjekorisnikaComponent;
  let fixture: ComponentFixture<OdobravanjekorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdobravanjekorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdobravanjekorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
