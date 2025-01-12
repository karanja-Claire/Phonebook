import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'phonebook';

  toggleDarkMode(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const htmlElement = document.documentElement;
    if (isChecked) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
}
