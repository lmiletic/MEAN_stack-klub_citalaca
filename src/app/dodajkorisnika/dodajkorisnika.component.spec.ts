import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajkorisnikaComponent } from './dodajkorisnika.component';

describe('DodajkorisnikaComponent', () => {
  let component: DodajkorisnikaComponent;
  let fixture: ComponentFixture<DodajkorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodajkorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodajkorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
