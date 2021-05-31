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

  endpoint = 'Transaction';
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
      const qs = Object.keys(request)
        .map(key => `${key}=${request[key]}`)
        .join('&');
      return this.http.get<PageResponse<TransactionView>>(`${this.endpoint}?${qs}`);
    }
    const query = this.getLocalParams();
    return from(this.sqlite.query(query))
      .pipe(map(result => {
        return result.values as PageResponse<TransactionView>;
      }));
  }

  createLocalParms(record: Transaction): Observable<Transaction> {
    throw new Error('Method not implemented.');
  }
  updateLocalParms(record: Transaction): Observable<Transaction> {
    throw new Error('Method not implemented.');
  }

}
