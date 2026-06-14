const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://neondb_owner:npg_UnAm43idBZCj@ep-icy-shadow-ahbddvfy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function initializeDb() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Connecting to Neon Database...");
        await client.connect();

        console.log("Reading init.sql...");
        const sqlPath = path.join(__dirname, '../init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("Executing schema initialization...");
        await client.query(sql);

        console.log("Database initialized successfully!");
    } catch (err) {
        console.error("Error during initialization:", err);
    } finally {
        await client.end();
    }
}

initializeDb();
