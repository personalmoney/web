import { Component, Input, OnInit } from '@angular/core';
import { BaseForm } from 'src/app/core/helpers/base-form';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { combineLatest, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Account } from 'src/app/accounts/models/account';
import { Transaction } from '../models/transaction';
import { Payee } from 'src/app/entities/payees/models/payee';
import { Tag } from 'src/app/entities/tags/models/tag';
import { StoreService } from 'src/app/store/store.service';
import { SubCategory } from 'src/app/entities/categories/models/sub-category';
import { Category } from 'src/app/entities/categories/models/category';
import { TransactionService } from '../service/transaction.service';
import { ModalController, NavController } from '@ionic/angular';
import { TransactionView } from '../models/transaction-view';
import { AccountState } from 'src/app/accounts/store/store';
import { PayeeState } from 'src/app/entities/payees/store/store';
import { TagState } from 'src/app/entities/tags/store/store';
import { CategoryState } from 'src/app/entities/categories/store/category-state';

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

  recentCategories: SubCategory[] = [];
  showRecent = true;

  isEdit = false;
  @Input() transaction: TransactionView;
  @Input() accountId: number;
  @Input() oldTransaction: TransactionView

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private service: TransactionService,
    private router: NavController,
    private modal: ModalController,
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
      type: ['Withdraw', [Validators.required]],
      date: [date, [Validators.required]],
      account: ['', [Validators.required]],
      toAccount: [''],
      amount: ['', [Validators.required]],
      category: ['', [Validators.required]],
      payee: ['', [Validators.required]],
      tags: [''],
      notes: [''],
    });

    this.subCategories = [];
    const obserable = [];

    obserable.push(this.store.select(PayeeState.getSortedData));
    obserable.push(this.store.select(TagState.getSortedData));
    obserable.push(this.store.select(CategoryState.getSortedData));
    obserable.push(this.store.select(AccountState.getSortedData));

    combineLatest(obserable)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (!data[0] || !data[1] || !data[2] || !data[3]) {
          return;
        }
        this.payees = data[0] as Payee[];
        this.tags = data[1] as Tag[];
        this.categories = data[2] as Category[];
        if (this.transaction) {
          this.accounts = data[3] as Account[];
        } else {
          this.accounts = (data[3] as Account[]).filter(c => c.is_active === true);
        }

        this.searchCategories({});

        if (this.accountId && data) {
          const account = this.accounts.find(c => c.id == this.accountId);
          this.form.patchValue({ account: account });
        }
        else if (this.transaction && data) {
          this.fillForm(this.transaction);
          this.isEdit = true;
        }
        else if (this.oldTransaction && data) {
          this.fillForm(this.oldTransaction);
          this.form.patchValue({ date: new Date().toISOString().slice(0, 10), });
        }
      });
  }

  private fillForm(data: TransactionView) {
    this.form.patchValue({
      type: data.trans_type,
      date: new Date(data.trans_date).toISOString().slice(0, 10),
      account: this.accounts.find(d => d.id === data.account_id),
      toAccount: this.accounts.find(d => d.id === data.to_account_id),
      amount: data.amount,
      category: this.subCategories.find(d => d.id === data.sub_category_id),
      payee: this.payees.find(d => d.id === data.payee_id),
      tags: data.tags,
      notes: data.notes,
    });
    this.selectType({ detail: { value: data.trans_type } });
  }

  searchCategories($event) {
    if (this.subCategories.length <= 0 && this.categories) {
      this.categories.forEach(c => {
        const result = c.sub_categories.map(d => Object.assign({}, d, { category_name: c.name }));
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

  selectType(event: any) {
    const value = event.detail.value

    this.form.controls.type.setValue(value);
    if (value === 'Transfer') {
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
      id: this.isEdit ? this.transaction.id : 0,
      account_id: this.form.controls.account.value.id,
      account_local_id: this.form.controls.account.value.localId,
      amount: this.form.controls.amount.value,
      trans_type: this.form.controls.type.value,
      trans_date: this.form.controls.date.value,
      notes: this.form.controls.notes.value,
    };
    if (model.trans_type === 'Transfer') {
      model.to_account_id = this.form.controls.toAccount.value.id;
      model.to_account_local_id = this.form.controls.toAccount.value.localId;

      if (model.account_id === model.to_account_id) {
        this.form.controls.toAccount.setErrors({ remoteError: 'From and To Account should be different' });
        return;
      }
    }
    else {
      model.sub_category_id = this.form.controls.category.value.id;
      model.sub_category_local_id = this.form.controls.category.value.localId;
      model.payee_id = this.form.controls.payee.value.id;
      model.payee_local_id = this.form.controls.payee.value.localId;
      model.tag_ids = [];
      model.tag_ids_local = [];
      if (this.form.controls.tags.value) {
        this.form.controls.tags.value.forEach(element => {
          if (element.localId) {
          }
          if (element.id) {
            model.tag_ids.push(element.id);
          }
        });
      }
    }
    let obserable: Promise<Transaction>;
    if (!model.id && !model.local_id) {
      obserable = this.service.create(model);
    }
    else {
      obserable = this.service.update(model);
    }
    obserable
      .catch(err => {
        this.handleErrors(err);
      })
      .then(() => {
        this.storeService.getAccounts(true);
        this.close();
        this.router.navigateRoot(['transactions/account', model.trans_type === 'Transfer' ? model.to_account_id : model.account_id]);
      });
  }

  close(isSuccess: boolean = false) {
    this.modal.dismiss(isSuccess, 'click');
  }

  async findCategory(event) {
    if (!event || !event.value || !event.value.id) {
      return;
    }
    this.form.controls.category.reset();
    this.recentCategories = [];
    const result = await this.service.getCategories(event.value.id);
    if (result.length == 1) {
      const category = this.subCategories.find(c => result[0] === c.id);
      this.form.patchValue({ category: category });
    }
    else if (result.length > 1) {
      this.recentCategories = this.subCategories.filter(c => result.includes(c.id));
    }
  }

  selectCategory($event) {
    this.form.patchValue({ category: $event.detail.value });
  }
}
