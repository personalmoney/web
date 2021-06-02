import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/helpers/base.component';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { SaveComponent } from '../save/save.component';
import { SubCategory } from '../models/sub-category';
import { SubCategoryComponent } from '../sub-category/sub-category.component';
import { ActionsComponent } from 'src/app/core/components/actions/actions.component';
import { CategoryState } from '../store/category-state';
import { Select, Store } from '@ngxs/store';
import { DeleteCategory, DeleteSubCategory } from '../store/actions';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent extends BaseComponent implements OnInit {

  @Select(CategoryState.getSortedData) categories$: Observable<Category[]>;
  selectedIds = [];

  constructor(
    private store: Store,
    private alertController: AlertController,
    public popoverController: PopoverController,
    private storeService: StoreService,
    private modal: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.storeService.getCategories();
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
    const result = await dialog.onDidDismiss();
    return result.data;
  }

  async edit(category: Category) {
    const modalConfig = {
      component: SaveComponent,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true,
      componentProps: {
        category
      }
    };
    await this.showDialog(modalConfig);
  }

  async delete(category: Category) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete ' + category.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.store.dispatch(new DeleteCategory(category));
          }
        }
      ]
    });
    await alert.present();
  }

  select(category: Category) {
    if (this.selectedIds.includes(category.id)) {
      this.selectedIds = this.selectedIds.filter(c => c !== category.id);
    }
    else {
      this.selectedIds.push(category.id);
    }
  }

  async createSubCategory(category: Category) {
    const modalConfig = {
      component: SubCategoryComponent,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true,
      componentProps: {
        categoryId: category.id,
        localCategoryId: category.local_id
      }
    };
    this.showDialog(modalConfig);
  }

  async showOptions(event, subCategory: SubCategory) {
    const popover = await this.popoverController.create({
      component: ActionsComponent,
      event,
      translucent: true,
      componentProps: {
        editEvent: () => {
          this.editSubCategory(subCategory);
        },
        deleteEvent: () => {
          this.deleteSubCategory(subCategory);
        }
      }
    });
    return await popover.present();
  }

  async editSubCategory(subCategory: SubCategory) {
    const modalConfig = {
      component: SubCategoryComponent,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true,
      componentProps: {
        categoryId: subCategory.category_id,
        localCategoryId: subCategory.local_category_id,
        subCategory
      }
    };
    await this.showDialog(modalConfig);
  }

  async deleteSubCategory(subCategory: SubCategory) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete ' + subCategory.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.store.dispatch(new DeleteSubCategory(subCategory));
          }
        }
      ]
    });
    await alert.present();
  }
}
