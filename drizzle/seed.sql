-- Seed data for dev-pronounce database
-- Run with: npx wrangler d1 execute dev-pronounce --local --file=drizzle/seed.sql

-- Insert sample terms
INSERT INTO terms (id, word, description, created_at) VALUES
('term-1', 'width', 'CSSの横幅プロパティ', 1700000000000),
('term-2', 'Kubernetes', 'コンテナオーケストレーションプラットフォーム', 1700000001000),
('term-3', 'App', 'アプリケーション', 1700000002000),
('term-4', 'null', 'データを持たない値やオブジェクト', 1700000003000),
('term-5', 'cache', 'データの一時保存領域', 1700000004000);

-- Insert options for 'width'
INSERT INTO options (id, term_id, label, count, is_custom) VALUES
('opt-1-1', 'term-1', 'ウィドス', 120, 0),
('opt-1-2', 'term-1', 'ワイド', 85, 0),
('opt-1-3', 'term-1', 'ウィズ', 45, 0);

-- Insert options for 'Kubernetes'
INSERT INTO options (id, term_id, label, count, is_custom) VALUES
('opt-2-1', 'term-2', 'クーベネティス', 200, 0),
('opt-2-2', 'term-2', 'クバネティス', 150, 0),
('opt-2-3', 'term-2', 'ケーエイト', 95, 0);

-- Insert options for 'App'
INSERT INTO options (id, term_id, label, count, is_custom) VALUES
('opt-3-1', 'term-3', 'アップ', 180, 0),
('opt-3-2', 'term-3', 'アプ', 100, 0);

-- Insert options for 'null'
INSERT INTO options (id, term_id, label, count, is_custom) VALUES
('opt-4-1', 'term-4', 'ヌル', 300, 0),
('opt-4-2', 'term-4', 'ナル', 50, 0);

-- Insert options for 'cache'
INSERT INTO options (id, term_id, label, count, is_custom) VALUES
('opt-5-1', 'term-5', 'キャッシュ', 250, 0),
('opt-5-2', 'term-5', 'カッシュ', 80, 0),
('opt-5-3', 'term-5', 'ケーシュ', 20, 0);
