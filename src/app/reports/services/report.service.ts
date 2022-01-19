import { Injectable } from '@angular/core';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { NotificationService } from 'src/app/core/services/notification.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { PageResponse } from 'src/app/models/page-response';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionView } from 'src/app/transaction/models/transaction-view';
import { TransactionFilter } from '../modals/transaction-filter';

@Injectable({
  providedIn: 'root'
})
export class ReportService {


  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private notification: NotificationService,
    private spinner: SpinnerVisibilityService) { }

  async getTransactions(request: TransactionFilter): Promise<PageResponse<TransactionView>> {
    const pageResponse: PageResponse<TransactionView> = {
      totalRecords: 0,
      currentPage: request.currentPage,
      pageSize: request.pageSize,
      records: []
    };
    if (this.sharedService.isWeb) {
      this.spinner.show();

      let query = this.prepareQueryWithFilters(request);
      const { data, count, error } = await query;

      if (error) {
        this.spinner.hide();
        this.notification.showErrorMessage(error.message);
        throw error;
      }
      pageResponse.records = data;
      pageResponse.totalRecords = count;

      this.spinner.hide();
    }
    return pageResponse;
  }

  private prepareQueryWithFilters(request: TransactionFilter) {
    const startIndex = (request.currentPage - 1) * request.pageSize;
    const endIndex = startIndex + request.pageSize;

    let query = this.authService.supabase
      .from('transactions_view')
      .select('*', { count: "exact" })
      .order('trans_date', { ascending: false })
      .range(startIndex, endIndex);

    if (request.accountIds && request.accountIds.length > 0) {
      query = query.in('account_id', request.accountIds);
    }
    if (request.transactionTypes && request.transactionTypes.length > 0) {
      query = query.in('trans_type', request.transactionTypes);
    }
    if (request.fromDate) {
      query = query.gte('trans_date', request.fromDate);
    }
    if (request.toDate) {
      query = query.lte('trans_date', request.toDate);
    }
    if (request.fromAmount) {
      query = query.gte('amount', request.fromAmount);
    }
    if (request.toAmount) {
      query = query.lte('amount', request.toAmount);
    }
    if (request.payeeIds && request.payeeIds.length > 0) {
      query = query.in('payee_id', request.payeeIds);
    }
    if (request.subCategoryIds && request.subCategoryIds.length > 0) {
      query = query.in('sub_category_id', request.subCategoryIds);
    }
    if (request.notes) {
      query = query.like('notes', request.notes + '%');
    }
    return query;
  }
}
