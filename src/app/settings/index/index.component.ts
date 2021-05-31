import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {

  dark = false;

  constructor(
    private authService: AuthService,
    private router: NavController
  ) {
    const prefersColor = window.matchMedia('(prefers-color-scheme: dark)');
    this.dark = prefersColor.matches;
    this.updateDarkMode();

    prefersColor.addEventListener(
      'change',
      mediaQuery => {
        this.dark = mediaQuery.matches;
        this.updateDarkMode();
      }
    );
  }

  updateDarkMode() {
    document.body.classList.toggle('dark', this.dark);
  }

  async logOut() {
    await this.authService.signOut();
    this.router.navigateRoot(['login']);
  }

  import() {
    this.router.navigateForward(['settings/manage-data']);
  }

  export() {
    this.router.navigateForward(['settings/manage-data']);
  }

}
