import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajknjiguComponent } from './dodajknjigu.component';

describe('DodajknjiguComponent', () => {
  let component: DodajknjiguComponent;
  let fixture: ComponentFixture<DodajknjiguComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodajknjiguComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodajknjiguComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
