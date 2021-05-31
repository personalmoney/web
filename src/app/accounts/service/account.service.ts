import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account';
import { SqLiteService } from 'src/app/core/services/sq-lite.service';
import { Observable, from, of } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { AccountTypeService } from 'src/app/entities/account-type/service/account-type.service';
import { SyncService } from 'src/app/core/services/sync.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends SyncService<Account> {

  endpoint = 'Account';
  tableName = 'Account';

  constructor(
    http: HttpClient,
    protected shared: SharedService,
    private accountType: AccountTypeService,
    authService: AuthService,
    sqlite: SqLiteService
  ) {
    super(http, shared, authService, sqlite);
  }

  createLocalParms(record: Account): Observable<Account> {
    return this.checkaccountTypeLocalId(record)
      .pipe(switchMap((data) => {
        record.accountTypeLocalId = data;
        const query = `INSERT INTO ${this.tableName}(id,createdTime,updatedTime,isDeleted,localUpdatedTime,name,accountTypeLocalId,
          initialBalance,minimumBalance,creditLimit,paymentDate,interestRate,includeInBalance,excludeFromDashboard,notes,balance)
          Values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const values = [record.id, new Date(), record.updated_time, false, record.local_updated_time, record.name, record.accountTypeLocalId,
        record.initialBalance, record.minimumBalance, record.creditLimit, record.paymentDate, record.interestRate, record.includeInBalance,
        record.excludeFromDashboard, record.notes, record.balance];
        return super.createLocal(record, query, values);
      }));
  }

  updateLocalParms(record: Account) {
    return this.checkaccountTypeLocalId(record)
      .pipe(switchMap((data) => {
        record.accountTypeLocalId = data;
        const query = `UPDATE ${this.tableName} SET updatedTime=?,localUpdatedTime=?,name=?,accountTypeLocalId=?,initialBalance=?,
    minimumBalance=?,creditLimit=?,paymentDate=?,interestRate=?,includeInBalance=?,excludeFromDashboard=?,
    notes=?,balance=? WHERE localId=?`;
        const values = [record.updated_time, record.local_updated_time, record.name, record.accountTypeLocalId, record.initialBalance,
        record.minimumBalance, record.creditLimit, record.paymentDate, record.interestRate, record.includeInBalance,
        record.excludeFromDashboard, record.notes, record.balance, record.local_id];
        return super.updateLocal(record, query, values);
      }));
  }

  checkaccountTypeLocalId(record: Account): Observable<number> {
    if (record.accountTypeLocalId) {
      return of(record.accountTypeLocalId);
    }
    return from(this.accountType.getLocalId(record.accountTypeId));
  }
}
