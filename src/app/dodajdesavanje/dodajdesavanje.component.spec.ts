import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajdesavanjeComponent } from './dodajdesavanje.component';

describe('DodajdesavanjeComponent', () => {
  let component: DodajdesavanjeComponent;
  let fixture: ComponentFixture<DodajdesavanjeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodajdesavanjeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodajdesavanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
