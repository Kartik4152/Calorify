import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { MealsModule } from './meals/meals.module';
import { UserModule } from './user/user.module';
import { ModeratorModule } from './moderator/moderator.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite3',
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    AuthenticationModule,
    MealsModule,
    UserModule,
    ModeratorModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
