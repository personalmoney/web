import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SqLiteService } from 'src/app/core/services/sq-lite.service';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  constructor(
    private http: HttpClient,
    private sqlite: SqLiteService
  ) { }


  /**
   * Checks the DB version and updates it to latest
   */
  async checkVersion() {
    if (!this.sqlite.isService) {
      return;
    }
    if (await this.sqlite.isDBExists(this.sqlite.databaseName)) {
      const result = await this.sqlite.query(`SELECT name FROM sqlite_master WHERE type='table' AND name='DbVersion'`);
      if (result.values.length === 0) {
        await this.upgradeDatabase('v1');
      }
      else {
        const result1 = await this.sqlite.query('SELECT VersionNumber FROM DbVersion');
        if (result1.values.length === 0) {
          await this.upgradeDatabase('v1');
        }
        else {
          const currentVersion: string = result1.values[0].VersionNumber;
          console.log('Current Version:' + currentVersion);
          const nextVersion = Number.parseInt(currentVersion.replace('v', ''), 10);
          await this.upgradeDatabase('v' + (nextVersion + 1));
        }
      }
    } else {
      console.log('Database not found, need to create one');
      this.sqlite.openDB();
      this.upgradeDatabase('v1');
    }
  }

  private async upgradeDatabase(version: string) {
    switch (version) {
      case 'v1':
        await this.executeScript('v1');

      // eslint-disable-next-line no-fallthrough
      // case 'v2':
      //   await this.executeScript('v2');
    }
  }

  private async updateSchemaVersion(version: string) {
    await this.sqlite.run(`UPDATE DbVersion SET VersionNumber=?,UpdateTime=datetime('now')`, [version]);
  }

  private async executeScript(scriptName: string) {
    const data = await this.http.get(`./assets/db/${scriptName}.sql`, { responseType: 'text' })
      .toPromise()
      .catch(() => null);
    if (data) {
      console.log('Upgrading the database to ' + scriptName);
      await this.sqlite.execute(data);
      await this.updateSchemaVersion(scriptName);
    }
  }
}
