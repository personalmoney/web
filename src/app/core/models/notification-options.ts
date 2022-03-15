export class NotificationOptions {
    message: string;
    duration?: number = 3000;
    notificationType?: NotificationType;
    position?: 'top' | 'bottom' | 'middle' = "bottom";
}

export enum NotificationType {
    Info,
    Warning,
    Error
}