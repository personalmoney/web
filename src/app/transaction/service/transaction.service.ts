import { Injectable } from '@angular/core';
import { SyncService } from 'src/app/core/services/sync.service';
import { Transaction } from '../models/transaction';
import { HttpClient } from '@angular/common/http';
import { SqLiteService } from 'src/app/core/services/sq-lite.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { TransactionSearch } from '../models/transaction-Search';
import { TransactionView } from '../models/transaction-view';
import { PageResponse } from 'src/app/models/page-response';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { NotificationService } from 'src/app/core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends SyncService<Transaction> {

  endpoint = 'transactions';
  tableName = 'Transaction';

  constructor(
    http: HttpClient,
    private sharedService: SharedService,
    authService: AuthService,
    private spinner: SpinnerVisibilityService,
    notification: NotificationService,
    sqlite: SqLiteService
  ) {
    super(http, sharedService, authService, notification, sqlite);
  }

  async getTransactions(request: TransactionSearch): Promise<PageResponse<TransactionView>> {
    if (this.sharedService.isWeb) {

      this.spinner.show();
      const pageResponse: PageResponse<TransactionView> = {
        totalRecords: 0,
        currentPage: request.currentPage,
        pageSize: request.pageSize,
        records: []
      };

      const startIndex = (request.currentPage - 1) * request.pageSize;

      const { data, error } = await this.authService.supabase
        .rpc('function_transactions_details', {
          from_account_id: request.account_id,
          start_index: startIndex,
          page_size: request.pageSize
        });

      pageResponse.records = data;
      if (data && data.length > 0) {
        pageResponse.totalRecords = data[0].total_records;
      }
      this.spinner.hide();
      return pageResponse;
    }
    const query = this.getLocalParams();
    this.spinner.hide();
    return await this.sqlite.query(query) as PageResponse<TransactionView>;
  }

  async getCategories(id: number) {
    const { data, error } = await this.authService.supabase.rpc('function_get_payee_categories',
      { source_payee_id: id });
    if (data) {
      return data.map(c => c.sub_category_id);
    }
    else {
      return [];
    }
  }

  async create(record: Transaction): Promise<Transaction> {
    if (this.sharedService.isWeb) {
      return await this.createOrUpdateRecord(record);
    }
    else {
      return await super.create(record);
    }
  }

  async update(record: Transaction): Promise<Transaction> {
    if (this.sharedService.isWeb) {
      return await this.createOrUpdateRecord(record);
    }
    else {
      return await super.update(record);
    }
  }

  async createOrUpdateRecord(record: Transaction): Promise<Transaction> {
    record.created_time = record.updated_time = new Date();
    if (record.id) {
      delete record.created_time;
    }
    record.user_id = this.currentUserId;
    const { data, error } = await this.authService.supabase.rpc("save_transactions", { record: record });
    if (error) {
      this.notification.showErrorMessage(error.message);
      throw error;
    }
    if (data && data.length > 0) {
      if (record.id) {
        this.notification.showInfoMessage('Record updated successfully');
      }
      else {
        this.notification.showInfoMessage('Record created successfully');
      }
      return data[0];
    }
    this.notification.showErrorMessage('Unknown error occurred. Please try again.');
    return null;
  }

  createLocalParms(record: Transaction): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
  updateLocalParms(record: Transaction): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

}
