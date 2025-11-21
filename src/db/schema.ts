import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
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

export const termsRelations = relations(terms, ({ many }) => ({
  options: many(options),
}));

export const optionsRelations = relations(options, ({ one }) => ({
  term: one(terms, {
    fields: [options.termId],
    references: [terms.id],
  }),
}));
