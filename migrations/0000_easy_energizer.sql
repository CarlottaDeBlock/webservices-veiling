CREATE TABLE `auctions` (
	`auction_id` int unsigned AUTO_INCREMENT NOT NULL,
	`request_id` int unsigned NOT NULL,
	`start_time` datetime(3) NOT NULL,
	`end_time` datetime(3) NOT NULL,
	`status` enum('open','closed','cancelled') NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `auctions_auction_id` PRIMARY KEY(`auction_id`)
);
--> statement-breakpoint
CREATE TABLE `bid` (
	`bid_id` int unsigned AUTO_INCREMENT NOT NULL,
	`auction_id` int unsigned NOT NULL,
	`bidder_id` int unsigned NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`bid_time` datetime(3) NOT NULL,
	CONSTRAINT `bid_bid_id` PRIMARY KEY(`bid_id`)
);
--> statement-breakpoint
CREATE TABLE `company` (
	`company_id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`vat_number` varchar(32) NOT NULL,
	`address` varchar(255) NOT NULL,
	`city` varchar(100) NOT NULL,
	`country` varchar(2) NOT NULL,
	`status` enum('active','inactive') NOT NULL,
	`peppol_id` varchar(64) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`invoice_email` varchar(255),
	CONSTRAINT `company_company_id` PRIMARY KEY(`company_id`),
	CONSTRAINT `companyId_company_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `contract` (
	`contract_id` int unsigned AUTO_INCREMENT NOT NULL,
	`auction_id` int unsigned NOT NULL,
	`provider_id` int unsigned NOT NULL,
	`requester_id` int unsigned NOT NULL,
	`agreed_price` decimal(10,2) NOT NULL,
	`start_date` datetime(3) NOT NULL,
	`end_date` datetime(3) NOT NULL,
	`status` enum('active','completed','cancelled') NOT NULL,
	CONSTRAINT `contract_contract_id` PRIMARY KEY(`contract_id`)
);
--> statement-breakpoint
CREATE TABLE `invoice` (
	`invoice_id` int unsigned AUTO_INCREMENT NOT NULL,
	`contract_id` int unsigned NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`issue_date` datetime(3) NOT NULL,
	`due_date` datetime(3) NOT NULL,
	`status` enum('unpaid','paid','overdue') NOT NULL,
	CONSTRAINT `invoice_invoice_id` PRIMARY KEY(`invoice_id`)
);
--> statement-breakpoint
CREATE TABLE `lot` (
	`lot_id` int unsigned AUTO_INCREMENT NOT NULL,
	`request_id` int unsigned NOT NULL,
	`requester_id` int unsigned NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`start_time` datetime(3) NOT NULL,
	`end_time` datetime(3) NOT NULL,
	`winner_id` int unsigned,
	`category` varchar(100) NOT NULL,
	`reserved_price` decimal(10,2) NOT NULL,
	`buy_price` decimal(10,2),
	`start_bid` decimal(10,2) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`status` enum('open','closed','cancelled') NOT NULL,
	`extra_information` text,
	`is_reversed` tinyint unsigned NOT NULL DEFAULT 0,
	`can_bid_higher` tinyint unsigned NOT NULL DEFAULT 1,
	CONSTRAINT `lot_lot_id` PRIMARY KEY(`lot_id`)
);
--> statement-breakpoint
CREATE TABLE `review` (
	`review_id` int unsigned AUTO_INCREMENT NOT NULL,
	`contract_id` int unsigned NOT NULL,
	`reviewer_id` int unsigned NOT NULL,
	`reviewed_user_id` int unsigned NOT NULL,
	`rating` tinyint unsigned NOT NULL,
	`comment` text,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `review_review_id` PRIMARY KEY(`review_id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`user_id` int unsigned AUTO_INCREMENT NOT NULL,
	`username` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`is_provider` tinyint unsigned NOT NULL DEFAULT 0,
	`rating` tinyint unsigned,
	`company_id` int unsigned,
	`role` varchar(100) NOT NULL,
	`language` varchar(10) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `user_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `userId_user_username_unique` UNIQUE(`username`)
);
