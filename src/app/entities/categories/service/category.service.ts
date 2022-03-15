import { Injectable } from '@angular/core';
import { SyncService } from 'src/app/core/services/sync.service';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';
import { SqLiteService } from 'src/app/core/services/sq-lite.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SubCategory } from '../models/sub-category';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends SyncService<Category> {
  endpoint = 'categories';
  tableName = 'Category';

  constructor(
    http: HttpClient,
    protected shared: SharedService,
    authService: AuthService,
    notification: NotificationService,
    sqlite: SqLiteService
  ) {
    super(http, shared, authService, notification, sqlite);
  }

  async getAll() {
    if (this.shared.isWeb) {
      return await super.getAll(false, `*,sub_categories(id,name,category_id)`);
    }
    const data = await super.getAll();

    const query = `SELECT S.localId,S.localUpdatedTime,S.id,S.name,S.localCategoryId,S.createdTime,S.updatedTime,C.id as categoryId
          FROM SubCategory S
          INNER JOIN Category C ON S.localCategoryId=C.localId WHERE S.isDeleted='${this.shared.falseValue}'`;
    const result = await this.sqlite.query(query);
    const values = result.values as SubCategory[];
    data.forEach(d => {
      d.sub_categories = values.filter(f => f.local_category_id === d.local_id);
    });
    return data;
  }

  async createLocalParms(record: Category): Promise<Category> {
    const query = `INSERT INTO ${this.tableName}(name,id,createdTime,updatedTime,isDeleted,localUpdatedTime) Values(?,?,?,?,?,?)`;
    const values = [record.name, record.id, new Date(), record.updated_time, false, record.local_updated_time];
    return await super.createLocal(record, query, values);
  }

  async updateLocalParms(record: Category) {
    const query = `UPDATE ${this.tableName} SET name=?,updatedTime=?,localUpdatedTime=? WHERE localId=?`;
    const values = [record.name, record.updated_time, record.local_updated_time, record.local_id];
    return await super.updateLocal(record, query, values);
  }

  async update(record: Category): Promise<Category> {
    const subCategories = record.sub_categories;
    delete record.sub_categories;
    const result = await super.update(record);
    result.sub_categories = subCategories;
    return result;
  }
}
