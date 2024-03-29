import { migrate, MigrationDirection } from '../database/Migrations';

const migrationDirection = (process.argv[3] as MigrationDirection) || 'up';

migrate(migrationDirection).then((migrationResult) => {
  console.log('Result of migration: ', migrationResult);
});
