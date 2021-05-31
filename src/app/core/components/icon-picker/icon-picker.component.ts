import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AssetsService } from '../../services/assets.service';
import { Icon } from '../../models/font-awesome-library';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss'],
})
export class IconPickerComponent implements OnInit {

  icons: Icon[] = [];
  filteredIcons: Icon[] = [];
  currentIndex = 0;
  currentSearchValue = '';

  constructor(
    private modal: ModalController,
    private assets: AssetsService
  ) { }

  ngOnInit() {
    this.assets.getFontAwesomeIcons()
      .subscribe(c => {
        c.icons.fas.map(icon => this.icons.push({ prefix: 'fas', name: icon }));
        c.icons.far.map(icon => this.icons.push({ prefix: 'far', name: icon }));
        c.icons.fab.map(icon => this.icons.push({ prefix: 'fab', name: icon }));
        this.loadData(null);
      });
  }

  dismiss(icon: string = null) {
    this.modal.dismiss(icon, 'click');
  }

  search($event) {
    this.currentSearchValue = $event.detail.value;
    this.filteredIcons = [];
    this.currentIndex = 0;
    this.loadData(null);
  }

  loadData(event) {

    if (this.currentIndex === this.icons.length) {
      event.target.disabled = true;
      return;
    }
    const startIndex = this.currentIndex;
    let endIndex = startIndex + 30;
    if (endIndex > this.icons.length) {
      endIndex = this.icons.length;
    }

    this.icons.filter(c => c.name.toLowerCase().includes(this.currentSearchValue.toLowerCase()))
      .slice(startIndex, endIndex)
      .map(c => this.filteredIcons.push(c));

    if (event) {
      event.target.complete();
    }
    this.currentIndex = endIndex;
  }
}
