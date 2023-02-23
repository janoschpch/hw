-- CreateTable
CREATE TABLE `Shared` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `homeworkId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `isShared` BOOLEAN NOT NULL DEFAULT false,
    `views` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shared` ADD CONSTRAINT `Shared_homeworkId_fkey` FOREIGN KEY (`homeworkId`) REFERENCES `Homework`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shared` ADD CONSTRAINT `Shared_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
