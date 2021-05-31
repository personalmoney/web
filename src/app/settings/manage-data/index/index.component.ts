import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/helpers/base.component';
import { StoreService } from 'src/app/store/store.service';
import { DataViewComponent } from '../data-view/data-view.component';
import { DataEntity } from '../models/data-entity';
import { ExportService } from '../services/export.service';
import { ImportService } from '../services/import.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent extends BaseComponent implements OnInit {

  entities: DataEntity[] = [];
  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;
  selectedEntity: DataEntity;

  constructor(
    private storeService: StoreService,
    private store: Store,
    private importService: ImportService,
    private exportService: ExportService,
    private modal: ModalController,
    public toastController: ToastController
  ) {
    super();
  }

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    this.entities = [
      {
        code: 'account',
        name: 'Accounts',
        importEnabled: false,
        exportEnabled: true,
        headers: ['id', 'name', 'isActive', 'accountTypeId', 'initialBalance', 'minimumBalance', 'creditLimit',
          'paymentDate', 'interestRate', 'includeInBalance', 'excludeFromDashboard', 'notes', 'number']
      },
      {
        code: 'payee',
        name: 'Payees',
        importEnabled: false,
        exportEnabled: true,
        headers: ['id', 'name']
      },
      {
        code: 'tag',
        name: 'Tags',
        importEnabled: false,
        exportEnabled: true,
        headers: ['id', 'name']
      },
      {
        code: 'category',
        name: 'Categories',
        importEnabled: false,
        exportEnabled: true,
        headers: ['id', 'name']
      },
      {
        code: 'sub-category',
        name: 'Sub Categories',
        importEnabled: false,
        exportEnabled: true,
        headers: ['id', 'name', 'categoryId', 'categoryName']
      }
    ];
  }

  export(entity: DataEntity) {
    console.log('Exporting ' + entity.name);

    const store = this.getState(entity);

    store
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {

        if (data) {
          if (data.length <= 0) {
            this.presentToast(`No records found`, 'warning');
          } else {
            const csvString = this.exportService.convertToCSV(data, entity.headers);
            this.exportService.downloadFile(csvString, entity.name);
            this.presentToast(`Exported ${data.length} ${entity.name}`);
          }
        }

      });
  }

  getState(entity: DataEntity) {
    switch (entity.code) {
      case 'account':
        this.storeService.getAccounts();
        return this.store.select(store => store.accounts.data);

      case 'tag':
        this.storeService.getTags();
        return this.store.select(store => store.tags.data);

      case 'payee':
        this.storeService.getPayees();
        return this.store.select(store => store.payees.data);

      case 'category':
        this.storeService.getCategories();
        return this.store.select(store => store.categories.data);

      case 'sub-category':
        this.storeService.getCategories();
        return this.store.select(store => store.categories.data)
          .pipe(switchMap(data => {
            if (data) {
              let array = data.map(c =>
                c.subCategories.map(d => ({ categoryId: c.id, categoryName: c.name, ...d })))
                .flat();
              return of(array);
            }
            else {
              return of(data);
            }
          }));

      case 'transaction':
        return of(null);
    }

    return of(null);
  }

  async presentToast(message: string, color = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

  import(entity: DataEntity) {
    //console.log('Importing ' + entity.name);

    this.selectedEntity = entity;
    this.csvReader.nativeElement.click();
  }

  uploadListener($event: any): void {

    let files = $event.srcElement.files;

    if (this.importService.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = async () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.importService.getHeaderArray(csvRecordsArray);

        this.records = this.importService.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow);

        const modalConfig = {
          component: DataViewComponent,
          showBackdrop: true,
          backdropDismiss: false,
          animated: true,
          swipeToClose: true,
          componentProps: {
            entity: this.selectedEntity,
            headers: headersRow,
            data: this.records
          }
        };
        const dialog = await this.modal.create(modalConfig);
        await dialog.present();
        this.fileReset();
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      this.presentToast("Please import valid .csv file.", 'warning');
      this.fileReset();
    }
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }
}
