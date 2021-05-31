import { Component, OnInit, Input } from '@angular/core';
import { BaseForm } from 'src/app/core/helpers/base-form';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { takeUntil, last, takeLast } from 'rxjs/operators';
import { Account } from '../models/account';
import { AccountType } from 'src/app/entities/account-type/models/account-type';
import { Store, Select } from '@ngxs/store';
import { AddAccount, UpdateAccount } from '../store/actions';
import { AccountTypeState } from 'src/app/entities/account-type/store/store';
import { GetAccountTypes } from 'src/app/entities/account-type/store/actions';
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
  isWeb = false;
  @Select(AccountTypeState.getData) accountTypes$: Observable<AccountType[]>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private storeService: StoreService,
    shared: SharedService,
    private modal: ModalController
  ) {
    super();
    shared.isWeb
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        this.isWeb = c;
      });
    this.storeService.getAccountTypes();
  }

  ngOnInit() {
    if (!this.account) {
      this.account = { name: '', accountTypeId: 0, includeInBalance: true, excludeFromDashboard: false };
    }

    this.accountTypes$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.accountTypes = data;
      });

    this.form = this.formBuilder.group({
      name: [this.account.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      accountType: [this.isWeb ? this.account.accountTypeId : this.account.accountTypeLocalId,
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      creditLimit: [this.account.creditLimit, [Validators.min(0)]],
      includeInBalance: [this.account.includeInBalance, [Validators.required]],
      initialBalance: [this.account.initialBalance, [Validators.min(0)]],
      interestRate: [this.account.interestRate, [Validators.min(0)]],
      minimumBalance: [this.account.minimumBalance, [Validators.min(0)]],
      paymentDate: [this.account.paymentDate, [Validators.max(31)]],
      excludeFromDashboard: [this.account.excludeFromDashboard],
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
    if (this.isWeb) {
      model.accountTypeId = this.form.controls.accountType.value;
    } else {
      model.accountTypeLocalId = this.form.controls.accountType.value;
      model.accountTypeId = this.getaccountTypeLocalId(model.accountTypeLocalId);
    }
    model.includeInBalance = this.form.controls.includeInBalance.value;
    model.initialBalance = this.getNumberValue(this.form.controls.initialBalance.value);
    model.minimumBalance = this.getNumberValue(this.form.controls.minimumBalance.value);
    model.creditLimit = this.getNumberValue(this.form.controls.creditLimit.value);
    model.interestRate = this.getNumberValue(this.form.controls.interestRate.value);
    model.paymentDate = this.form.controls.paymentDate.value;
    model.excludeFromDashboard = this.form.controls.excludeFromDashboard.value;
    model.notes = this.form.controls.notes.value;
    if (typeof (model.includeInBalance) === 'string') {
      model.includeInBalance = model.includeInBalance === 'true';
    }
    if (typeof (model.excludeFromDashboard) === 'string') {
      model.excludeFromDashboard = model.excludeFromDashboard === 'true';
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
    const type = this.accountTypes.find(c => this.isWeb ? c.id === value : c.local_id === value);
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
