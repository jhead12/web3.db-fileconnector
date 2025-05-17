async function createModelTable(db: any): Promise<void> {
    try {
        await db.transaction(async (tx: any) => {
            const model_store = tx.store("model_table");

            await tx.executeSql(`
                CREATE TABLE IF NOT EXISTS model_table (
                    id TEXT PRIMARY KEY,
                    model_name TEXT,
                    created_at INTEGER,
                    updated_at INTEGER
                )
            `);

            await tx.commit();
        });

        console.log("Model table created or already exists.");

    } catch (error) {
        console.error("Error creating model table:", error);
        throw error; // Propagate the error
    }
}