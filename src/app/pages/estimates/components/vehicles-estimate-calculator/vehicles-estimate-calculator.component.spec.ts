import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesEstimateCalculatorComponent } from './vehicles-estimate-calculator.component';

describe('VehiclesEstimateCalculatorComponent', () => {
  let component: VehiclesEstimateCalculatorComponent;
  let fixture: ComponentFixture<VehiclesEstimateCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VehiclesEstimateCalculatorComponent]
    });
    fixture = TestBed.createComponent(VehiclesEstimateCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
