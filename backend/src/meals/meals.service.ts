import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './entities/meal.entity';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async create(userid: number, meal: CreateMealDto): Promise<Meal> {
    let new_meal = this.mealRepo.create(meal);
    let user = await this.userRepo.findOne({ id: userid });
    new_meal.user = user;
    return this.mealRepo.save(new_meal);
  }
  async getMeals(
    userid: number,
    start_date: string,
    start_time: string,
    end_date: string,
    end_time: string,
    limit: number,
    offset: number,
  ): Promise<Meal[]> {
    let user = await this.userRepo.findOne(
      { id: userid },
      { relations: ['meals'] },
    );

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

    let meals = user.meals;
    // user = await this.userRepo.findOne({ id: userid });
    // meals = meals.map((meal) => ({ ...meal, user }));

    // sort meals in DESC order
    meals.sort((mealA, mealB) => {
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
    // if date filters were sent
    if (start_date && end_date) {
      // date -> [date,month,year]
      let s_date = start_date.split('-').map((ele) => parseInt(ele));
      let e_date = end_date.split('-').map((ele) => parseInt(ele));
      meals = meals.filter((meal) => {
        // check if meal lies between given dates
        let meal_date = new Date(meal.year, meal.month - 1, meal.date);
        let start_date = new Date(s_date[2], s_date[1] - 1, s_date[0]);
        let end_date = new Date(e_date[2], e_date[1] - 1, e_date[0]);
        if (meal_date >= start_date && meal_date <= end_date) return true;
        return false;
      });
    }

    // if time filters were sent
    if (start_time && end_time) {
      // time -> [hours,minutes]
      let s_time = start_time.split(':').map((ele) => parseInt(ele));
      let e_time = end_time.split(':').map((ele) => parseInt(ele));
      meals = meals.filter((meal) => {
        if (
          meal.hour * 60 + meal.minute >= s_time[0] * 60 + s_time[1] &&
          meal.hour * 60 + meal.minute <= e_time[0] * 60 + e_time[1]
        )
          return true;
        return false;
      });
    }
    if (limit == 0 || limit == undefined) limit = 99999999999;
    if (limit < 0) limit = 0;
    if (offset == undefined) offset = 0;
    if (offset < 0) offset = 0;
    let end: number = Number(limit) + Number(offset);
    return meals.slice(offset, end);
  }

  async update(userid: number, new_meal: UpdateMealDto): Promise<Meal> {
    // find user who sent request
    let user = await this.userRepo.findOne(userid, { relations: ['meals'] });
    // find original meal
    let meal = user.meals.find((ml) => ml.id == new_meal.id);
    if (!meal)
      throw new HttpException('Meal Doesnt Exist!', HttpStatus.NOT_FOUND);
    let nm = this.mealRepo.create(new_meal);
    return this.mealRepo.save(nm);
  }

  async delete(userid: number, mealid: number): Promise<Meal> {
    let user = await this.userRepo.findOne(userid, { relations: ['meals'] });
    let meal = user.meals.find((meal) => meal.id == mealid);
    if (!meal)
      throw new HttpException('Meal Doesnt Exist!', HttpStatus.NOT_FOUND);
    return this.mealRepo.remove(meal);
  }
}
