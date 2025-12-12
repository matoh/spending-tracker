import { Insertable } from 'kysely';
import { Reports } from 'kysely-codegen/dist/db';

export const reports: Insertable<Reports>[] = [
  {
    name: 'Test Report',
    status: 'open'
  }
];

