import { Component, OnInit, Input } from '@angular/core';
import { BaseForm } from 'src/app/core/helpers/base-form';
import { Tag } from '../models/tag';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AddTag, UpdateTag } from '../store/actions';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent extends BaseForm implements OnInit {

  @Input()
  tag: Tag;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private modal: ModalController,
  ) {
    super();
  }

  ngOnInit() {
    if (this.tag) {
      this.form = this.formBuilder.group({
        name: [this.tag.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
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
    const model = { ...this.tag };
    model.name = this.form.controls.name.value;

    let obserable: Observable<Tag>;
    if (!model.id && !model.local_id) {
      obserable = this.store.dispatch(new AddTag(model));
    }
    else {
      obserable = this.store.dispatch(new UpdateTag(model));
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
