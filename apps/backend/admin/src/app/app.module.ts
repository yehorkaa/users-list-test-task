import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import postgresConfig from './configs/postgres.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['apps/backend/admin/.env'],
      isGlobal: true,
      load: [postgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (postgresConfiguration: ConfigType<typeof postgresConfig>) => {
        return {
          type: 'postgres',
          host: postgresConfiguration.host,
          port: postgresConfiguration.port,
          username: postgresConfiguration.username,
          password: postgresConfiguration.password,
          database: postgresConfiguration.database,
          autoLoadEntities: true,
          synchronize: postgresConfiguration.synchronize,
        };
      },
      inject: [postgresConfig.KEY],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
