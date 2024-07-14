import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { MainDBModels, MainDBModel } from './main-db';
export class DB extends MongooseModule {
  static mainDb(): DynamicModule {
    return this.dbConnectAsync(
      'MAIN_DB_PATH',
      this.getDBUri('Web_Firm'),
      'Web_Firm',
    );
  }
  static mainDbModels(modelNames: MainDBModel[]): DynamicModule {
    return DB.forFeatureModels(modelNames, MainDBModels, 'Web_Firm');
  }

  static forFeatureModels(
    modelNames: any[],
    models: any[],
    dbName: string,
  ): DynamicModule {
    const _models = models
      .filter((x) => modelNames.indexOf(x.name) > -1)
      .map((item) => ({
        ...item,
        collection: item.collection || item.name,
      }));
    return super.forFeature(_models, dbName);
  }

  static dbConnectAsync(
    env,
    dbname,
    connectionName,
    options?: MongooseModuleAsyncOptions,
  ): DynamicModule {
    return DB.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(env) + '/' + dbname,
      }),
      inject: [ConfigService],
      connectionName: connectionName,
      ...options,
    });
  }

  static getDBUri = (dbName: string) => {
    if (process.env.MONGO_DB_QUERY && process.env.MONGO_DB_QUERY !== '') {
      return `${dbName}${process.env.MONGO_DB_QUERY}`;
    }

    return dbName;
  };
}
