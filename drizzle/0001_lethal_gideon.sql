CREATE TABLE `segment_counts` (
	`option_id` text NOT NULL,
	`dim` text NOT NULL,
	`bucket` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`option_id`, `dim`, `bucket`)
);
