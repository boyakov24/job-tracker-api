import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts', // Your schema file path
  out: './drizzle', // Your migrations folder
  dialect: 'postgresql',
});