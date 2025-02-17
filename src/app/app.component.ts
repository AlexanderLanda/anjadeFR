import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuNavBarComponent } from './visualComponents/menu-nav-bar/menu-nav-bar.component';
import { AyudaChatComponent } from './visualComponents/ayuda-chat/ayuda-chat.component';
import { FooterComponent } from './visualComponents/footer/footer.component';
import { HomeComponentComponent } from "./visualComponents/home-component/home-component.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuNavBarComponent, AyudaChatComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'anjadeFR';
}
