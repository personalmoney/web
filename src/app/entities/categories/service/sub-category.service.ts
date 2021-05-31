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

  endpoint = 'SubCategory';
  tableName = 'SubCategory';

  constructor(
    http: HttpClient,
    protected shared: SharedService,
    private categoryService: CategoryService,
    authService: AuthService,
    sqlite: SqLiteService
  ) {
    super(http, shared, authService, sqlite);
    this.setRoute(0);
  }

  getRecords(categoryId: number): Observable<SubCategory[]> {
    this.setRoute(categoryId);
    return this.getAll();
  }

  getRecord(categoryId: number, id: string): Observable<SubCategory> {
    this.setRoute(categoryId);
    return super.get(id);
  }

  create(record: SubCategory): Observable<SubCategory> {
    this.setRoute(record.categoryId);
    return super.create(record);
  }

  update(record: SubCategory): Observable<SubCategory> {
    this.setRoute(record.categoryId);
    return super.update(record);
  }

  delete(record: SubCategory) {
    this.setRoute(record.categoryId);
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
        record.localCategoryId = data;
        const query = `INSERT INTO ${this.tableName}(name,id,localCategoryId,createdTime,updatedTime,isDeleted,localUpdatedTime)
    Values(?,?,?,?,?,?,?)`;
        const values = [record.name, record.id, record.localCategoryId, new Date(), record.updated_time, false, record.local_updated_time];
        return super.createLocal(record, query, values);
      }));
  }

  updateLocalParms(record: SubCategory) {
    return this.checkCategoryId(record)
      .pipe(switchMap((data) => {
        record.localCategoryId = data;
        const query = `UPDATE ${this.tableName} SET name=?,updatedTime=?,localUpdatedTime=? WHERE localId=?`;
        const values = [record.name, record.updated_time, record.local_updated_time, record.local_id];
        return super.updateLocal(record, query, values);
      }));
  }

  async findByName(record: SubCategory) {
    const selectQuery = `SELECT S.localId,S.localUpdatedTime,S.id,S.name,S.localCategoryId,S.createdTime,S.updatedTime,C.id as categoryId
    FROM SubCategory S
    INNER JOIN Category C ON S.localCategoryId=C.localId WHERE S.name=? and C.id=?`;
    const id = [record.name, record.categoryId];
    return await this.excuteQuery(record, selectQuery, id);
  }

  private setRoute(categoryId: number) {
    this.endpoint = `Category/${categoryId}/Subcategory`;
  }

  checkCategoryId(record: SubCategory): Observable<number> {
    if (record.localCategoryId) {
      return of(record.localCategoryId);
    }
    return from(this.categoryService.getLocalId(record.categoryId));
  }
}
