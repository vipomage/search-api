import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      database: process.env.DB_NAME,
      // password: process.env.DB_PASS,
      entities: ['./**/*.entity.js'],
      logging: 'all',
      synchronize: true, // Update Tables for Entity Changes
      dropSchema: false, // Wipe DB Data on every Launch OR Compilation
    }),
  ],
})
export class ConfigModule {}
