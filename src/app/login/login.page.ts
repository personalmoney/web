import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../core/helpers/base.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPageComponent extends BaseComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    super()
    this.authService.currentUser
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data) {
          setTimeout(() => {
            this.router.navigate(['dashboard']);
          }, 500);
        }
      });
  }

  async googleSignIn() {
    await this.authService.googleLogin();
  }
}
