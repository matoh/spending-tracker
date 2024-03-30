import { DefaultLogger, LogWriter } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/node-postgres';
import { date, pgTable, real, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from 'kysely-codegen';
import { Client, Pool } from 'pg';

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

export const drizzleExpense = pgTable('expenses', {
  id: serial('id').primaryKey(),
  merchant: text('merchant').notNull(),
  description: text('description'),
  category: text('category'),
  cost_sek: real('cost_sek'),
  cost_eur: real('cost_eur'),
  date: date('date'),
  created_at: timestamp('created_at')
});

type testExpense = typeof drizzleExpense.$inferSelect;

// const selectExpenseType: testExpense;

class MyLogWriter implements LogWriter {
  write(message: string) {
    // console.log(message);
    // Write to file, stdout, etc.
  }
}

async function drizzleConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await client.connect();
  const logger = new DefaultLogger({ writer: new MyLogWriter() });
  return drizzle(client, { logger });
}

export { drizzleConnection, kyselyConnection };
