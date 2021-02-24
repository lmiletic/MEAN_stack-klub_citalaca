import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PretragakorisnikaComponent } from './pretragakorisnika.component';

describe('PretragakorisnikaComponent', () => {
  let component: PretragakorisnikaComponent;
  let fixture: ComponentFixture<PretragakorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PretragakorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PretragakorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
