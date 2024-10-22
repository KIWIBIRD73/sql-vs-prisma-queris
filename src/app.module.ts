import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { InitializeDbService } from './initialize-db/initialize-db.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService, InitializeDbService],
})
export class AppModule {}
