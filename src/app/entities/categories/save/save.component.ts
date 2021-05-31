import { Component, OnInit, Input } from '@angular/core';
import { BaseForm } from 'src/app/core/helpers/base-form';
import { Category } from '../models/category';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AddCategory, UpdateCategory } from '../store/actions';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent extends BaseForm implements OnInit {

  @Input()
  category: Category;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private modal: ModalController,
  ) {
    super();
  }

  ngOnInit() {
    if (this.category) {
      this.form = this.formBuilder.group({
        name: [this.category.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
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
    const model = { ...this.category };
    model.name = this.form.controls.name.value;

    let obserable: Observable<Category>;
    if (!model.id && !model.local_id) {
      obserable = this.store.dispatch(new AddCategory(model));
    }
    else {
      obserable = this.store.dispatch(new UpdateCategory(model));
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
