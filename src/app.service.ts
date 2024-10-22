import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InitializeDbService } from './initialize-db/initialize-db.service';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger('AppService');
  constructor(
    private readonly initDbService: InitializeDbService,
    private readonly databaseService: DatabaseService,
  ) {}

  async onModuleInit() {
    const isDataUploaded = await this.initDbService.isDataUploaded();
    if (isDataUploaded) return;
    this.initDbService.loadData();
  }

  public async getNeuralNetworkModels() {
    try {
      return this.databaseService.$queryRaw`SELECT * FROM "NeuralNetworkModels"`;

      return await this.databaseService.neuralNetworkModels.findMany({});
    } catch (error) {
      this.logger.error('[getNeuralNetworkModels]', error);
      throw new BadRequestException();
    }
  }

  public async getNeuralNetworkModelsRowsCount() {
    try {
      return await this.databaseService.$queryRaw`SELECT COUNT(*) FROM "NeuralNetworkModels"`;

      return await this.databaseService.neuralNetworkModels.count();
    } catch (error) {
      this.logger.error('[getNeuralNetworkModelsRowsCount]', error);
      throw new BadRequestException();
    }
  }

  public async getAlgorithms() {
    try {
      return await this.databaseService.$queryRaw`SELECT "Algorithm" FROM "NeuralNetworkModels"`;

      return this.databaseService.neuralNetworkModels.findMany({
        select: {
          Algorithm: true,
        },
      });
    } catch (error) {
      this.logger.error('[getAlgorithms]', error);
      throw new BadRequestException();
    }
  }

  public async getGptAlgorithms() {
    try {
      return await this.databaseService
        .$queryRaw`SELECT "Algorithm" FROM "NeuralNetworkModels" WHERE "Algorithm" LIKE 'GPT%'`;

      return await this.databaseService.neuralNetworkModels.findMany({
        where: {
          Algorithm: {
            startsWith: 'GPT',
          },
        },
        select: {
          Algorithm: true,
        },
      });
    } catch (error) {
      this.logger.error('[getGptAlgorithms]', error);
      throw new BadRequestException();
    }
  }

  /**
   * такой запрос можно реализовать только используя raw query
   */
  public async getAlgorithmLengthLess5() {
    try {
      return await this.databaseService
        .$queryRaw`SELECT "Algorithm" FROM "NeuralNetworkModels" WHERE LENGTH("Algorithm") <= 5`;
    } catch (error) {
      this.logger.error('[getAlgorithmLengthLess5]', error);
      throw new BadRequestException();
    }
  }

  /**
   * такой запрос можно реализовать только используя raw query
   */
  public async getSortedAlgorithms() {
    try {
      const rawQueryResult = await this.databaseService
        .$queryRaw`SELECT * FROM "NeuralNetworkModels" ORDER BY LENGTH("Algorithm") DESC`;

      return rawQueryResult;
    } catch (error) {
      this.logger.error('[getSortedAlgorithms]', error);
      throw new BadRequestException();
    }
  }

  public async getCountOfRussianEnglishModels() {
    try {
      type RawQueryResultType = { count: BigInt }[];
      const rawQueryResponse = await this.databaseService
        .$queryRaw<RawQueryResultType>`SELECT COUNT(*) as count FROM "NeuralNetworkModels" WHERE "LanguagePair" = 'русский-английский'`;

      return Number(rawQueryResponse[0].count);

      return await this.databaseService.neuralNetworkModels.count({
        where: {
          LanguagePair: 'русский-английский',
        },
      });
    } catch (error) {
      this.logger.error('[getCountOfRussianEnglishModels]', error);
      throw new BadRequestException();
    }
  }

  public async getCountOfLanguagePairs() {
    try {
      type RawQueryResultType = { languagePair: string; count_languagepair: BigInt }[];
      const rawQueryResult = await this.databaseService.$queryRaw<RawQueryResultType>`
        SELECT "LanguagePair" AS languagePair, COUNT(*) AS count_languagepair
        FROM "NeuralNetworkModels"
        GROUP BY "LanguagePair"
      `;

      return rawQueryResult.map((result) => ({
        ...result,
        count_languagepair: Number(result.count_languagepair),
      }));

      return await this.databaseService.neuralNetworkModels.groupBy({
        by: ['LanguagePair'],
        _count: {
          LanguagePair: true,
        },
      });
    } catch (error) {
      this.logger.error('[getCountOfLanguagePairs]', error);
      throw new BadRequestException();
    }
  }

  public async getTopSpeechParts() {
    try {
      type RawQueryResultType = { speechPart: string; values_count: BigInt }[];
      const rawQueryResult = await this.databaseService.$queryRaw<RawQueryResultType>`
        SELECT "SpeechPart" AS speechPart, COUNT(*) AS values_count
        FROM "Morphology"
        GROUP BY "SpeechPart"
        ORDER BY values_count DESC
        LIMIT 3
      `;

      return rawQueryResult.map((result) => ({
        ...result,
        values_count: Number(result.values_count),
      }));

      return await this.databaseService.morphology.groupBy({
        by: ['SpeechPart'],
        _count: {
          SpeechPart: true,
        },
        orderBy: {
          _count: {
            SpeechPart: 'desc',
          },
        },
        take: 3,
      });
    } catch (error) {
      this.logger.error('[getTopSpeechParts]', error);
      throw new BadRequestException();
    }
  }

  public async getSumOfRuleExample() {
    try {
      const rawQueryResult = await this.databaseService.$queryRaw<{ totalRules: BigInt }[]>`
        SELECT Morphology."SpeechPart", COUNT(Lexicon."SpeechPart") AS "totalRules"
        FROM "Morphology" AS Morphology
        JOIN "Lexicon" AS Lexicon ON Morphology."SpeechPart" = Lexicon."SpeechPart"
        GROUP BY Morphology."SpeechPart"
      `;

      return rawQueryResult.map((result) => ({ ...result, totalRules: Number(result.totalRules) }));
    } catch (error) {
      this.logger.error('[getSumOfRuleExample]', error);
      throw new BadRequestException();
    }
  }

  public async getSumRuleExampleBySpeechPart() {
    try {
      type RawQueryResultType = { speechPart: string; total_sum: BigInt }[];
      const rawQueryResult = await this.databaseService.$queryRaw<RawQueryResultType>`
        SELECT Morphology."SpeechPart", COUNT(Lexicon."SpeechPart") AS "total_sum"
        FROM "Morphology" AS Morphology
        JOIN "Lexicon" AS Lexicon ON Morphology."SpeechPart" = Lexicon."SpeechPart"
        GROUP BY Morphology."SpeechPart"
        HAVING COUNT(Lexicon."SpeechPart") > 10
      `;

      return rawQueryResult.map((result) => ({ ...result, total_sum: Number(result.total_sum) }));
    } catch (error) {
      this.logger.error('[getSumRuleExampleBySpeechPart]', error);
      throw new BadRequestException();
    }
  }

  public async getCountSimpleOrComplexSentences() {
    try {
      const rawQueryResult = await this.databaseService.$queryRaw<{ count: BigInt }[]>`
        SELECT COUNT(*) AS count
        FROM "SyntaxAnalyse"
        WHERE "Description" IN ('Простое предложение', 'Сложное предложение')
      `;

      return rawQueryResult.map((result) => ({ ...result, count: Number(result.count) }));

      return await this.databaseService.syntaxAnalyse.count({
        where: {
          OR: [{ Description: 'Простое предложение' }, { Description: 'Сложное предложение' }],
        },
      });
    } catch (error) {
      this.logger.error('[getCountSimpleOrComplexSentences]', error);
      throw new BadRequestException();
    }
  }

  public async getRomansInEnglish() {
    try {
      return await this.databaseService.$queryRaw`
        SELECT *
        FROM "TextBody"
        WHERE "Genre" = 'Роман' AND "TextLanguage" = 'Английский'
      `;

      return await this.databaseService.textBody.findMany({
        where: {
          Genre: 'Роман',
          TextLanguage: 'Английский',
        },
      });
    } catch (error) {
      this.logger.error('[getRomansInEnglish]', error);
      throw new BadRequestException();
    }
  }

  public async getAverageWordCount() {
    try {
      return await this.databaseService.$queryRaw`
        SELECT "Genre", "TextLanguage", AVG("WordCount") as "meanWordCount"
        FROM "TextBody"
        WHERE "Genre" = 'Роман' AND "TextLanguage" IN ('Русский', 'Английский')
        GROUP BY "Genre", "TextLanguage"
      `;

      return await this.databaseService.textBody.groupBy({
        by: ['Genre', 'TextLanguage'],
        _avg: {
          WordCount: true,
        },
        where: {
          Genre: 'Роман',
          TextLanguage: {
            in: ['Русский', 'Английский'],
          },
        },
      });
    } catch (error) {
      this.logger.error('[getAverageWordCount]', error);
      throw new BadRequestException();
    }
  }

  public async getLargestWordCount() {
    try {
      return await this.databaseService.$queryRaw`
        SELECT "TextID", "TextName", "WordCount"
        FROM "TextBody"
        ORDER BY "WordCount" DESC
        LIMIT 1
      `;

      return await this.databaseService.textBody.findFirst({
        orderBy: {
          WordCount: 'desc',
        },
        select: {
          TextID: true,
          TextName: true,
          WordCount: true,
        },
      });
    } catch (error) {
      this.logger.error('[getLargestWordCount]', error);
      throw new BadRequestException();
    }
  }

  public async getDoubleMinWords() {
    try {
      return this.databaseService.$queryRaw`
        SELECT * FROM "TextBody" AS TextBody
        WHERE "WordCount" > (
          SELECT MIN("WordCount") * 2
          FROM "TextBody"
          WHERE "Genre" = 'Роман'
        );
      `;
    } catch (error) {
      this.logger.error('[getWordCountGreaterThanMinPrisma]', error);
      throw new BadRequestException();
    }
  }

  public async getSecondLargestText() {
    try {
      return await this.databaseService.$queryRaw`
        SELECT * FROM "TextBody"
        ORDER BY "WordCount" DESC
        OFFSET 1 LIMIT 1;
      `;

      return await this.databaseService.textBody.findMany({
        orderBy: {
          WordCount: 'desc',
        },
        skip: 1,
        take: 1,
      });
    } catch (error) {
      this.logger.error('[getSecondLargestText]', error);
      throw new BadRequestException();
    }
  }

  public async getAllGenres() {
    try {
      return await this.databaseService.$queryRaw`
        SELECT DISTINCT "Genre" FROM "TextBody" WHERE "Genre" IS NOT NULL;
      `;

      return await this.databaseService.textBody.findMany({
        select: {
          Genre: true,
        },
        distinct: ['Genre'],
        where: {
          Genre: {
            not: null,
          },
        },
      });
    } catch (error) {
      this.logger.error('[getAllGenres]', error);
      throw new BadRequestException();
    }
  }

  public async getTextsAfter2020() {
    try {
      return await this.databaseService.$queryRaw`
        SELECT * FROM "TextBody" WHERE "AdditionDate" > '2020-01-01';
      `;

      return await this.databaseService.textBody.findMany({
        where: {
          AdditionDate: {
            gt: new Date('2020-01-01'),
          },
        },
      });
    } catch (error) {
      this.logger.error('[getTextsAfter2020]', error);
      throw new BadRequestException();
    }
  }

  /**
   * CTE (Common Table Expressions)
   */
  public async getRareGenreTexts() {
    try {
      return await this.databaseService.$queryRaw`
        WITH genre_counts AS (
            SELECT
                "Genre",
                COUNT(*) AS genre_count,
                AVG("WordCount") AS average_word_count
            FROM
                "TextBody"
            GROUP BY
                "Genre"
        ),
        min_counts AS (
            SELECT
                "Genre",
                genre_count,
                average_word_count
            FROM
                genre_counts
            WHERE
                genre_count = (SELECT MIN(genre_count) FROM genre_counts)
        )
        SELECT
            "TextBody".*
        FROM
            "TextBody"
        JOIN
            min_counts ON "TextBody"."Genre" = min_counts."Genre";
      `;
    } catch (error) {
      this.logger.error('[getRareGenreTexts]', error);
      throw new BadRequestException();
    }
  }
}
