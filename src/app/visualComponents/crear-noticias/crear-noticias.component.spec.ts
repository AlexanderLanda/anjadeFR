import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNoticiasComponent } from './crear-noticias.component';

describe('CrearNoticiasComponent', () => {
  let component: CrearNoticiasComponent;
  let fixture: ComponentFixture<CrearNoticiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [CrearNoticiasComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearNoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
