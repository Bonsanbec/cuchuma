-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_authorId_fkey";
-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "MediaFile" DROP CONSTRAINT "MediaFile_authorId_fkey";
-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_createdById_fkey";
-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Reflection" DROP CONSTRAINT "Reflection_createdById_fkey";
-- AddForeignKey
ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_createdById_fkey";
-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "CitizenForm" DROP CONSTRAINT "CitizenForm_createdById_fkey";
-- AddForeignKey
ALTER TABLE "CitizenForm" ADD CONSTRAINT "CitizenForm_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Survey" DROP CONSTRAINT "Survey_createdById_fkey";
-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable FormResponse
ALTER TABLE "FormResponse" ADD COLUMN "ipHash" TEXT;
ALTER TABLE "FormResponse" ADD COLUMN "userId" TEXT;
-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable SurveyResponse
ALTER TABLE "SurveyResponse" ADD COLUMN "userId" TEXT;
-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
