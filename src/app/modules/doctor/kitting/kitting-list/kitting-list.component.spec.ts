import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KittingListComponent } from './kitting-list.component';

describe('KiddingListComponent', () => {
  let component: KittingListComponent;
  let fixture: ComponentFixture<KittingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KittingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KittingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
