import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() // если мы импортируем модуль раз, то не нужно его импортировать в других модулях при импорте его в AppModule
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
