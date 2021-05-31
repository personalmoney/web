import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {

  @Input()
  editEvent: () => void;

  @Input()
  deleteEvent: () => void;

  constructor(
    public popoverController: PopoverController
  ) { }


  edit() {
    if (this.editEvent) {
      this.editEvent();
    }
    this.close();
  }

  remove() {
    if (this.deleteEvent) {
      this.deleteEvent();
    }
    this.close();
  }

  close() {
    this.popoverController.dismiss();
  }
}
