ALTER TABLE `lot` MODIFY COLUMN `is_reversed` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `lot` MODIFY COLUMN `is_reversed` boolean NOT NULL DEFAULT false;--> statement-breakpoint
ALTER TABLE `lot` MODIFY COLUMN `can_bid_higher` boolean NOT NULL DEFAULT true;