import { Pool } from "pg";
import 'dotenv/config';

const db = new Pool({
    database:neondb,
    user: neondb_owner,
    password: npg_iHUT9egoD4yX,
    host: ep-blue-frog-a86darz4-pooler.eastus2.azure.neon.tech,
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Disable cert verification (fine for Neon/dev)
    },
});
export default db;
