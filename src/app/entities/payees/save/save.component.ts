import { Component, OnInit, Input } from '@angular/core';
import { Payee } from '../models/payee';
import { BaseForm } from 'src/app/core/helpers/base-form';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { UpdatePayee, AddPayee } from '../store/actions';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent extends BaseForm implements OnInit {

  @Input()
  payee: Payee;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private modal: ModalController,
  ) {
    super();
  }

  ngOnInit() {
    if (this.payee) {
      this.form = this.formBuilder.group({
        name: [this.payee.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
      });
    }
    else {
      this.form = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
      });
    }
  }

  save() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      return;
    }
    const model = { ...this.payee };
    model.name = this.form.controls.name.value;

    let obserable: Observable<Payee>;
    if (!model.id && !model.local_id) {
      obserable = this.store.dispatch(new AddPayee(model));
    }
    else {
      obserable = this.store.dispatch(new UpdatePayee(model));
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

}
