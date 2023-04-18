import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadtoplayComponent } from './readtoplay.component';

describe('ReadtoplayComponent', () => {
  let component: ReadtoplayComponent;
  let fixture: ComponentFixture<ReadtoplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadtoplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadtoplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
