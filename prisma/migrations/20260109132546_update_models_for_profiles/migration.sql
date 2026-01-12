/*
  Warnings:

  - You are about to drop the `user_skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `city` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `isDabbler` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `isGuide` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `radiusMiles` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `profiles` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_skills_userId_skillId_type_key";

-- DropIndex
DROP INDEX "user_skills_skillId_idx";

-- DropIndex
DROP INDEX "user_skills_userId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_skills";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "profile_locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "isDiscoverable" BOOLEAN NOT NULL DEFAULT false,
    "addressLabel" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "precision" TEXT NOT NULL DEFAULT 'neighborhood',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "profile_locations_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "profile_skills" (
    "profileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    PRIMARY KEY ("profileId", "skillId", "type"),
    CONSTRAINT "profile_skills_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "profile_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "interestsIntro" TEXT,
    "skillsIntro" TEXT,
    "interests" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_profiles" ("createdAt", "id", "updatedAt", "userId") SELECT "createdAt", "id", "updatedAt", "userId" FROM "profiles";
DROP TABLE "profiles";
ALTER TABLE "new_profiles" RENAME TO "profiles";
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");
CREATE TABLE "new_skills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_skills" ("category", "createdAt", "id", "name") SELECT "category", "createdAt", "id", "name" FROM "skills";
DROP TABLE "skills";
ALTER TABLE "new_skills" RENAME TO "skills";
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "profile_locations_profileId_key" ON "profile_locations"("profileId");

-- CreateIndex
CREATE INDEX "profile_skills_profileId_idx" ON "profile_skills"("profileId");

-- CreateIndex
CREATE INDEX "profile_skills_skillId_idx" ON "profile_skills"("skillId");
