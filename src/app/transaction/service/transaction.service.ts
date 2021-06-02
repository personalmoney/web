import { Injectable } from '@angular/core';
import { SyncService } from 'src/app/core/services/sync.service';
import { Transaction } from '../models/transaction';
import { Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SqLiteService } from 'src/app/core/services/sq-lite.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { TransactionSearch } from '../models/transaction-Search';
import { TransactionView } from '../models/transaction-view';
import { map } from 'rxjs/operators';
import { PageResponse } from 'src/app/models/page-response';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends SyncService<Transaction> {

  endpoint = 'transactions';
  tableName = 'Transaction';

  constructor(
    http: HttpClient,
    sharedService: SharedService,
    authService: AuthService,
    sqlite: SqLiteService
  ) {
    super(http, sharedService, authService, sqlite);
  }

  getTransactions(request: TransactionSearch): Observable<PageResponse<TransactionView>> {
    if (this.isweb) {

      const pageResponse: PageResponse<TransactionView> = {
        totalRecords: 0,
        currentPage: request.currentPage,
        pageSize: request.pageSize,
        records: []
      };

      const startIndex = (request.currentPage - 1) * request.pageSize;
      const accountId: number = request.account_id;

      const query = this.authService.supabase
        .rpc('function_transactions_details', {
          from_account_id: request.account_id,
          start_index: startIndex,
          page_size: request.pageSize
        });

      return from(query)
        .pipe(map(response => {
          pageResponse.records = response.data;
          return pageResponse;
        }));
    }
    const query = this.getLocalParams();
    return from(this.sqlite.query(query))
      .pipe(map(result => {
        return result.values as PageResponse<TransactionView>;
      }));
  }

  create(record: Transaction): Observable<Transaction> {
    if (this.isweb) {
      return this.createOrUpdateRecord(record);
    }
    else {
      return super.create(record);
    }
  }

  update(record: Transaction): Observable<Transaction> {
    if (this.isweb) {
      return this.createOrUpdateRecord(record);
    }
    else {
      return super.update(record);
    }
  }

  createOrUpdateRecord(record: Transaction): Observable<Transaction> {
    record.created_time = record.updated_time = new Date();
    if (record.id) {
      delete record.created_time;
    }
    record.user_id = this.currentUserId;
    return from(this.authService.supabase.rpc("save_transactions", { record: record }))
      .pipe(map(response => response.data[0]));
  }

  createLocalParms(record: Transaction): Observable<Transaction> {
    throw new Error('Method not implemented.');
  }
  updateLocalParms(record: Transaction): Observable<Transaction> {
    throw new Error('Method not implemented.');
  }

}
