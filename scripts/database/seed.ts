import { kyselyConnection } from '../../database/Database';
import { expenses } from '../../database/seeders/expenses';
import { reports } from '../../database/seeders/reports';

async function main() {
  const db = kyselyConnection();
  
  // Seed reports first (expenses have a foreign key reference to reports)
  await db.insertInto('reports').values(reports).executeTakeFirst();
  console.log(`Seeded ${reports.length} reports`);

  // Then seed expenses
  await db.insertInto('expenses').values(expenses).executeTakeFirst();
  console.log(`Seeded ${expenses.length} expenses`);
}

main().catch((error) => {
  console.error('An error occurred while attempting to seed the database:', error);
});
