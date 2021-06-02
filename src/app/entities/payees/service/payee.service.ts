import { Injectable } from '@angular/core';
import { Payee } from '../models/payee';
import { HttpClient } from '@angular/common/http';
import { SqLiteService } from 'src/app/core/services/sq-lite.service';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { SyncService } from 'src/app/core/services/sync.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PayeeService extends SyncService<Payee> {
  endpoint = 'payees';
  tableName = 'Payee';

  constructor(
    http: HttpClient,
    protected shared: SharedService,
    authService: AuthService,
    sqlite: SqLiteService
  ) {
    super(http, shared, authService, sqlite);
  }

  createLocalParms(record: Payee): Observable<Payee> {
    const query = `INSERT INTO ${this.tableName}(name,id,createdTime,updatedTime,isDeleted,localUpdatedTime) Values(?,?,?,?,?,?)`;
    const values = [record.name, record.id, new Date(), record.updated_time, false, record.local_updated_time];
    return super.createLocal(record, query, values);
  }

  updateLocalParms(record: Payee) {
    const query = `UPDATE ${this.tableName} SET name=?,updatedTime=?,localUpdatedTime=? WHERE localId=?`;
    const values = [record.name, record.updated_time, record.local_updated_time, record.local_id];
    return super.updateLocal(record, query, values);
  }
}
