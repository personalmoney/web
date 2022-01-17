import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account';
import { SqLiteService } from 'src/app/core/services/sq-lite.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { AccountTypeService } from 'src/app/entities/account-type/service/account-type.service';
import { SyncService } from 'src/app/core/services/sync.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends SyncService<Account> {

  endpoint = 'accounts';
  tableName = 'Account';

  constructor(
    http: HttpClient,
    protected shared: SharedService,
    private accountType: AccountTypeService,
    authService: AuthService,
    notification: NotificationService,
    sqlite: SqLiteService
  ) {
    super(http, shared, authService, notification, sqlite);
  }

  async getAll(): Promise<Account[]> {
    if (this.shared.isWeb) {
      const response = await this.authService.supabase.from('accounts_view').select('*');
      return response.data;
    }
    else {
      return await super.getAll();
    }
  }

  async update(record: Account): Promise<Account> {
    delete record.balance;
    return await super.update(record);
  }

  async createLocalParms(record: Account): Promise<Account> {
    const data = await this.checkaccountTypeLocalId(record);
    record.account_type_local_id = data;
    const query = `INSERT INTO ${this.tableName}(id,createdTime,updatedTime,isDeleted,localUpdatedTime,name,accountTypeLocalId,
          initialBalance,minimumBalance,creditLimit,paymentDate,interestRate,includeInBalance,excludeFromDashboard,notes,balance)
          Values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [record.id, new Date(), record.updated_time, false, record.local_updated_time, record.name, record.account_type_local_id,
    record.initial_balance, record.minimum_balance, record.credit_limit, record.payment_date, record.interest_rate, record.include_in_balance,
    record.exclude_from_dashboard, record.notes, record.balance];
    return super.createLocal(record, query, values);
  }

  async updateLocalParms(record: Account) {
    const data = await this.checkaccountTypeLocalId(record);
    record.account_type_local_id = data;
    const query = `UPDATE ${this.tableName} SET updatedTime=?,localUpdatedTime=?,name=?,accountTypeLocalId=?,initialBalance=?,
    minimumBalance=?,creditLimit=?,paymentDate=?,interestRate=?,includeInBalance=?,excludeFromDashboard=?,
    notes=?,balance=? WHERE localId=?`;
    const values = [record.updated_time, record.local_updated_time, record.name, record.account_type_local_id, record.initial_balance,
    record.minimum_balance, record.credit_limit, record.payment_date, record.interest_rate, record.include_in_balance,
    record.exclude_from_dashboard, record.notes, record.balance, record.local_id];
    return await super.updateLocal(record, query, values);
  }

  async checkaccountTypeLocalId(record: Account): Promise<number> {
    if (record.account_type_local_id) {
      return record.account_type_local_id;
    }
    return await this.accountType.getLocalId(record.account_type_id);
  }
}
