import { promises as fs } from 'fs';
import { FileMigrationProvider, MigrationResultSet, Migrator } from 'kysely';
import * as path from 'path';
import { kyselyConnection } from './Database';

export type MigrationDirection = 'up' | 'down' | 'latest';

/**
 * Migrate Database based on direction of the migration
 * "up":    Execute one up migration at the time
 * "down":  Execute one down migration at the time
 * "latest":Execute migrations to the latest db state
 * @param direction
 */
async function migrate(direction: MigrationDirection) {
  const db = kyselyConnection();
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations')
    })
  });

  let migrationResultSet: MigrationResultSet;
  switch (direction) {
    case 'up':
      migrationResultSet = await migrator.migrateUp();
      break;
    case 'down':
      migrationResultSet = await migrator.migrateDown();
      break;
    default:
      migrationResultSet = await migrator.migrateToLatest();
  }

  await db.destroy();

  return migrationResultSet;
}

export { migrate };
