import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../core/services/shared.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPageComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private shared: SharedService,
    private router: Router
  ) { }

  ngOnInit() {
    this.shared.showMenu$.next(false);
  }

  async googleSignIn() {
    const result = await this.authService.googleLogin();
    console.log(result);

    if (result) {
      setTimeout(() => {
        this.router.navigate(['dashboard']);
      }, 2000);
    }
  }
}
