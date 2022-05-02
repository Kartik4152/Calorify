import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findOne(email: string): Promise<User | undefined> {
    let user = await this.userRepo.findOne({ email }, { relations: ['meals'] });
    user.meals.sort((mealA, mealB) => {
      let d1 = new Date(
        mealA.year,
        mealA.month - 1,
        mealA.date,
        mealA.hour,
        mealA.minute,
      );
      let d2 = new Date(
        mealB.year,
        mealB.month - 1,
        mealB.date,
        mealB.hour,
        mealB.minute,
      );
      if (d1 > d2) return -1;
      else return 1;
    });
    if (user.meals.length) {
      let i = 0,
        j;
      let total = user.meals[i].calories;
      for (j = 1; j < user.meals.length; ++j) {
        if (
          user.meals[j].date === user.meals[j - 1].date &&
          user.meals[j].month === user.meals[j - 1].month &&
          user.meals[j].year === user.meals[j - 1].year
        )
          total += user.meals[j].calories;
        else {
          for (let k = i; k < j; ++k) user.meals[k].totalforday = total;
          total = user.meals[j].calories;
          i = j;
        }
      }
      for (let k = i; k < j; ++k) user.meals[k].totalforday = total;
    }
    return user;
  }
  findOneId(id: number): Promise<User | undefined> {
    return this.userRepo.findOne(id);
  }

  async updateCalorieLimit(
    email: string,
    calories: number,
  ): Promise<{ calorielimit: number }> {
    if (calories <= 0 || calories > 100000)
      throw new HttpException(
        'Calorielimit Should be between 1 and 100000',
        HttpStatus.BAD_REQUEST,
      );
    let user = await this.userRepo.findOne({ email });
    user.calorielimit = calories;
    await this.userRepo.save(user);
    return { calorielimit: calories };
  }

  async getCalorieLimit(email: string): Promise<{ calorielimit: number }> {
    let user = await this.userRepo.findOne({ email });
    return { calorielimit: user.calorielimit };
  }
}
