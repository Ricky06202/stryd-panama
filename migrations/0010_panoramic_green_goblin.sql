PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_coach_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`content` text NOT NULL,
	`is_read` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_coach_messages`("id", "user_id", "content", "is_read", "created_at") SELECT "id", "user_id", "content", "is_read", "created_at" FROM `coach_messages`;--> statement-breakpoint
DROP TABLE `coach_messages`;--> statement-breakpoint
ALTER TABLE `__new_coach_messages` RENAME TO `coach_messages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_ftp_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`ftp` integer NOT NULL,
	`date` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_ftp_history`("id", "user_id", "ftp", "date", "created_at") SELECT "id", "user_id", "ftp", "date", "created_at" FROM `ftp_history`;--> statement-breakpoint
DROP TABLE `ftp_history`;--> statement-breakpoint
ALTER TABLE `__new_ftp_history` RENAME TO `ftp_history`;--> statement-breakpoint
CREATE TABLE `__new_membership_requests` (
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
	`is_already_member` integer DEFAULT false,
	`status` text DEFAULT 'pending',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_membership_requests`("id", "user_id", "training_goals", "short_term_goal", "medium_term_goal", "long_term_goal", "training_days_per_week", "has_trained_with_stryd", "has_structured_training", "discovery_method", "is_already_member", "status", "created_at") SELECT "id", "user_id", "training_goals", "short_term_goal", "medium_term_goal", "long_term_goal", "training_days_per_week", "has_trained_with_stryd", "has_structured_training", "discovery_method", "is_already_member", "status", "created_at" FROM `membership_requests`;--> statement-breakpoint
DROP TABLE `membership_requests`;--> statement-breakpoint
ALTER TABLE `__new_membership_requests` RENAME TO `membership_requests`;--> statement-breakpoint
CREATE TABLE `__new_user_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_reviews`("id", "user_id", "content", "created_at") SELECT "id", "user_id", "content", "created_at" FROM `user_reviews`;--> statement-breakpoint
DROP TABLE `user_reviews`;--> statement-breakpoint
ALTER TABLE `__new_user_reviews` RENAME TO `user_reviews`;