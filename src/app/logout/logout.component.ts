import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: []
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: NavController) { }

  async ngOnInit(): Promise<void> {
    await this.authService.signOut();
    this.router.navigateRoot(['login']);
  }

}
