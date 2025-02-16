import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaSafariComponent } from './alerta-safari.component';

describe('AlertaSafariComponent', () => {
  let component: AlertaSafariComponent;
  let fixture: ComponentFixture<AlertaSafariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaSafariComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaSafariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
