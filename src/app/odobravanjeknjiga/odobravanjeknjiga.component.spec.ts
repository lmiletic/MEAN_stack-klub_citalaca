import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdobravanjeknjigaComponent } from './odobravanjeknjiga.component';

describe('OdobravanjeknjigaComponent', () => {
  let component: OdobravanjeknjigaComponent;
  let fixture: ComponentFixture<OdobravanjeknjigaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdobravanjeknjigaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdobravanjeknjigaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
