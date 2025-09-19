import csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { kyselyConnection } from '../database/Database';
import { BASE_CURRENCY } from '../lib/constants';
import type { BaseCurrency, Category, InputCurrency } from '../node_modules/kysely-codegen/dist/db';

interface CsvExpenseRow {
  Timestamp: string;
  Merchant: string;
  Amount: string;
  MCC: string;
  Category: string;
  Tag: string;
  Comment: string;
  Reimbursable: string;
  'Original Currency': string;
  'Original Amount': string;
  Receipt: string;
  Attendees: string;
}

interface ParsedExpense {
  merchant: string;
  date: Date;
  input_amount: number;
  input_currency: InputCurrency;
  base_amount: number;
  base_currency: BaseCurrency;
  category: Category;
  description?: string;
  report_id: number;
}

/**
 * Parse CSV file and return array of expense objects
 */
async function parseCsvFile(filePath: string): Promise<CsvExpenseRow[]> {
  return new Promise((resolve, reject) => {
    const results: CsvExpenseRow[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: CsvExpenseRow) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error: Error) => reject(error));
  });
}

/**
 * Map CSV row to database expense format
 */
function mapCsvRowToExpense(row: CsvExpenseRow, reportId: number): ParsedExpense | null {
  try {
    // Parse date from timestamp - handle BOM character
    const timestamp = row['Timestamp'] || row.Timestamp;
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${timestamp}`);
      return null;
    }

    // Parse amount - Amount column is always in SEK
    // Handle European number format with comma as thousands separator
    const amountStr = row.Amount.replace(/,/g, ''); // Remove thousands separators
    const amount = parseFloat(amountStr);

    if (isNaN(amount)) {
      console.warn(`Invalid amount format: ${row.Amount}`);
      return null;
    }

    // Use Comment as description, fallback to Tag if Comment is empty
    const description = row.Comment?.trim() || row.Tag?.trim() || undefined;

    return {
      merchant: row.Merchant.trim(),
      date,
      input_amount: amount,
      input_currency: 'SEK' as InputCurrency,
      base_amount: amount,
      base_currency: BASE_CURRENCY as BaseCurrency,
      category: row.Category as Category,
      description,
      report_id: reportId
    };
  } catch (error) {
    console.warn(`Error parsing row: ${error}`);
    return null;
  }
}

/**
 * Import expenses from CSV file
 */
async function importExpenses(csvFilePath: string, reportName: string): Promise<void> {
  try {
    console.log(`Starting import from ${csvFilePath} to report "${reportName}"`);

    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`File not found: ${csvFilePath}`);
    }

    // Check if report exists by name
    const db = kyselyConnection();
    const report = await db.selectFrom('reports').select('id').where('name', '=', reportName).executeTakeFirst();

    if (!report) {
      throw new Error(`Report with name "${reportName}" not found`);
    }

    const reportId = report.id;

    // Parse CSV file
    const csvRows = await parseCsvFile(csvFilePath);
    console.log(`Parsed ${csvRows.length} rows from CSV`);

    // Map and validate expenses
    const expenses: ParsedExpense[] = [];
    let skippedRows = 0;

    for (const row of csvRows) {
      const expense = mapCsvRowToExpense(row, reportId);
      if (expense) {
        expenses.push(expense);
      } else {
        skippedRows++;
      }
    }

    console.log(`Mapped ${expenses.length} valid expenses, skipped ${skippedRows} invalid rows`);

    if (expenses.length === 0) {
      console.log('No valid expenses to import');
      return;
    }

    // Insert expenses directly (no conversion needed since all amounts are in SEK)
    let importedCount = 0;
    let errorCount = 0;

    for (const expense of expenses) {
      try {
        await db.insertInto('expenses').values(expense).execute();
        importedCount++;

        if (importedCount % 10 === 0) {
          console.log(`Imported ${importedCount}/${expenses.length} expenses...`);
        }
      } catch (error) {
        console.error(`Error importing expense for ${expense.merchant}: ${error}`);
        errorCount++;
      }
    }

    console.log(`Import completed: ${importedCount} expenses imported, ${errorCount} errors`);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: npm run import-expenses <csv-file-path> <report-name>');
    console.log('Example: npm run import-expenses ./expenses.csv "2018/10"');
    process.exit(1);
  }

  const csvFilePath = path.resolve(args[0]);
  const reportName = args[1];

  await importExpenses(csvFilePath, reportName);
}

// Run the script
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
