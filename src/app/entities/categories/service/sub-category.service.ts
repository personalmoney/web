import { Injectable } from '@angular/core';
import { SubCategory } from '../models/sub-category';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { SqLiteService } from 'src/app/core/services/sq-lite.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SyncService } from 'src/app/core/services/sync.service';
import { CategoryService } from './category.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService extends SyncService<SubCategory> {

  endpoint = 'sub_categories';
  tableName = 'SubCategory';

  constructor(
    http: HttpClient,
    protected shared: SharedService,
    private categoryService: CategoryService,
    authService: AuthService,
    notification: NotificationService,
    sqlite: SqLiteService
  ) {
    super(http, shared, authService, notification, sqlite);
  }

  async getRecords(categoryId: number): Promise<SubCategory[]> {
    return await this.getAll();
  }

  async getRecord(categoryId: number, id: string): Promise<SubCategory> {
    return await super.get(id);
  }

  async create(record: SubCategory): Promise<SubCategory> {
    return await super.create(record);
  }

  async update(record: SubCategory): Promise<SubCategory> {
    return await super.update(record);
  }

  async delete(record: SubCategory) {
    return await super.delete(record);
  }

  getLocalParams(): string {
    return `SELECT S.localId,S.localUpdatedTime,S.id,S.name,S.localCategoryId,S.createdTime,S.updatedTime,C.id as categoryId
    FROM SubCategory S
    INNER JOIN Category C ON S.localCategoryId=C.localId WHERE S.isDeleted='${this.shared.falseValue}'`;
  }

  async createLocalParms(record: SubCategory): Promise<SubCategory> {
    const data = await this.checkCategoryId(record);
    record.local_category_id = data;
    const query = `INSERT INTO ${this.tableName}(name,id,localCategoryId,createdTime,updatedTime,isDeleted,localUpdatedTime)
    Values(?,?,?,?,?,?,?)`;
    const values = [record.name, record.id, record.local_category_id, new Date(), record.updated_time, false, record.local_updated_time];
    return await super.createLocal(record, query, values);
  }

  async updateLocalParms(record: SubCategory) {
    const data = await this.checkCategoryId(record);
    record.local_category_id = data;
    const query = `UPDATE ${this.tableName} SET name=?,updatedTime=?,localUpdatedTime=? WHERE localId=?`;
    const values = [record.name, record.updated_time, record.local_updated_time, record.local_id];
    return await super.updateLocal(record, query, values);
  }

  async findByName(record: SubCategory) {
    const selectQuery = `SELECT S.localId,S.localUpdatedTime,S.id,S.name,S.localCategoryId,S.createdTime,S.updatedTime,C.id as categoryId
    FROM SubCategory S
    INNER JOIN Category C ON S.localCategoryId=C.localId WHERE S.name=? and C.id=?`;
    const id = [record.name, record.category_id];
    return await this.excuteQuery(record, selectQuery, id);
  }

  async checkCategoryId(record: SubCategory): Promise<number> {
    if (record.local_category_id) {
      return record.local_category_id;
    }
    return await this.categoryService.getLocalId(record.category_id);
  }
}
