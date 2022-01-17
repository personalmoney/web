import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';
import { NotificationOptions, NotificationType } from '../models/notification-options';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  errors: [{ key, value }];

  constructor(private toastController: ToastController, private http: HttpClient) { }

  async showInfoMessage(message: string, duration = 3000) {
    await this.showNotification({
      message,
      duration,
      notificationType: NotificationType.Info
    });
  }

  async showWarningMessage(message: string, duration = 3000) {
    await this.showNotification({
      message,
      duration,
      notificationType: NotificationType.Warning
    });
  }

  async showErrorMessage(message: string, duration = 3000) {
    await this.showNotification({
      message,
      duration,
      notificationType: NotificationType.Error
    });
  }

  async showNotification(params: NotificationOptions) {

    let icon = 'information-circle';
    let color = 'success';
    switch (params.notificationType) {
      case NotificationType.Warning:
        icon = 'warning-outline';
        color = 'warning';
        break;

      case NotificationType.Error:
        icon = 'close-circle-outline';
        color = 'danger';
        break;
    }

    await this.transformMessage(params);

    const options: ToastOptions = {
      message: params.message,
      duration: params.duration,
      icon: icon,
      color: color,
      position: params.position
    };
    const toast = await this.toastController.create(options);
    await toast.present();
  }

  private async transformMessage(params: NotificationOptions) {
    if (!this.errors) {
      try {
        this.errors = await this.http.get<[{ key, value }]>("assets/errors.json").toPromise();
      } catch (error) {
        return;
      }
    }
    let msg = this.errors.find(c => c.key == params.message);
    if (msg) {
      params.message = msg.value;
    }
    else if (params.notificationType === NotificationType.Error) {
      params.message = 'Unknown error occurred. Please try again after some time';
    }
  }
}
