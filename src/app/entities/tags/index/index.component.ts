import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/core/helpers/base.component';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { SaveComponent } from '../save/save.component';
import { TagState } from '../store/store';
import { Store, Select } from '@ngxs/store';
import { DeleteTag } from '../store/actions';
import { StoreService } from 'src/app/store/store.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent extends BaseComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @Select(TagState.getSortedData) tags$: Observable<Tag[]>;
  tags: Tag[] = [];
  filteredTags: Tag[] = [];
  displayedTags: Tag[] = [];
  currentSearchTerm: string = '';

  constructor(
    private store: Store,
    private alertController: AlertController,
    private storeService: StoreService,
    private platform: Platform,
    private modal: ModalController
  ) {
    super();
  }

  async ngOnInit() {
    await this.platform.ready();
    this.height = this.platform.height();
    this.width = this.platform.width();

    this.storeService.getTags();
    this.tags$.pipe(
      takeUntil(this.ngUnsubscribe),
      tap((data) => {
        if (data) {
          this.tags = data;
          this.doFilter();
        }
      })).subscribe();
  }

  loadMoreData($event) {
    const recordsCount = this.displayedTags.length;
    if (recordsCount >= this.filteredTags.length) {
      if ($event) {
        $event.target.disabled = true;
      }
      return;
    }
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
    let requiredRecords = Math.ceil(this.height / 50);
    if (this.width > 768) {
      requiredRecords = Math.ceil(this.height / 25);
    }
    const nextRecords = this.filteredTags.slice(recordsCount, recordsCount + requiredRecords);
    this.displayedTags.push(...nextRecords);

    if ($event) {
      $event.target.complete();
    }
  }

  filterItems($event) {
    this.currentSearchTerm = $event.detail.value;
    this.doFilter();
  }

  private doFilter() {
    if (this.currentSearchTerm && this.currentSearchTerm.trim() !== '') {
      this.currentSearchTerm = this.currentSearchTerm.toLowerCase();
      this.filteredTags = this.tags.filter((item) => {
        return (item.name.toLowerCase().indexOf(this.currentSearchTerm) > -1);
      });
    } else {
      this.filteredTags = this.tags;
    }
    this.displayedTags = [];
    this.loadMoreData(null);
  }

  async create() {
    const modalConfig = {
      component: SaveComponent,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true
    };
    await this.showDialog(modalConfig);
  }

  private async showDialog(modalConfig) {
    const dialog = await this.modal.create(modalConfig);
    await dialog.present();
    await dialog.onDidDismiss();
  }

  async edit(tag: Tag) {
    const modalConfig = {
      component: SaveComponent,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true,
      componentProps: {
        tag
      }
    };
    await this.showDialog(modalConfig);
  }

  async delete(tag: Tag) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete ' + tag.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.store.dispatch(new DeleteTag(tag));
          }
        }
      ]
    });
    await alert.present();
  }
}

