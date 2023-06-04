import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingsEstimateCalculatorComponent } from './billings-estimate-calculator.component';

describe('BillingsEstimateCalculatorComponent', () => {
  let component: BillingsEstimateCalculatorComponent;
  let fixture: ComponentFixture<BillingsEstimateCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BillingsEstimateCalculatorComponent]
    });
    fixture = TestBed.createComponent(BillingsEstimateCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
