import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {

  constructor(private router: NavController) { }

  navigate(path: string) {
    this.router.navigateForward(['entities/' + path]);
  }
}
