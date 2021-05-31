import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';


@Injectable({
  providedIn: 'root'
})
export class SqLiteService {

  databaseName = environment.supabase.key;
  sqlite: any;
  isService = false;
  platform: string;

  constructor() { }

  async initializePlugin(): Promise<void> {
    const info = await Device.getInfo();
    this.platform = info.platform;
    console.log('*** platform ' + this.platform);
    if (this.platform !== 'web') {
      const sqlitePlugin: any = CapacitorSQLite;
      this.sqlite = new SQLiteConnection(sqlitePlugin);
      this.isService = true;
    }
  }
  /**
   * Get Echo
   * @param value string
   */
  async getEcho(): Promise<any> {
    if (this.isService) {
      return await this.sqlite.echo({ value: 'Hello from personal money' });
    } else {
      return Promise.resolve('');
    }
  }
  /**
   * Open a Database
   * @param dbName string
   * @param encrypted boolean optional
   * @param mode string optional
   */
  async openDB(dbName: string = this.databaseName, encrypted: boolean = false, mode: string = 'no-encryption'): Promise<any> {
    if (this.isService) {
      return await this.sqlite.open({ database: dbName, encrypted, mode });
    } else {
      return Promise.resolve({ result: false, message: 'Service not started' });
    }
  }
  async createSyncTable(): Promise<any> {

    if (this.isService) {
      return await this.sqlite.createSyncTable();
    } else {
      return Promise.resolve({ changes: -1, message: 'Service not started' });
    }
  }
  /**
   * Execute a set of Raw Statements
   * @param statements string
   */
  async execute(statements: string): Promise<any> {
    if (this.isService && statements.length > 0) {
      return await this.sqlite.execute({ statements });
    } else {
      return Promise.resolve({ changes: -1, message: 'Service not started' });
    }
  }
  /**
   * Execute a set of Raw Statements as Array<any>
   * @param set Array<any>
   */
  async executeSet(set: Array<any>): Promise<any> {
    if (this.isService && set.length > 0) {
      return await this.sqlite.executeSet({ set });
    } else {
      return Promise.resolve({ changes: -1, message: 'Service not started' });
    }
  }
  /**
   * Execute a Single Raw Statement
   * @param statement string
   */
  async run(statement: string, values: Array<any> = []): Promise<any> {
    if (this.isService && statement.length > 0) {
      return await this.sqlite.run({ statement, values });
    } else {
      return Promise.resolve({ changes: -1, message: 'Service not started' });
    }
  }
  /**
   * Query a Single Raw Statement
   * @param statement string
   * @param values Array<string> optional
   */
  async query(statement: string, values: Array<string> = []): Promise<any> {
    if (this.isService && statement.length > 0) {
      return await this.sqlite.query({ statement, values });
    } else {
      return Promise.resolve({ values: [], message: 'Service not started' });
    }

  }
  /**
   * Close the Database
   * @param dbName string
   */
  async close(dbName: string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.close({ database: dbName });
    } else {
      return Promise.resolve({ result: false, message: 'Service not started' });
    }
  }
  /**
   * Check if the Database file exists
   * @param dbName string
   */
  async isDBExists(dbName: string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.isDBExists({ database: dbName });
    } else {
      return Promise.resolve({ result: false, message: 'Service not started' });
    }
  }
  /**
   * Delete the Database file
   * @param dbName string
   */
  async deleteDB(dbName: string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.deleteDatabase({ database: dbName });
    } else {
      return Promise.resolve({ result: false, message: 'Service not started' });
    }
  }
  /**
   * Check the validity of a JSON Object
   * @param jsonstring string
   */
  async isJsonValid(jsonstring: string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.isJsonValid({ jsonstring });
    } else {
      return Promise.resolve({ result: false, message: 'Service not started' });
    }
  }

  /**
   * Import a database From a JSON
   * @param jsonstring string
   */
  async importFromJson(jsonstring: string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.importFromJson({ jsonstring });
    } else {
      return Promise.resolve({ changes: -1, message: 'Service not started' });
    }
  }
  /**
   * Export the given database to a JSON Object
   * @param mode string
   */
  async exportToJson(mode: string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.exportToJson({ jsonexportmode: mode });
    } else {
      return Promise.resolve({ export: {}, message: 'Service not started' });
    }
  }
  async setSyncDate(syncDate: string): Promise<any> {
    if (this.isService) {
      return await this.sqlite.setSyncDate({ syncdate: syncDate });
    } else {
      return Promise.resolve({ result: false, message: 'Service not started' });
    }

  }
}
