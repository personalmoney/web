import { OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-base',
  template: ''
})
export class BaseComponent implements OnDestroy {

  ngUnsubscribe = new Subject<void>();
  height = 500;
  width = 500;

  constructor() { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
