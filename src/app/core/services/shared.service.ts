import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public loadingMap: Map<string, boolean> = new Map<string, boolean>();
  isOnline = false;
  isWeb = true;
  isElectron = new BehaviorSubject(false);
  falseValue: string | number = 'false';
  trueValue: string | number = 'true';

  constructor(public toastController: ToastController) {
    this.isElectron.next(false); //TODO Need to find whether it is running in electron     

    Network.getStatus().then(data => {
      this.isOnline = data.connected;
    });
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
      this.isOnline = status.connected;
    });
  }

  async showToastMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
