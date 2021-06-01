import { Observable, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SqLiteService } from './sq-lite.service';
import { map, switchMap } from 'rxjs/operators';
import { Utils } from '../helpers/utils';
import { TimeModel } from 'src/app/models/time-model';
import { SharedService } from './shared.service';
import { AuthService } from 'src/app/services/auth.service';

export abstract class CrudService<T extends TimeModel> {
  abstract endpoint = '';
  abstract tableName = '';
  isweb;
  currentUserId = '';

  constructor(
    protected http: HttpClient,
    protected shared: SharedService,
    protected authService: AuthService,
    protected sqlite: SqLiteService
  ) {
    shared.isWeb.subscribe(data => {
      this.isweb = data;
    });
    authService.currentUser.subscribe(d => {
      if (d) {
        this.currentUserId = d.id;
      }
    });
  }

  abstract createLocalParms(record: T): Observable<T>;
  abstract updateLocalParms(record: T): Observable<T>;

  getLocalParams(): string {
    return `SELECT * FROM ${this.tableName} WHERE isDeleted='${this.shared.falseValue}'`;
  }

  getAll(forceRefresh = false, queryString: string = '*'): Observable<T[]> {
    if (this.isweb || forceRefresh) {
      return from(this.authService.supabase.from(this.endpoint).select(queryString))
        .pipe(map(response => response.data));
    }
    const query = this.getLocalParams();
    return from(this.sqlite.query(query))
      .pipe(map(result => {
        return result.values as T[];
      }));
  }

  getModifiedData(syncTime: Date): Observable<T[]> {
    return from(this.authService.supabase.from(this.endpoint).select('*').gte("updatedTime", syncTime.toISOString()))
      .pipe(map(response => response.data));
  }

  get(id: string): Observable<T> {
    return from(this.authService.supabase.from(this.endpoint).select('*').match({ id }))
      .pipe(map(response => response.data[0]));
  }

  create(record: T): Observable<T> {
    if (this.isweb) {
      return this.createRequest(record);
    }
    else if (this.shared.isOnline) {
      return this.createRequest(record)
        .pipe(switchMap(data => {
          record.id = data.id;
          record.updated_time = record.local_updated_time = data.updated_time;
          return this.createLocalParms(record);
        }));
    }
    else {
      record.local_updated_time = Utils.getTime();
      return this.createLocalParms(record);
    }
  }

  private createRequest(record: T): Observable<T> {
    delete record.is_deleted;
    record.created_time = record.updated_time = new Date();
    record.user_id = this.currentUserId;
    return from(this.authService.supabase.from(this.endpoint).insert(record))
      .pipe(map(response => response.data[0]));
  }

  protected createLocal(record: T, query: string, values: any[]) {
    return from(
      this.sqlite.run(query, values))
      .pipe(map(data => {
        record.local_id = data.changes.lastId;
        return record;
      }));
  }

  update(record: T): Observable<T> {
    if (this.isweb) {
      return this.updateRequest(record);
    }
    else if (this.shared.isOnline && record.id) {
      return this.updateRequest(record)
        .pipe(switchMap(data => {
          record.updated_time = record.local_updated_time = data.updated_time;
          return this.updateLocalParms(record);
        }));
    }
    else {
      record.local_updated_time = Utils.getTime();
      return this.updateLocalParms(record);
    }
  }

  private updateRequest(record: T): Observable<T> {
    delete record.is_deleted;
    delete record.created_time;
    record.updated_time = new Date();
    const id = record.id.toString();

    return from(this.authService.supabase.from(this.endpoint).update(record).match({ id }))
      .pipe(map(response => response.data[0]));
  }

  protected updateLocal(record: T, query: string, values: any[]) {
    return from(
      this.sqlite.run(query, values))
      .pipe(map(data => {
        if (data.changes.changes > 0) {
          return record;
        }
        return null;
      }));
  }

  delete(record: T) {
    if (this.isweb) {
      return this.deleteRequest(record);
    }
    else if (this.shared.isOnline && record.id) {
      return this.deleteRequest(record)
        .pipe(switchMap(() => {
          return this.deleteInLocal(record);
        }));
    }
    else if (record.id) {
      record.local_updated_time = Utils.getTime();
      const query = `UPDATE ${this.tableName} SET isDeleted=?,localUpdatedTime=? WHERE localId=?`;
      const values = [true, record.local_updated_time, record.local_id];
      return this.updateLocal(record, query, values);
    }
    else {
      return this.deleteInLocal(record);
    }
  }

  protected deleteRequest(record: T) {
    const value = record.id.toString();
    return from(this.authService.supabase.from(this.endpoint).delete().match({ value }))
      .pipe(map(() => null));
  }

  protected deleteInLocal(record: T) {
    const query = `DELETE FROM ${this.tableName} WHERE localId=?`;
    const values = [record.local_id];
    return this.updateLocal(record, query, values);
  }

  async getLocalId(remoteId: number): Promise<number> {
    const query = `SELECT localId from ${this.tableName} WHERE id=?`;
    const values = [remoteId.toString()];
    const result = await this.sqlite.query(query, values);
    if (result.values.length > 0) {
      return result.values[0].localId;
    }
    else {
      return 0;
    }
  }
}
