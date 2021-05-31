import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetAccounts } from 'src/app/accounts/store/actions';
import { GetAccountTypes } from 'src/app/entities/account-type/store/actions';
import { GetCategories } from 'src/app/entities/categories/store/actions';
import { GetPayees } from 'src/app/entities/payees/store/actions';
import { GetTags } from 'src/app/entities/tags/store/actions';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  isAccountTypesLoaded = false;
  isPayeesLoaded = false;
  isTagsLoaded = false;
  isCategoryLoaded = false;
  isAccountsLoaded = false;

  constructor(private store: Store) { }

  public getAccountTypes(forceRefresh = false) {
    if (!forceRefresh && this.isAccountTypesLoaded) {
      return;
    }
    this.store.dispatch(new GetAccountTypes());
    this.isAccountTypesLoaded = true;
  }

  public getPayees(forceRefresh = false) {
    if (!forceRefresh && this.isPayeesLoaded) {
      return;
    }
    this.store.dispatch(new GetPayees());
    this.isPayeesLoaded = true;
  }

  public getTags(forceRefresh = false) {
    if (!forceRefresh && this.isTagsLoaded) {
      return;
    }
    this.store.dispatch(new GetTags());
    this.isTagsLoaded = true;
  }

  public getCategories(forceRefresh = false) {
    if (!forceRefresh && this.isCategoryLoaded) {
      return;
    }
    this.store.dispatch(new GetCategories());
    this.isCategoryLoaded = true;
  }

  public getAccounts(forceRefresh = false) {
    if (!forceRefresh && this.isAccountsLoaded) {
      return;
    }
    this.store.dispatch(new GetAccounts());
    this.isAccountsLoaded = true;
  }
}
