import { Component, OnInit, Input } from '@angular/core';
import { SubCategory } from '../models/sub-category';
import { BaseForm } from 'src/app/core/helpers/base-form';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AddSubCategory, UpdateSubCategory } from '../store/actions';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss'],
})
export class SubCategoryComponent extends BaseForm implements OnInit {

  @Input()
  categoryId: number;

  @Input()
  localCategoryId: number;

  @Input()
  subCategory: SubCategory;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private modal: ModalController,
  ) {
    super();
  }

  ngOnInit() {
    if (this.subCategory) {
      this.form = this.formBuilder.group({
        name: [this.subCategory.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
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
    const model = { ...this.subCategory };
    model.category_id = this.categoryId;
    model.local_category_id = this.localCategoryId;
    model.name = this.form.controls.name.value;

    let obserable: Observable<SubCategory>;
    if (!model.id && !model.local_id) {
      obserable = this.store.dispatch(new AddSubCategory(model));
    }
    else {
      obserable = this.store.dispatch(new UpdateSubCategory(model));
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
