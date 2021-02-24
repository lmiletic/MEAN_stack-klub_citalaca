import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PregleddesavanjaComponent } from './pregleddesavanja.component';

describe('PregleddesavanjaComponent', () => {
  let component: PregleddesavanjaComponent;
  let fixture: ComponentFixture<PregleddesavanjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PregleddesavanjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregleddesavanjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
