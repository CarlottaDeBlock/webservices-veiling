CREATE TABLE `user_favorite_lots` (
	`user_id` int unsigned NOT NULL,
	`lot_id` int unsigned NOT NULL,
	CONSTRAINT `user_favorite_lots_user_id_lot_id_pk` PRIMARY KEY(`user_id`,`lot_id`)
);
--> statement-breakpoint
ALTER TABLE `user_favorite_lots` ADD CONSTRAINT `user_favorite_lots_user_id_user_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_favorite_lots` ADD CONSTRAINT `user_favorite_lots_lot_id_lot_lot_id_fk` FOREIGN KEY (`lot_id`) REFERENCES `lot`(`lot_id`) ON DELETE cascade ON UPDATE no action;