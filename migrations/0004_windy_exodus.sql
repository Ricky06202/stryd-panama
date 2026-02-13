CREATE TABLE `membership_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`training_goals` text,
	`short_term_goal` text,
	`medium_term_goal` text,
	`long_term_goal` text,
	`training_days_per_week` text,
	`has_trained_with_stryd` text,
	`has_structured_training` text,
	`discovery_method` text,
	`status` text DEFAULT 'pending',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text NOT NULL,
	`id_card` text NOT NULL,
	`photo_url` text,
	`birth_date` text,
	`gender` text,
	`province` text,
	`email` text NOT NULL,
	`phone` text,
	`password` text NOT NULL,
	`blood_type` text,
	`allergies` text,
	`diseases` text,
	`past_injuries` text,
	`current_injuries` text,
	`height` integer,
	`weight` integer,
	`fat_percentage` integer,
	`footwear_type` text,
	`record_5k` text,
	`record_10k` text,
	`record_21k` text,
	`record_42k` text,
	`record_wkg` text,
	`stryd_user` text,
	`final_surge_user` text,
	`start_date` text,
	`is_member` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_card_unique` ON `users` (`id_card`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);