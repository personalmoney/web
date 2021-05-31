import { FormGroup } from '@angular/forms';
import { BaseComponent } from './base.component';
import { HttpErrorResponse } from '@angular/common/http';

export class BaseForm extends BaseComponent {
    isSubmitted = false;
    form: FormGroup;
    errors = [];

    get controls() {
        return this.form.controls;
    }

    handleErrors(response: HttpErrorResponse) {
        this.errors = [];
        if (response.status === 400) {
            const data = response.error.errors;

            Object.keys(data).map(c => {
                const control = this.form.get(c.toLowerCase());
                if (control) {
                    control.setErrors({ remoteError: data[c] });
                }
                else {
                    this.errors.push({
                        name: c,
                        error: data[c]
                    });
                }
            });
        }
    }
}
