ALTER TABLE `auctions` MODIFY COLUMN `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `company` MODIFY COLUMN `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `lot` MODIFY COLUMN `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `review` MODIFY COLUMN `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `bid` ADD CONSTRAINT `bid_auction_id_auctions_auction_id_fk` FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`auction_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bid` ADD CONSTRAINT `bid_bidder_id_user_user_id_fk` FOREIGN KEY (`bidder_id`) REFERENCES `user`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contract` ADD CONSTRAINT `contract_auction_id_auctions_auction_id_fk` FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`auction_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contract` ADD CONSTRAINT `contract_provider_id_user_user_id_fk` FOREIGN KEY (`provider_id`) REFERENCES `user`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contract` ADD CONSTRAINT `contract_requester_id_user_user_id_fk` FOREIGN KEY (`requester_id`) REFERENCES `user`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoice` ADD CONSTRAINT `invoice_contract_id_contract_contract_id_fk` FOREIGN KEY (`contract_id`) REFERENCES `contract`(`contract_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lot` ADD CONSTRAINT `lot_requester_id_user_user_id_fk` FOREIGN KEY (`requester_id`) REFERENCES `user`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lot` ADD CONSTRAINT `lot_winner_id_user_user_id_fk` FOREIGN KEY (`winner_id`) REFERENCES `user`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_contract_id_contract_contract_id_fk` FOREIGN KEY (`contract_id`) REFERENCES `contract`(`contract_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_reviewer_id_user_user_id_fk` FOREIGN KEY (`reviewer_id`) REFERENCES `user`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_reviewed_user_id_user_user_id_fk` FOREIGN KEY (`reviewed_user_id`) REFERENCES `user`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_company_id_company_company_id_fk` FOREIGN KEY (`company_id`) REFERENCES `company`(`company_id`) ON DELETE no action ON UPDATE no action;