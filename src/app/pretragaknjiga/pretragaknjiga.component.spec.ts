import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PretragaknjigaComponent } from './pretragaknjiga.component';

describe('PretragaknjigaComponent', () => {
  let component: PretragaknjigaComponent;
  let fixture: ComponentFixture<PretragaknjigaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PretragaknjigaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PretragaknjigaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
