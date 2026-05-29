-- Seed data for dev-pronounce database
-- Local:  npm run db:seed:local   (= wrangler d1 execute dev-pronounce --local  --file=db/seed.sql)
-- Remote: npm run db:seed:remote  (= wrangler d1 execute dev-pronounce --remote --file=db/seed.sql)
--
-- INSERT OR IGNORE で冪等にしているため、何度実行してもデータが重複しません。

-- Insert sample terms
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-1', 'width', 'CSSの横幅プロパティ', 1700000000000),
('term-2', 'Kubernetes', 'コンテナオーケストレーションプラットフォーム', 1700000001000),
('term-4', 'null', 'データを持たない値やオブジェクト', 1700000003000),
('term-6', 'SQL', 'リレーショナルDBの問い合わせ言語', 1700000005000),
('term-7', 'char', '文字を表すデータ型', 1700000006000),
('term-8', 'GIF', '画像フォーマット', 1700000007000),
('term-9', 'nginx', 'Webサーバー / リバースプロキシ', 1700000008000);

-- Insert options for 'width'
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-1-1', 'term-1', 'ウィドス', 120, 0),
('opt-1-2', 'term-1', 'ワイド', 85, 0),
('opt-1-3', 'term-1', 'ワイズ', 45, 0);

-- Insert options for 'Kubernetes'
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-2-1', 'term-2', 'クーベネティス', 200, 0),
('opt-2-2', 'term-2', 'クバネティス', 150, 0),
('opt-2-3', 'term-2', 'ケーエイツ', 95, 0);

-- Insert options for 'null'
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-4-1', 'term-4', 'ヌル', 300, 0),
('opt-4-2', 'term-4', 'ナル', 50, 0);

-- Insert options for 'SQL'
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-6-1', 'term-6', 'エスキューエル', 220, 0),
('opt-6-2', 'term-6', 'シークェル', 130, 0);

-- Insert options for 'char'
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-7-1', 'term-7', 'チャー', 140, 0),
('opt-7-2', 'term-7', 'キャラ', 90, 0);

-- Insert options for 'GIF'
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-8-1', 'term-8', 'ギフ', 260, 0),
('opt-8-2', 'term-8', 'ジフ', 110, 0);

-- Insert options for 'nginx'
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-9-1', 'term-9', 'エンジンエックス', 240, 0),
('opt-9-2', 'term-9', 'エヌジンクス', 70, 0),
('opt-9-3', 'term-9', 'ンギンクス', 70, 0);

-- async
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-11', 'async', '非同期', 1699999000000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-11-1', 'term-11', 'アシンク', 259, 0),
('opt-11-2', 'term-11', 'エイシンク', 316, 0);

-- sudo
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-12', 'sudo', '管理者権限実行', 1699998999000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-12-2', 'term-12', 'スードゥー', 96, 0),
('opt-12-3', 'term-12', 'スドー', 59, 0),
('opt-12-4', 'term-12', 'スドゥ', 33, 0);

-- varchar
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-13', 'varchar', '可変長文字列型', 1699998998000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-13-1', 'term-13', 'バーチャー', 183, 0),
('opt-13-2', 'term-13', 'バーキャラ', 270, 0);

-- kubectl
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-14', 'kubectl', 'k8s操作CLI', 1699998997000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-14-1', 'term-14', 'キューブコントロール', 87, 0),
('opt-14-2', 'term-14', 'キューブシーティーエル', 95, 0),
('opt-14-3', 'term-14', 'クーブコントロール', 275, 0),
('opt-14-4', 'term-14', 'クベシーティーエル', 178, 0);

-- chmod
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-15', 'chmod', '権限変更コマンド', 1699998996000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-15-1', 'term-15', 'シーエイチモッド', 274, 0),
('opt-15-2', 'term-15', 'チェンジモッド', 54, 0),
('opt-15-3', 'term-15', 'チモッド', 200, 0),
('opt-15-4', 'term-15', 'チェンジモード', 149, 0);

-- LaTeX
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-16', 'LaTeX', '組版システム', 1699998995000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-16-1', 'term-16', 'ラテフ', 15, 0),
('opt-16-2', 'term-16', 'ラテック', 77, 0),
('opt-16-3', 'term-16', 'ラテックス', 265, 0);

-- JWT
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-17', 'JWT', '認証用トークン', 1699998994000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-17-1', 'term-17', 'ジェイダブリューティー', 210, 0),
('opt-17-2', 'term-17', 'ジョット', 240, 0);

-- # (hash)
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-18', '# (hash)', 'ハッシュ記号', 1699998993000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-18-1', 'term-18', 'シャープ', 314, 0),
('opt-18-2', 'term-18', 'ハッシュ', 41, 0);

-- pseudo
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-19', 'pseudo', '擬似・疑似', 1699998992000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-19-1', 'term-19', 'スード', 73, 0),
('opt-19-2', 'term-19', 'シュード', 258, 0),
('opt-19-3', 'term-19', 'プシュード', 201, 0),
('opt-19-4', 'term-19', 'プソイド', 181, 0);

-- i18n
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-20', 'i18n', '国際化', 1699998991000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-20-1', 'term-20', 'アイジュウハチエヌ', 236, 0),
('opt-20-2', 'term-20', 'アイエイティーンエヌ', 268, 0),
('opt-20-3', 'term-20', 'アイイチハチエヌ', 180, 0),
('opt-20-4', 'term-20', 'インターナショナライゼーション', 180, 0);


-- \ (backslash)
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-21', '\ (backslash)', 'バックスラッシュ/円記号', 1699998990000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-21-1', 'term-21', 'バックスラッシュ', 166, 0),
('opt-21-2', 'term-21', 'ぎゃくスラッシュ', 219, 0);

-- & (ampersand)
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-22', '& (ampersand)', 'アンパサンド/および記号', 1699998989000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-22-1', 'term-22', 'アンド', 70, 0),
('opt-22-2', 'term-22', 'アンパサンド', 232, 0);

-- src
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-23', 'src', '画像やスクリプトの参照元属性', 1699998988000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-23-1', 'term-23', 'ソース', 116, 0),
('opt-23-2', 'term-23', 'エスアールシー', 305, 0);

-- via
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-24', 'via', '経由を表すラテン語', 1699998987000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-24-1', 'term-24', 'ヴィア', 291, 0),
('opt-24-2', 'term-24', 'バイア', 281, 0),
('opt-24-3', 'term-24', 'ヴァイア', 260, 0),
('opt-24-4', 'term-24', 'ビア', 162, 0);

-- regex
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-25', 'regex', '正規表現', 1699998986000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-25-1', 'term-25', 'レゲックス', 170, 0),
('opt-25-2', 'term-25', 'レジェックス', 307, 0),
('opt-25-3', 'term-25', 'リジェックス', 173, 0),
('opt-25-4', 'term-25', 'レギュエックス', 173, 0);

-- GNU
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-26', 'GNU', 'フリーソフトのプロジェクト', 1699998985000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-26-1', 'term-26', 'グヌー', 181, 0),
('opt-26-2', 'term-26', 'グニュー', 30, 0),
('opt-26-3', 'term-26', 'ジーエヌユー', 264, 0),
('opt-26-4', 'term-26', 'ヌー', 51, 0);

-- enum
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-27', 'enum', '列挙型', 1699998984000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-27-1', 'term-27', 'イーナム', 86, 0),
('opt-27-2', 'term-27', 'エニュム', 207, 0),
('opt-27-3', 'term-27', 'イニューム', 133, 0),
('opt-27-4', 'term-27', 'エナム', 254, 0);

-- deque
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-28', 'deque', '両端キュー', 1699998983000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-28-1', 'term-28', 'デック', 246, 0),
('opt-28-2', 'term-28', 'デキュー', 23, 0),
('opt-28-3', 'term-28', 'デク', 111, 0);

-- wchar
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-29', 'wchar', 'ワイド文字型', 1699998982000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-29-1', 'term-29', 'ダブリューチャー', 40, 0),
('opt-29-2', 'term-29', 'ダブリューキャラ', 238, 0),
('opt-29-3', 'term-29', 'ワイドキャラ', 162, 0),
('opt-29-4', 'term-29', 'ダブリューチャーティー', 70, 0);

-- Ubuntu
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-30', 'Ubuntu', 'Linux系ディストリ', 1699998981000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-30-1', 'term-30', 'ウブントゥ', 294, 0),
('opt-30-2', 'term-30', 'ウブンツ', 152, 0),
('opt-30-3', 'term-30', 'ウブンチュ', 155, 0),
('opt-30-4', 'term-30', 'ウーブントゥ', 23, 0);

-- PostgreSQL
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-31', 'PostgreSQL', 'RDBMS', 1699998980000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-31-1', 'term-31', 'ポスグレ', 55, 0),
('opt-31-2', 'term-31', 'ポストグレス', 303, 0),
('opt-31-3', 'term-31', 'ポストグレスキューエル', 290, 0),
('opt-31-4', 'term-31', 'ポストグレ', 245, 0);

-- YAML
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-32', 'YAML', '設定記述フォーマット', 1699998979000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-32-1', 'term-32', 'ヤムル', 15, 0),
('opt-32-2', 'term-32', 'ヤメル', 195, 0);

-- GUID
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-33', 'GUID', '一意識別子', 1699998978000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-33-1', 'term-33', 'ジーユーアイディー', 313, 0),
('opt-33-2', 'term-33', 'グイッド', 149, 0),
('opt-33-3', 'term-33', 'グーイド', 129, 0);

-- ^ (caret)
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-34', '^ (caret)', 'キャレット/べき乗記号', 1699998977000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-34-1', 'term-34', 'キャレット', 16, 0),
('opt-34-2', 'term-34', 'ハット', 198, 0),
('opt-34-3', 'term-34', 'サーカムフレックス', 148, 0);

-- | (pipe)
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-35', '| (pipe)', 'パイプ/縦棒記号', 1699998976000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-35-1', 'term-35', 'パイプ', 275, 0),
('opt-35-2', 'term-35', 'たてぼう', 50, 0),
('opt-35-3', 'term-35', 'バーティカルバー', 227, 0),
('opt-35-4', 'term-35', 'バー', 300, 0);

-- {} (braces)
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-36', '{} (braces)', '波カッコ/中カッコ', 1699998975000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-36-1', 'term-36', 'なみカッコ', 145, 0),
('opt-36-2', 'term-36', 'ブレース', 281, 0),
('opt-36-3', 'term-36', 'ちゅうカッコ', 147, 0);

-- <> (angle brackets)
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-37', '<> (angle brackets)', '山カッコ/不等号', 1699998974000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-37-1', 'term-37', 'だいなり・しょうなり', 125, 0),
('opt-37-2', 'term-37', 'やまカッコ', 209, 0),
('opt-37-3', 'term-37', 'さんかくカッコ', 216, 0),
('opt-37-4', 'term-37', 'アングルブラケット', 80, 0);

-- alt
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-38', 'alt', 'img要素の代替テキスト属性', 1699998973000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-38-1', 'term-38', 'オルト', 284, 0),
('opt-38-2', 'term-38', 'アルト', 111, 0);

-- nav
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-39', 'nav', 'ナビゲーション領域の要素', 1699998972000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-39-1', 'term-39', 'ナビ', 87, 0),
('opt-39-2', 'term-39', 'ナブ', 202, 0);

-- li
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-40', 'li', 'リストの項目要素', 1699998971000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-40-1', 'term-40', 'エルアイ', 40, 0),
('opt-40-2', 'term-40', 'リスト', 225, 0),
('opt-40-3', 'term-40', 'リ', 245, 0);

-- verbose
INSERT OR IGNORE INTO terms (id, word, description, created_at) VALUES
('term-41', 'verbose', '詳細出力モード', 1699998970000);
INSERT OR IGNORE INTO options (id, term_id, label, count, is_custom) VALUES
('opt-41-1', 'term-41', 'バーボース', 120, 0),
('opt-41-2', 'term-41', 'バーボーズ', 63, 0),
('opt-41-3', 'term-41', 'ヴァーボース', 35, 0),
('opt-41-4', 'term-41', 'バーボス', 162, 0);

