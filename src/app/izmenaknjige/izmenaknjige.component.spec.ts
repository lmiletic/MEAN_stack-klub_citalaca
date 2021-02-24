import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IzmenaknjigeComponent } from './izmenaknjige.component';

describe('IzmenaknjigeComponent', () => {
  let component: IzmenaknjigeComponent;
  let fixture: ComponentFixture<IzmenaknjigeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IzmenaknjigeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzmenaknjigeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
