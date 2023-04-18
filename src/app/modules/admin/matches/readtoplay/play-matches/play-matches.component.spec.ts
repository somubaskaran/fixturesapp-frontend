import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayMatchesComponent } from './play-matches.component';

describe('PlayMatchesComponent', () => {
  let component: PlayMatchesComponent;
  let fixture: ComponentFixture<PlayMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayMatchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
