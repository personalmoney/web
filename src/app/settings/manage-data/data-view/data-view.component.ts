import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataEntity } from '../models/data-entity';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.scss']
})
export class DataViewComponent {

  @Input() entity: DataEntity;
  @Input() headers: string[] = [];
  @Input() data: any[] = [];

  constructor(private modal: ModalController) { }

  close() {
    this.modal.dismiss(false, 'click');
  }

}
