import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-expense-with-ai.ts';
import '@/ai/flows/generate-weekly-summary.ts';
import '@/ai/flows/parse-expense-from-text.ts';

