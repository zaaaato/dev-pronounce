CREATE TABLE `options` (
	`id` text PRIMARY KEY NOT NULL,
	`term_id` text NOT NULL,
	`label` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`is_custom` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`term_id`) REFERENCES `terms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `terms` (
	`id` text PRIMARY KEY NOT NULL,
	`word` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer NOT NULL
);
