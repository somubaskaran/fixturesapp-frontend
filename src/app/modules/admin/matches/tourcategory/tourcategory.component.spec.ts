import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourcategoryComponent } from './tourcategory.component';

describe('TourcategoryComponent', () => {
  let component: TourcategoryComponent;
  let fixture: ComponentFixture<TourcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
