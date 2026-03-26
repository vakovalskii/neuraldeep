-- AlterTable
ALTER TABLE "Skill" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'skill';

-- CreateIndex
CREATE INDEX "Skill_type_idx" ON "Skill"("type");
