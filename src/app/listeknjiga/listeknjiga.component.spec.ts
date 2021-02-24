import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeknjigaComponent } from './listeknjiga.component';

describe('ListeknjigaComponent', () => {
  let component: ListeknjigaComponent;
  let fixture: ComponentFixture<ListeknjigaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeknjigaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeknjigaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
