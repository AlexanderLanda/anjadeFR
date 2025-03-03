import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasReaderComponent } from './noticias-reader.component';

describe('NoticiasReaderComponent', () => {
  let component: NoticiasReaderComponent;
  let fixture: ComponentFixture<NoticiasReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasReaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiasReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
