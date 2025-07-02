CREATE TABLE `AnonymousSession` (
	`id` text PRIMARY KEY NOT NULL,
	`initialPrompt` text NOT NULL,
	`sessionData` text,
	`createdAt` integer NOT NULL,
	`convertedUserId` text,
	`convertedAt` integer,
	`convertedChatId` text,
	FOREIGN KEY (`convertedUserId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`convertedChatId`) REFERENCES `Chat`(`id`) ON UPDATE no action ON DELETE no action
);
