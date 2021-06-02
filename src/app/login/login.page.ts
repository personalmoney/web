import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../core/helpers/base.component';
import { SharedService } from '../core/services/shared.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPageComponent extends BaseComponent {

  constructor(
    private authService: AuthService,
    private shared: SharedService,
    private router: Router
  ) {
    super()
    this.authService.currentUser
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data) {
          this.shared.showMenu$.next(true);
          this.router.navigate(['dashboard']);
        }
        else {
          this.shared.showMenu$.next(false);
        }
      });
  }

  async googleSignIn() {
    await this.authService.googleLogin();
  }
}
