import { neon } from "@neondatabase/serverless";

import "dotenv/config";

//this will create SQL connection using our database url.
export const sql = neon(process.env.DATABASE_URL);