CREATE TABLE `ftp_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`ftp` integer NOT NULL,
	`date` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users` ADD `strava_athlete_id` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `strava_access_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `strava_refresh_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `strava_expires_at` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `metric_preference` text DEFAULT 'heart_rate';--> statement-breakpoint
ALTER TABLE `users` ADD `stryd_token` text;