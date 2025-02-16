import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReenviarPagoComponent } from './reenviar-pago.component';

describe('ReenviarPagoComponent', () => {
  let component: ReenviarPagoComponent;
  let fixture: ComponentFixture<ReenviarPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [ReenviarPagoComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReenviarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
