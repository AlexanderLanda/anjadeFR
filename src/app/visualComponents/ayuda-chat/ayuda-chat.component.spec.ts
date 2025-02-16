import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaChatComponent } from './ayuda-chat.component';

describe('AyudaChatComponent', () => {
  let component: AyudaChatComponent;
  let fixture: ComponentFixture<AyudaChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [AyudaChatComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AyudaChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
