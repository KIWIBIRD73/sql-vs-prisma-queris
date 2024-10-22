import { Injectable, Logger } from '@nestjs/common';
import dbData from '../data/db-data.json';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class InitializeDbService {
  private readonly logger = new Logger('InitializeDbService');
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Проверка, что кол-во полей в db-data.json равна
   * общему кол-ву строк во всех таблицах в бд
   */
  public async isDataUploaded() {
    try {
      const tableRawCount = await this.databaseService.$queryRaw<
        { table_name: string; row_count: number }[]
      >`
          SELECT table_name, 
                  (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
          FROM (
              SELECT table_name, 
                      query_to_xml(format('SELECT COUNT(*) as cnt FROM %I', table_name), false, true, '') as xml_count
              FROM information_schema.tables
              WHERE table_schema = 'public' AND table_name != '_prisma_migrations'
          ) t
      `;

      const totalDbRowsCount = tableRawCount.reduce(
        (total, current) => total + current.row_count,
        0,
      );
      const totalInitDataRowsCount = Object.values(dbData).reduce(
        (total, current) => total + current.length,
        0,
      );

      return totalDbRowsCount === totalInitDataRowsCount;
    } catch (error) {
      this.logger.debug('[isDataUploaded]', error);
      throw error;
    }
  }

  public async loadData() {
    try {
      const {
        textBodies,
        lexicons,
        morphologies,
        syntaxStructures,
        syntaxAnalyses,
        lexicalSemanticRelations,
        neuralNetworkModels,
        results,
      } = dbData;

      await this.databaseService.$transaction([
        this.databaseService.textBody.createMany({ data: textBodies }),
        this.databaseService.lexicon.createMany({ data: lexicons }),
        this.databaseService.morphology.createMany({ data: morphologies }),
        this.databaseService.syntaxStructures.createMany({ data: syntaxStructures }),
        this.databaseService.syntaxAnalyse.createMany({ data: syntaxAnalyses }),
        this.databaseService.lexicalSemanticRelations.createMany({
          data: lexicalSemanticRelations,
        }),
        this.databaseService.neuralNetworkModels.createMany({ data: neuralNetworkModels }),
        this.databaseService.results.createMany({ data: results }),
      ]);

      this.logger.verbose('[loadData] Init data successfully uploaded to db');
    } catch (error) {
      this.logger.error('[loadData]', error);
    }
  }
}
