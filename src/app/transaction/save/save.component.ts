import { Component, OnInit } from '@angular/core';
import { BaseForm } from 'src/app/core/helpers/base-form';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Account } from 'src/app/accounts/models/account';
import { Transaction } from '../models/transaction';
import { Payee } from 'src/app/entities/payees/models/payee';
import { Tag } from 'src/app/entities/tags/models/tag';
import { StoreService } from 'src/app/store/store.service';
import { SubCategory } from 'src/app/entities/categories/models/sub-category';
import { Category } from 'src/app/entities/categories/models/category';
import { TransactionService } from '../service/transaction.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TransactionView } from '../models/transaction-view';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent extends BaseForm implements OnInit {

  accounts: Account[] = [];
  payees: Payee[] = [];
  filteredPayees: Payee[] = [];

  tags: Tag[] = [];
  filteredTags: Tag[] = [];

  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  filteredCategories: SubCategory[] = [];

  isEdit = false;
  transactionId = 0;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private service: TransactionService,
    private router: NavController,
    private activeRoute: ActivatedRoute,
    private spinner: SpinnerVisibilityService,
    private storeService: StoreService
  ) {
    super();

    this.storeService.getAccounts();
    this.storeService.getCategories();
    this.storeService.getPayees();
    this.storeService.getTags();
  }

  ngOnInit() {
    const date = new Date().toISOString().slice(0, 10);
    this.form = this.formBuilder.group({
      type: [2, [Validators.required]],
      date: [date, [Validators.required]],
      account: ['', [Validators.required]],
      toAccount: [''],
      amount: ['', [Validators.required]],
      category: ['', [Validators.required]],
      payee: ['', [Validators.required]],
      tags: [''],
      notes: [''],
    });

    this.store.select(result => {
      this.payees = result.payees.data;
      this.tags = result.tags.data;
      this.categories = result.categories.data;
    }).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();

    this.store.select(c => c.accounts.data)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(data => {
          this.accounts = data;

          this.activeRoute.paramMap
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data2) => {
              const accountId = data2.get('accountId');
              const id = data2.get('id');
              if (accountId && data) {
                const account = data.find(c => c.id == accountId);
                this.form.patchValue({ account: account });
              }
              else if (id && data) {
                this.getData(id);
                this.isEdit = true;
              }

            });
        })).subscribe();

    this.subCategories = [];
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  getData(id: string) {
    this.service.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: TransactionView) => {
        if (data) {
          this.searchCategories({});
          this.transactionId = data.id;
          this.form.patchValue({
            type: data.type,
            date: new Date(data.date).toISOString().slice(0, 10),
            account: this.accounts.find(d => d.id === data.accountId),
            toAccount: this.accounts.find(d => d.id === data.toAccountId),
            amount: data.amount,
            category: this.subCategories.find(d => d.id === data.subCategoryId),
            payee: this.payees.find(d => d.id === data.payeeId),
            tags: data.tags,
            notes: data.notes,
          });
          this.selectType(data.type);
        }
      });
  }

  searchCategories($event) {
    if (this.subCategories.length <= 0 && this.categories) {
      this.categories.forEach(c => {
        const result = c.sub_categories.map(d => Object.assign({}, d, { categoryName: c.name }));
        this.subCategories.push(...result);
      });
    }
    this.filteredCategories = this.search($event, this.subCategories);
  }

  searchPayees($event) {
    this.filteredPayees = this.search($event, this.payees);
  }

  searchTags($event) {
    this.filteredTags = this.search($event, this.tags);
  }

  search($event, records) {
    const filteredRecords = [];
    if (!records) {
      return filteredRecords;
    }
    const text = ($event.text || '').trim().toLowerCase();
    records.filter(c => c.name.toLowerCase().includes(text))
      .map(c => filteredRecords.push(c));
    return filteredRecords;
  }

  selectType(value: number) {
    this.form.controls.type.setValue(value);
    if (value === 3) {
      this.form.controls.category.clearValidators();
      this.form.controls.payee.clearValidators();
      this.form.controls.toAccount.setValidators(Validators.required);
    } else {
      this.form.controls.category.setValidators(Validators.required);
      this.form.controls.payee.setValidators(Validators.required);
      this.form.controls.toAccount.clearValidators();
    }
    this.form.controls.category.updateValueAndValidity();
    this.form.controls.payee.updateValueAndValidity();
    this.form.controls.toAccount.updateValueAndValidity();
  }

  save() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const model: Transaction = {
      id: this.transactionId,
      accountId: this.form.controls.account.value.id,
      accountLocalId: this.form.controls.account.value.localId,
      amount: this.form.controls.amount.value,
      type: this.form.controls.type.value,
      date: this.form.controls.date.value,
      notes: this.form.controls.notes.value,
    };
    if (model.type === 3) {
      model.toAccountId = this.form.controls.toAccount.value.id;
      model.toAccountLocalId = this.form.controls.toAccount.value.localId;

      if (model.accountId === model.toAccountId) {
        this.form.controls.toAccount.setErrors({ remoteError: 'From and To Account should be different' });
        return;
      }
    }
    else {
      model.subCategoryId = this.form.controls.category.value.id;
      model.subCategoryLocalId = this.form.controls.category.value.localId;
      model.payeeId = this.form.controls.payee.value.id;
      model.payeeLocalId = this.form.controls.payee.value.localId;
      model.tagIds = [];
      model.tagIdsLocal = [];
      if (this.form.controls.tags.value) {
        this.form.controls.tags.value.forEach(element => {
          if (element.localId) {
          }
          if (element.id) {
            model.tagIds.push(element.id);
          }
        });
      }
    }
    let obserable: Observable<Transaction>;
    if (!model.id && !model.local_id) {
      obserable = this.service.create(model);
    }
    else {
      obserable = this.service.update(model);
    }
    obserable
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        error: (err) => {
          this.handleErrors(err);
        },
        complete: () => {
          this.storeService.getAccounts(true);
          this.router.navigateRoot(['transactions/account', model.accountId]);
        }
      });
  }
}
