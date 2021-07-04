import { TimeModel } from 'src/app/models/time-model';
import { CrudService } from './crud.service';


export abstract class SyncService<T extends TimeModel> extends CrudService<T> {

    async syncData() {
        // Sync Remote records first
        await this.syncRemoteRecords();
        await this.syncLocalRecords();
    }

    private async syncRemoteRecords() {
        const query = `SELECT syncTime From SyncTime WHERE tableName=?`;
        const values = [this.tableName];
        const result = await this.sqlite.query(query, values);
        const date = new Date();

        let lastSyncDate = new Date('2000-01-01');
        if (result.values.length > 0) {
            lastSyncDate = new Date(result.values[0].syncTime);
        }
        const data = await this.getModifiedData(lastSyncDate);
        if (data && data.length > 0) {
            console.log(`${this.tableName}: ${data.length} remote record(s) found`);

            data.map(async (record) => {
                let response;

                // #1 find by remote id, sync if found
                response = await this.findById(record);
                if (response) {
                    return;
                }

                // #2 find by name, sync if found
                response = await this.findByName(record);
                if (response) {
                    return;
                }

                // #4 created the new records
                record.local_updated_time = record.updated_time;
                await this.createLocalParms(record);
            });
        }

        let updateQuery;
        if (lastSyncDate.getFullYear() === 2000) {
            updateQuery = 'INSERT INTO SyncTime(syncTime,tableName) values(?,?)';
        }
        else {
            updateQuery = 'UPDATE SyncTime SET syncTime=? WHERE tableName=?';
        }
        const values1 = [date, this.tableName];
        await this.sqlite.run(updateQuery, values1);
    }

    private async syncLocalRecords() {
        const query = `SELECT * From ${this.tableName} WHERE localUpdatedTime>updatedTime`;
        const result = await this.sqlite.query(query);
        if (result && result.length > 0) {
            console.log(`${this.tableName}: ${result.length} local record(s) found`);
        }
    }

    private async findById(record: T): Promise<boolean> {
        const selectQuery = `SELECT * from ${this.tableName} where id=?`;
        const id = [record.id];
        return await this.excuteQuery(record, selectQuery, id);
    }

    protected async findByName(record: any): Promise<boolean> {
        const selectQuery = `SELECT * from ${this.tableName} where name=?`;
        const id = [record.name];
        return await this.excuteQuery(record, selectQuery, id);
    }

    protected async excuteQuery(record: T, query: string, value: any[]): Promise<boolean> {
        const result = await this.sqlite.query(query, value);

        if (result.values.length > 0) {
            const localRecord: T = result.values[0];
            return await this.syncRecord(record, localRecord);
        }
        return false;
    }

    private async syncRecord(record: T, localRecord: T): Promise<boolean> {
        record.local_id = localRecord.local_id;
        localRecord.id = record.id;

        // if (record.is_deleted) {
        //     await super.deleteInLocal(record).toPromise();
        //     return true;
        // }

        if (localRecord.local_updated_time === record.updated_time) {
            return true;
        }
        else if (localRecord.local_updated_time < record.updated_time) {
            record.local_updated_time = record.updated_time;
            await this.updateLocalParms(record);
        }
        else {
            localRecord.id = record.id;
            await this.update(localRecord);
        }
        return true;
    }
}
