import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpravljanjeulogamaComponent } from './upravljanjeulogama.component';

describe('UpravljanjeulogamaComponent', () => {
  let component: UpravljanjeulogamaComponent;
  let fixture: ComponentFixture<UpravljanjeulogamaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpravljanjeulogamaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpravljanjeulogamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
