import { kyselyConnection } from '../../database/Database';
import { expenses } from '../../database/seeders/expenses';

async function main() {
  const db = kyselyConnection();
  await db.insertInto('expenses').values(expenses).executeTakeFirst();

  console.log(`Seeded ${expenses.length} expenses`);
}

main().catch((error) => {
  console.error('An error occurred while attempting to seed the database:', error);
});
