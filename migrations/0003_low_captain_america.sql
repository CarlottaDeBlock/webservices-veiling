ALTER TABLE `user` RENAME COLUMN `password` TO `password_hash`;--> statement-breakpoint
ALTER TABLE `user` ADD `roles` json NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `userId_user_email_unique` UNIQUE(`email`);