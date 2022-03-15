import { Injectable } from '@angular/core';
import { Tag } from '../models/tag';
import { SyncService } from 'src/app/core/services/sync.service';
import { HttpClient } from '@angular/common/http';
import { SqLiteService } from 'src/app/core/services/sq-lite.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class TagService extends SyncService<Tag> {
  endpoint = 'tags';
  tableName = 'Tag';

  constructor(
    http: HttpClient,
    protected shared: SharedService,
    authService: AuthService,
    notification: NotificationService,
    sqlite: SqLiteService
  ) {
    super(http, shared, authService, notification, sqlite);
  }

  async createLocalParms(record: Tag): Promise<Tag> {
    const query = `INSERT INTO ${this.tableName}(name,id,createdTime,updatedTime,isDeleted,localUpdatedTime) Values(?,?,?,?,?,?)`;
    const values = [record.name, record.id, new Date(), record.updated_time, false, record.local_updated_time];
    return await super.createLocal(record, query, values);
  }

  async updateLocalParms(record: Tag) {
    const query = `UPDATE ${this.tableName} SET name=?,updatedTime=?,localUpdatedTime=? WHERE localId=?`;
    const values = [record.name, record.updated_time, record.local_updated_time, record.local_id];
    return await super.updateLocal(record, query, values);
  }
}
