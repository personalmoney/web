import { Component, OnInit, Input } from '@angular/core';
import { BaseForm } from 'src/app/core/helpers/base-form';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Account } from '../models/account';
import { AccountType } from 'src/app/entities/account-type/models/account-type';
import { Store, Select } from '@ngxs/store';
import { AddAccount, GetAccounts, UpdateAccount } from '../store/actions';
import { AccountTypeState } from 'src/app/entities/account-type/store/store';
import { SharedService } from 'src/app/core/services/shared.service';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent extends BaseForm implements OnInit {

  @Input()
  account: Account;
  accountTypes: AccountType[] = [];
  @Select(AccountTypeState.getSortedData) accountTypes$: Observable<AccountType[]>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private storeService: StoreService,
    public shared: SharedService,
    private modal: ModalController
  ) {
    super();
    this.storeService.getAccountTypes();
  }

  ngOnInit() {
    if (!this.account) {
      this.account = { name: '', account_type_id: 0, include_in_balance: true, exclude_from_dashboard: false, is_active: true };
    }

    this.accountTypes$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.accountTypes = data;
      });

    this.form = this.formBuilder.group({
      name: [this.account.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      accountType: [this.shared.isWeb ? this.account.account_type_id : this.account.account_type_local_id,
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      creditLimit: [this.account.credit_limit, [Validators.min(0)]],
      includeInBalance: [this.account.include_in_balance, [Validators.required]],
      initialBalance: [this.account.initial_balance, [Validators.min(0)]],
      interestRate: [this.account.interest_rate, [Validators.min(0)]],
      minimumBalance: [this.account.minimum_balance, [Validators.min(0)]],
      paymentDate: [this.account.payment_date, [Validators.max(31)]],
      excludeFromDashboard: [this.account.exclude_from_dashboard],
      isActive: [this.account.is_active],
      notes: [this.account.notes]
    });
  }

  save() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      return;
    }
    const model = { ...this.account };

    model.name = this.form.controls.name.value;
    if (this.shared.isWeb) {
      model.account_type_id = this.form.controls.accountType.value;
    } else {
      model.account_type_local_id = this.form.controls.accountType.value;
      model.account_type_id = this.getaccountTypeLocalId(model.account_type_local_id);
    }
    model.include_in_balance = this.form.controls.includeInBalance.value;
    model.initial_balance = this.getNumberValue(this.form.controls.initialBalance.value);
    model.minimum_balance = this.getNumberValue(this.form.controls.minimumBalance.value);
    model.credit_limit = this.getNumberValue(this.form.controls.creditLimit.value);
    model.interest_rate = this.getNumberValue(this.form.controls.interestRate.value);
    model.payment_date = this.form.controls.paymentDate.value;
    model.exclude_from_dashboard = this.form.controls.excludeFromDashboard.value;
    model.notes = this.form.controls.notes.value;
    model.is_active = this.form.controls.isActive.value;

    if (typeof (model.include_in_balance) === 'string') {
      model.include_in_balance = model.include_in_balance === 'true';
    }
    if (typeof (model.exclude_from_dashboard) === 'string') {
      model.exclude_from_dashboard = model.exclude_from_dashboard === 'true';
    }
    let obserable: Observable<Account>;
    if (!model.id) {
      obserable = this.store.dispatch(new AddAccount(model));
    }
    else {
      obserable = this.store.dispatch(new UpdateAccount(model));
    }
    obserable
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        error: (err) => {
          this.handleErrors(err);
        },
        complete: () => {
          this.store.dispatch(new GetAccounts());
          this.close(true);
        }
      });
  }


  close(isSuccess: boolean = false) {
    this.modal.dismiss(isSuccess, 'click');
  }

  getNumberValue(input: any): number {
    const value = Number.parseFloat(input);
    return value ? value : 0;
  }

  getName() {
    /// TODO need to find the optimized way to do this
    if (!this.accountTypes) {
      return;
    }
    const value = this.form.controls.accountType.value;
    const type = this.accountTypes.find(c => this.shared.isWeb ? c.id === value : c.local_id === value);
    return type ? type.name : '';
  }

  getaccountTypeLocalId(value: number): number {
    if (!this.accountTypes) {
      return;
    }
    const record = this.accountTypes.find(c => c.local_id === value);
    return record ? record.id : 0;
  }
}
