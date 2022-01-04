import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseForm } from 'src/app/core/helpers/base-form';
import { AccountType } from '../models/account-type';
import { ModalController } from '@ionic/angular';
import { Icon } from 'src/app/core/models/font-awesome-library';
import { AssetsService } from 'src/app/core/services/assets.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AddAccountType, UpdateAccountType } from '../store/actions';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent extends BaseForm implements OnInit {

  icons: Icon[] = [];
  filteredIcons: Icon[] = [];
  currentIndex = 0;
  @Input()
  accountType: AccountType;

  constructor(
    public formBuilder: FormBuilder,
    private modal: ModalController,
    private assets: AssetsService,
    private store: Store
  ) {
    super();
  }

  ngOnInit() {
    if (this.accountType) {
      const iconString = this.accountType.icon.split('#');
      const icon: Icon = {
        name: iconString[1],
        prefix: iconString[0]
      };
      this.form = this.formBuilder.group({
        name: [this.accountType.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        icon: [icon, [Validators.required]]
      });
    }
    else {
      this.form = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        icon: ['', [Validators.required]]
      });
    }

    this.assets.getFontAwesomeIcons()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        c.icons.fas.map(icon => this.icons.push({ prefix: 'fas', name: icon }));
        c.icons.far.map(icon => this.icons.push({ prefix: 'far', name: icon }));
        c.icons.fab.map(icon => this.icons.push({ prefix: 'fab', name: icon }));
      });
  }

  create() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      return;
    }

    const model = { ...this.accountType };
    const icon = this.form.controls.icon.value;
    model.name = this.form.controls.name.value;
    model.icon = icon.prefix + '#' + icon.name;

    let obserable: Observable<AccountType>;
    if (!model.id && !model.local_id) {
      obserable = this.store.dispatch(new AddAccountType(model));
    }
    else {
      obserable = this.store.dispatch(new UpdateAccountType(model));
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

  searchIcons($event) {
    this.filteredIcons = [];
    this.currentIndex = 0;
    this.getMoreIcons($event);
  }

  getMoreIcons(event: {
    component: IonicSelectableComponent,
    text: string
  }) {

    const text = (event.text || '').trim().toLowerCase();
    if (this.currentIndex === this.icons.length) {
      event.component.disableInfiniteScroll();
      return;
    }
    const startIndex = this.currentIndex;
    let endIndex = startIndex + 20;
    if (endIndex > this.icons.length) {
      endIndex = this.icons.length;
    }

    this.icons.filter(c => c.name.toLowerCase().includes(text))
      .slice(startIndex, endIndex)
      .map(c => this.filteredIcons.push(c));

    event.component.items = this.filteredIcons;
    if (event) {
      event.component.endInfiniteScroll();
    }
    this.currentIndex = endIndex;
  }

  close(isSuccess: boolean = false) {
    this.modal.dismiss(isSuccess, 'click');
  }
}
