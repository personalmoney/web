import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IAction } from '../../models/actions';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {

  @Input()
  events: IAction[];

  constructor(
    public popoverController: PopoverController
  ) { }

  invoke(event: IAction) {
    event.action();
    this.popoverController.dismiss();
  }

  close() {
    this.popoverController.dismiss();
  }
}
