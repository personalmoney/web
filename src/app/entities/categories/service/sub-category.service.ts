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
    sqlite: SqLiteService
  ) {
    super(http, shared, authService, sqlite);
  }

  getRecords(categoryId: number): Observable<SubCategory[]> {
    return this.getAll();
  }

  getRecord(categoryId: number, id: string): Observable<SubCategory> {
    return super.get(id);
  }

  create(record: SubCategory): Observable<SubCategory> {
    return super.create(record);
  }

  update(record: SubCategory): Observable<SubCategory> {
    return super.update(record);
  }

  delete(record: SubCategory) {
    return super.delete(record);
  }

  getLocalParams(): string {
    return `SELECT S.localId,S.localUpdatedTime,S.id,S.name,S.localCategoryId,S.createdTime,S.updatedTime,C.id as categoryId
    FROM SubCategory S
    INNER JOIN Category C ON S.localCategoryId=C.localId WHERE S.isDeleted='${this.shared.falseValue}'`;
  }

  createLocalParms(record: SubCategory): Observable<SubCategory> {
    return this.checkCategoryId(record)
      .pipe(switchMap((data) => {
        record.local_category_id = data;
        const query = `INSERT INTO ${this.tableName}(name,id,localCategoryId,createdTime,updatedTime,isDeleted,localUpdatedTime)
    Values(?,?,?,?,?,?,?)`;
        const values = [record.name, record.id, record.local_category_id, new Date(), record.updated_time, false, record.local_updated_time];
        return super.createLocal(record, query, values);
      }));
  }

  updateLocalParms(record: SubCategory) {
    return this.checkCategoryId(record)
      .pipe(switchMap((data) => {
        record.local_category_id = data;
        const query = `UPDATE ${this.tableName} SET name=?,updatedTime=?,localUpdatedTime=? WHERE localId=?`;
        const values = [record.name, record.updated_time, record.local_updated_time, record.local_id];
        return super.updateLocal(record, query, values);
      }));
  }

  async findByName(record: SubCategory) {
    const selectQuery = `SELECT S.localId,S.localUpdatedTime,S.id,S.name,S.localCategoryId,S.createdTime,S.updatedTime,C.id as categoryId
    FROM SubCategory S
    INNER JOIN Category C ON S.localCategoryId=C.localId WHERE S.name=? and C.id=?`;
    const id = [record.name, record.category_id];
    return await this.excuteQuery(record, selectQuery, id);
  }

  checkCategoryId(record: SubCategory): Observable<number> {
    if (record.local_category_id) {
      return of(record.local_category_id);
    }
    return from(this.categoryService.getLocalId(record.category_id));
  }
}
