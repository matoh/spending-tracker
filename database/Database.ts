import { Kysely, PostgresDialect } from 'kysely';
import { DB } from 'kysely-codegen';
import { Pool } from 'pg';

let kyselyDbConnection: Kysely<DB> | undefined = undefined;

/**
 * Create or re-use existing kysely database connection
 */
function kyselyConnection() {
  if (!kyselyDbConnection) {
    kyselyDbConnection = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL
        })
      }),
      // Custom logger for outputting executed SQL queries
      log(event) {
        if (event.level === 'query') {
          // Un-comment to console log all executed queries
          console.log(event.query.sql);
          // console.log(event.query.parameters);
        }
      }
    });
  }

  return kyselyDbConnection;
}

export { kyselyConnection };
