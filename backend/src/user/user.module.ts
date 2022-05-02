import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Meal } from 'src/meals/entities/meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Meal])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
