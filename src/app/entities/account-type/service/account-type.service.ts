import { Injectable } from '@angular/core';
import { AccountType } from '../models/account-type';
import { HttpClient } from '@angular/common/http';
import { SqLiteService } from 'src/app/core/services/sq-lite.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SyncService } from 'src/app/core/services/sync.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AccountTypeService extends SyncService<AccountType> {

  endpoint = 'account_types';
  tableName = 'AccountType';

  constructor(
    http: HttpClient,
    protected shared: SharedService,
    authService: AuthService,
    notification: NotificationService,
    sqlite: SqLiteService
  ) {
    super(http, shared, authService, notification, sqlite);
  }

  async createLocalParms(record: AccountType): Promise<AccountType> {
    const query = `INSERT INTO ${this.tableName}(name,id,icon,createdTime,updatedTime,isDeleted,localUpdatedTime) Values(?,?,?,?,?,?,?)`;
    const values = [record.name, record.id, record.icon, new Date(), record.updated_time, false, record.local_updated_time];
    return await super.createLocal(record, query, values);
  }

  async updateLocalParms(record: AccountType) {
    const query = `UPDATE ${this.tableName} SET name=?,icon=?,updatedTime=?,localUpdatedTime=? WHERE localId=?`;
    const values = [record.name, record.icon, record.updated_time, record.local_updated_time, record.local_id];
    return await super.updateLocal(record, query, values);
  }
}
