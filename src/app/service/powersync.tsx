import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/web";
import { POWERSYNC_ENDPOINT, POWERSYNC_TOKEN } from "../config/_powersyncConfig";
import { AppSchema } from "../domain/schema/powersync_schema";
import { Note } from "../domain/models/Note";


class Connector {
    constructor() { }

    async fetchCredentials() {
        return {
            endpoint: POWERSYNC_ENDPOINT,
            token: POWERSYNC_TOKEN
        };
    }

    async uploadData(database: AbstractPowerSyncDatabase) {
        console.log("Trying to upload data to server...", database);
    }
}


export const db = new PowerSyncDatabase({
    schema: AppSchema,
    database: {
        dbFilename: 'notes.db'
    },
    flags: {
        enableMultiTabs: true
    }
});

export const setupPowerSync = async () => {
    const connector = new Connector();
    db.connect(connector);
};

export const findNotes = async (): Promise<Note[]> => {
    const result = await db.getAll('SELECT * FROM notes');
    return result as Note[];
  };