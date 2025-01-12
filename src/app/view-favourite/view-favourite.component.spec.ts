import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFavouriteComponent } from './view-favourite.component';

describe('ViewFavouriteComponent', () => {
  let component: ViewFavouriteComponent;
  let fixture: ComponentFixture<ViewFavouriteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewFavouriteComponent]
    });
    fixture = TestBed.createComponent(ViewFavouriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
