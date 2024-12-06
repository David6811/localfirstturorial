import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/web";
import { POWERSYNC_ENDPOINT, POWERSYNC_TOKEN } from "../config/_powersyncConfig";
import { AppSchema } from "../domain/schema/powersync_schema";
import { Note } from "../domain/models/Note";
import { NoteUpdateRequest } from "../domain/models/NoteUpdateRequest";

async function updateNoteInApi(opData: NoteUpdateRequest) {
    try {
        // Assuming your API is at '/api/put-endpoint' (adjust the URL as needed)
        const response = await fetch('/api/crud', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(opData),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("PUT API response: ", result);
        return result;
    } catch (error) {
        console.error("Error calling PUT API:", error);
        throw error;
    }
}

class Connector {
    private accessToken: string;
    constructor(accessToken: string) { 
        console.log("Auth0 access token in Connector: ", accessToken);
        this.accessToken = accessToken;
    }

    async fetchCredentials() {
        return {
            endpoint: POWERSYNC_ENDPOINT,
            token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjR6cFlKZGdUYUVHV1lOT0R0cDVOZSJ9.eyJ1c2VyX2lkIjoiNjc0MjgxYWZhNGZlZTNlMWVhNDgyZjhiIiwiZW1haWwiOiJ0ZXN0QGxvY2FsZmlyc3QuY29tIiwiaXNzIjoiaHR0cHM6Ly9kZXYtc3VuZnhya3NtenJmYmQ3cy51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8Njc0MjgxYWZhNGZlZTNlMWVhNDgyZjhiIiwiYXVkIjpbImh0dHBzOi8vNjc0YzBhOGEzODViYmI3MjgwYTJkNjdiLnBvd2Vyc3luYy5qb3VybmV5YXBwcy5jb20iLCJodHRwczovL2Rldi1zdW5meHJrc216cmZiZDdzLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MzM0ODM0ODYsImV4cCI6MTczMzU2OTg4Niwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF6cCI6IjR6UUhiWnlsZ2kxbzZWdTBTT2VGTlNWNFlINWtvUHVzIn0.gHUk3AclkD2jNgoGKefi9EtBEzlOaKuElFc_1Y_1x8-DMUoHpBZDBzG8xHZZ9nQkz87KDayahmd-tQDgf97VVjKU6Q2609dAi2HiFvBhW3NoEZ16f4QnYwFOAA0L_NwhpkV7DnFW4Lat_zYJTiQH5c2zaYDjjF9fR9tN_9AIrO6hwJC_P2mT_ZLEHFtHSQ_T5wCXvGdE9vzAgzUyNraEVT0lLAgfVhzqdvGa81TwX5gyGdK5n3YA4DktpHscYlrrrz-Hl1lEztbRzonguMKywr-_7vF8fE6krF-kdm1Nw8hXISs8l9EtsNqf5HEs_MnNFl2GYuwIirzCjUtXGXofOA"
        };
    }

    async uploadData(database: AbstractPowerSyncDatabase) {
        console.log("Trying to upload data to server...", database);
        const transaction = await database.getNextCrudTransaction();
        if (!transaction) {
            console.log("No transactions!");
            return;
        }

        for (const operation of transaction.crud) {
            const { op: opType, table } = operation;
            console.log("op", { op: opType, table });

            const opData = operation.opData ? operation.opData : {}
            console.log("opData: ", opData);
            if (opType == "PUT") {
                await transaction.complete();
            }

            else if (opType == "PATCH") {
                //saveNoteToMongo(powersyncNote);
                const requestData: NoteUpdateRequest = {
                    noteId: operation.id,
                    content: opData.content
                };
                await await updateNoteInApi(requestData);
                await transaction.complete();
            }

        }
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

export const setupPowerSync = async (accessToken : string) => {
    const connector = new Connector(accessToken);
    db.connect(connector);
};

export const findNotes = async (): Promise<Note[]> => {
    const result = await db.getAll('SELECT * FROM notes');
    return result as Note[];
};

// Watch changes to lists
const abortController = new AbortController();

export const watchLists = async (onUpdate: (updates: Note[]) => void): Promise<void> => {
    for await (const { rows } of db.watch('SELECT * FROM notes', [], { signal: abortController.signal })) {
        const updates = rows?._array ?? [];
        if (updates.length > 0) {
            onUpdate(updates);
        }
    }
};

export const updateNote = async (content: string, id: string) => {
    console.log(`UPDATE notes SET content = ? WHERE id = ?`);
    await db.execute(
        `UPDATE notes SET content = ? WHERE id = ?`,
        [content, id]
    );
    console.log(`Note updated successfully for ID: ${id}`);
};
