import { HttpClient } from '@angular/common/http';
import { SqLiteService } from './sq-lite.service';
import { Utils } from '../helpers/utils';
import { TimeModel } from 'src/app/models/time-model';
import { SharedService } from './shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from './notification.service';

export abstract class CrudService<T extends TimeModel> {
  abstract endpoint;
  abstract tableName;
  currentUserId = '';

  constructor(
    protected http: HttpClient,
    protected shared: SharedService,
    protected authService: AuthService,
    protected notification: NotificationService,
    protected sqlite: SqLiteService
  ) {
    authService.currentUser.subscribe(d => {
      if (d) {
        this.currentUserId = d.id;
      }
    });
  }

  abstract createLocalParms(record: T): Promise<T>;
  abstract updateLocalParms(record: T): Promise<T>;

  getLocalParams(): string {
    return `SELECT * FROM ${this.tableName} WHERE isDeleted='${this.shared.falseValue}'`;
  }

  async getAll(forceRefresh = false, queryString: string = '*'): Promise<T[]> {
    if (this.shared.isWeb || forceRefresh) {
      const response = await this.authService.supabase.from(this.endpoint).select(queryString);
      return response.data;
    }
    const query = this.getLocalParams();
    const result = await this.sqlite.query(query);
    return result.values as T[];
  }

  async getModifiedData(syncTime: Date): Promise<T[]> {
    const response = await this.authService.supabase.from(this.endpoint).select('*').gte("updatedTime", syncTime.toISOString());
    return response.data;
  }

  async get(id: string): Promise<T> {
    const response = await this.authService.supabase.from(this.endpoint).select('*').match({ id });
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  }

  async create(record: T): Promise<T> {
    if (this.shared.isWeb) {
      return await this.createRequest(record);
    }
    else if (this.shared.isOnline) {
      const data = await this.createRequest(record);
      record.id = data.id;
      record.updated_time = record.local_updated_time = data.updated_time;
      return await this.createLocalParms(record);
    }
    else {
      record.local_updated_time = Utils.getTime();
      return await this.createLocalParms(record);
    }
  }

  private async createRequest(record: T): Promise<T> {
    record.created_time = record.updated_time = new Date();
    record.user_id = this.currentUserId;
    const { data, error } = await this.authService.supabase.from(this.endpoint).insert(record);
    if (data && data.length > 0) {
      this.notification.showInfoMessage('Record created successfully');
      return data[0];
    }
    if (error) {
      this.notification.showErrorMessage(error.message);
    }
    throw error;
  }

  protected async createLocal(record: T, query: string, values: any[]) {
    const data = await this.sqlite.run(query, values);
    record.local_id = data.changes.lastId;
    return record;
  }

  async update(record: T): Promise<T> {
    if (this.shared.isWeb) {
      return await this.updateRequest(record);
    }
    else if (this.shared.isOnline && record.id) {
      const data = await this.updateRequest(record);
      record.updated_time = record.local_updated_time = data.updated_time;
      return await this.updateLocalParms(record);
    }
    else {
      record.local_updated_time = Utils.getTime();
      return await this.updateLocalParms(record);
    }
  }

  private async updateRequest(record: T): Promise<T> {
    delete record.created_time;
    record.updated_time = new Date();
    const id = record.id.toString();

    const { data, error } = await this.authService.supabase.from(this.endpoint).update(record).match({ id });
    if (data && data.length > 0) {
      this.notification.showInfoMessage('Record updated successfully');
      return data[0];
    }
    if (error) {
      this.notification.showErrorMessage(error.message);
    }
    throw error;
  }

  protected async updateLocal(record: T, query: string, values: any[]) {
    const data = await this.sqlite.run(query, values);
    if (data.changes.changes > 0) {
      return record;
    }
    return null;
  }

  async delete(record: T) {
    if (this.shared.isWeb) {
      return await this.deleteRequest(record);
    }
    else if (this.shared.isOnline && record.id) {
      await this.deleteRequest(record);
      return await this.deleteInLocal(record);
    }
    else if (record.id) {
      record.local_updated_time = Utils.getTime();
      const query = `UPDATE ${this.tableName} SET isDeleted=?,localUpdatedTime=? WHERE localId=?`;
      const values = [true, record.local_updated_time, record.local_id];
      return await this.updateLocal(record, query, values);
    }
    else {
      return await this.deleteInLocal(record);
    }
  }

  protected async deleteRequest(record: T) {
    const value = record.id.toString();
    const { data, error } = await this.authService.supabase.from(this.endpoint).delete().match({ id: value });
    if (error) {
      this.notification.showErrorMessage(error.message);
      throw error;
    }
    this.notification.showInfoMessage('Record deleted successfully');
    return null;
  }

  protected async deleteInLocal(record: T) {
    const query = `DELETE FROM ${this.tableName} WHERE localId=?`;
    const values = [record.local_id];
    return await this.updateLocal(record, query, values);
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
