/*
  Warnings:

  - You are about to drop the `Description` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Description" DROP CONSTRAINT "Description_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_product_id_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToTag" DROP CONSTRAINT "_ProductToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToTag" DROP CONSTRAINT "_ProductToTag_B_fkey";

-- DropTable
DROP TABLE "Description";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_ProductToTag";

-- DropEnum
DROP TYPE "Availability";

-- CreateTable
CREATE TABLE "TextBody" (
    "TextID" SERIAL NOT NULL,
    "TextName" TEXT NOT NULL,
    "Genre" TEXT,
    "TextLanguage" TEXT NOT NULL,
    "WordCount" INTEGER NOT NULL DEFAULT 0,
    "AdditionDate" TIMESTAMP(3),
    "Teaching" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TextBody_pkey" PRIMARY KEY ("TextID")
);

-- CreateTable
CREATE TABLE "Lexicon" (
    "WordID" SERIAL NOT NULL,
    "Word" TEXT NOT NULL,
    "Lemma" TEXT NOT NULL,
    "SpeechPart" TEXT,
    "MorphologyChar" TEXT,
    "Frequency" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Lexicon_pkey" PRIMARY KEY ("WordID")
);

-- CreateTable
CREATE TABLE "Morphology" (
    "RuleID" SERIAL NOT NULL,
    "SpeechPart" TEXT,
    "RuleDescription" TEXT NOT NULL,
    "RuleExampleId" INTEGER,

    CONSTRAINT "Morphology_pkey" PRIMARY KEY ("RuleID")
);

-- CreateTable
CREATE TABLE "SyntaxStructures" (
    "StructureID" SERIAL NOT NULL,
    "StructureDescription" TEXT NOT NULL,
    "StructureExample" TEXT,

    CONSTRAINT "SyntaxStructures_pkey" PRIMARY KEY ("StructureID")
);

-- CreateTable
CREATE TABLE "SyntaxAnalyse" (
    "AnalyseID" SERIAL NOT NULL,
    "TextId" INTEGER NOT NULL,
    "StructureId" INTEGER NOT NULL,
    "Description" TEXT,

    CONSTRAINT "SyntaxAnalyse_pkey" PRIMARY KEY ("AnalyseID")
);

-- CreateTable
CREATE TABLE "LexicalSemanticRelations" (
    "Word1Id" INTEGER NOT NULL,
    "Word2Id" INTEGER NOT NULL,
    "RelationType" TEXT NOT NULL,

    CONSTRAINT "LexicalSemanticRelations_pkey" PRIMARY KEY ("Word1Id","Word2Id")
);

-- CreateTable
CREATE TABLE "NeuralNetworkModels" (
    "ModelID" SERIAL NOT NULL,
    "Description" TEXT NOT NULL,
    "Algorithm" TEXT NOT NULL,
    "LanguagePair" TEXT NOT NULL,
    "Purpose" TEXT,

    CONSTRAINT "NeuralNetworkModels_pkey" PRIMARY KEY ("ModelID")
);

-- CreateTable
CREATE TABLE "Results" (
    "ResultID" SERIAL NOT NULL,
    "ModelId" INTEGER NOT NULL,
    "TextId" INTEGER NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Results_pkey" PRIMARY KEY ("ResultID")
);

-- CreateIndex
CREATE UNIQUE INDEX "TextBody_TextName_key" ON "TextBody"("TextName");

-- CreateIndex
CREATE UNIQUE INDEX "Lexicon_Word_key" ON "Lexicon"("Word");

-- CreateIndex
CREATE UNIQUE INDEX "NeuralNetworkModels_Algorithm_key" ON "NeuralNetworkModels"("Algorithm");

-- AddForeignKey
ALTER TABLE "Morphology" ADD CONSTRAINT "Morphology_RuleExampleId_fkey" FOREIGN KEY ("RuleExampleId") REFERENCES "Lexicon"("WordID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyntaxAnalyse" ADD CONSTRAINT "SyntaxAnalyse_TextId_fkey" FOREIGN KEY ("TextId") REFERENCES "TextBody"("TextID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyntaxAnalyse" ADD CONSTRAINT "SyntaxAnalyse_StructureId_fkey" FOREIGN KEY ("StructureId") REFERENCES "SyntaxStructures"("StructureID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LexicalSemanticRelations" ADD CONSTRAINT "LexicalSemanticRelations_Word1Id_fkey" FOREIGN KEY ("Word1Id") REFERENCES "Lexicon"("WordID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LexicalSemanticRelations" ADD CONSTRAINT "LexicalSemanticRelations_Word2Id_fkey" FOREIGN KEY ("Word2Id") REFERENCES "Lexicon"("WordID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Results" ADD CONSTRAINT "Results_ModelId_fkey" FOREIGN KEY ("ModelId") REFERENCES "NeuralNetworkModels"("ModelID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Results" ADD CONSTRAINT "Results_TextId_fkey" FOREIGN KEY ("TextId") REFERENCES "TextBody"("TextID") ON DELETE RESTRICT ON UPDATE CASCADE;
