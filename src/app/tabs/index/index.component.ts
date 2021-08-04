import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BaseComponent } from 'src/app/core/helpers/base.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent extends BaseComponent implements AfterViewInit {

  @ViewChild('tabBar', { read: ElementRef, static: false })
  private tabBarRef: ElementRef;

  constructor(private platform: Platform) {
    super();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.platform.ready();
    this.height = this.platform.height();
    this.width = this.platform.width();

    this.handleTabs();
  }

  private handleTabs() {
    if (this.width < 992) {
      this.showTabBar();
    }
    else {
      this.hideTabBar();
    }
  }

  hideTabBar(): void {
    const display: string = this.tabBarRef.nativeElement.style.display;
    if (display !== 'none') {
      this.tabBarRef.nativeElement.style.display = 'none';
    }
  }

  showTabBar(): void {
    const display: string =
      this.tabBarRef.nativeElement.style.display;
    if (display !== 'flex') {
      this.tabBarRef.nativeElement.style.display = 'flex';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = +event.target.innerWidth;
    this.handleTabs();
  }

}
