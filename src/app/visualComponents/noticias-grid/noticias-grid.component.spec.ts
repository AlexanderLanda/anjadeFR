import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasGridComponent } from './noticias-grid.component';

describe('NoticiasGridComponent', () => {
  let component: NoticiasGridComponent;
  let fixture: ComponentFixture<NoticiasGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [NoticiasGridComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiasGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
