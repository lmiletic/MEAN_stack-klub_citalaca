import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UredjivanjezanrovaComponent } from './uredjivanjezanrova.component';

describe('UredjivanjezanrovaComponent', () => {
  let component: UredjivanjezanrovaComponent;
  let fixture: ComponentFixture<UredjivanjezanrovaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UredjivanjezanrovaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UredjivanjezanrovaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
