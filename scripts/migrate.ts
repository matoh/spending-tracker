import { migrate, MigrationDirection } from '../database/Migrations';

async function main(direction: MigrationDirection) {
  const migrationResult = await migrate(direction);

  console.log('Result of migration: ', migrationResult);
}

const migrationDirection = (process.argv[3] as MigrationDirection) || 'up';

main(migrationDirection).catch((error) => {
  console.error('An error occurred while attempting to migrate the database:', error);
});
