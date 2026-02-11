ALTER TABLE `events` ADD `time` text;--> statement-breakpoint
ALTER TABLE `events` ADD `type` text;--> statement-breakpoint
ALTER TABLE `events` ADD `cost` text;--> statement-breakpoint
ALTER TABLE `events` ADD `classification` text DEFAULT 'public';--> statement-breakpoint
ALTER TABLE `events` ADD `gpx_url` text;