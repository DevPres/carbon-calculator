import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEstimateDialogComponent } from './create-estimate-dialog.component';

describe('CreateEstimateDialogComponent', () => {
  let component: CreateEstimateDialogComponent;
  let fixture: ComponentFixture<CreateEstimateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateEstimateDialogComponent]
    });
    fixture = TestBed.createComponent(CreateEstimateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
