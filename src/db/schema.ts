import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const terms = sqliteTable('terms', {
  id: text('id').primaryKey(),
  word: text('word').notNull(),
  description: text('description').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const options = sqliteTable('options', {
  id: text('id').primaryKey(),
  termId: text('term_id').notNull().references(() => terms.id),
  label: text('label').notNull(),
  count: integer('count').default(0).notNull(),
  isCustom: integer('is_custom', { mode: 'boolean' }).default(false).notNull(),
});

// 職種(role)/経験年数(exp) などセグメント別の票数。
// (option_id, dim, bucket) で 1 行。dim='role'|'exp', bucket は各 value。
export const segmentCounts = sqliteTable(
  'segment_counts',
  {
    optionId: text('option_id').notNull(),
    dim: text('dim').notNull(),
    bucket: text('bucket').notNull(),
    count: integer('count').default(0).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.optionId, t.dim, t.bucket] }),
  }),
);

export const termsRelations = relations(terms, ({ many }) => ({
  options: many(options),
}));

export const optionsRelations = relations(options, ({ one }) => ({
  term: one(terms, {
    fields: [options.termId],
    references: [terms.id],
  }),
}));
