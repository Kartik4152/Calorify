import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from 'src/meals/entities/meal.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { CreateMealDto } from 'src/meals/dto/create-meal.dto';
import { UpdateMealDto } from 'src/meals/dto/update-meal.dto';

const bcrypt = require('bcrypt');

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async changerole(id: number, new_role: string): Promise<{ role: string }> {
    let user = await this.userRepo.findOne(id);
    if (!user)
      throw new HttpException('User Doesnt Exist!', HttpStatus.NOT_FOUND);
    user.role = new_role;
    await this.userRepo.save(user);
    return { role: new_role };
  }
  async findUser(id: number): Promise<User> {
    return this.userRepo.findOne(id);
  }
  async findUserEmail(email: string): Promise<User> {
    let user = await this.userRepo.findOne({ email }, { relations: ['meals'] });
    if (!user)
      throw new HttpException('User Doesnt Exist!', HttpStatus.NOT_FOUND);
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
    return user;
  }
  async getUsers(limit: number, offset: number): Promise<User[]> {
    return this.userRepo.find({
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });
  }
  async create(user: CreateUserDto): Promise<User> {
    let created_user = await this.userRepo.create(user);
    created_user.password = bcrypt.hashSync(created_user.password, 10);
    created_user.email = created_user.email.trim().toLowerCase();
    created_user.name = created_user.name.trim();
    const present = await this.userRepo.findAndCount({ email: user.email });
    if (present[1] === 0) {
      return this.userRepo.save(created_user);
    } else {
      throw new HttpException('Email Already In Use', HttpStatus.CONFLICT);
    }
  }
  async update(user: UpdateUserDto): Promise<User> {
    let old_user = await this.userRepo.findOne(user.id);
    if (!old_user)
      throw new HttpException('User Doesnt Exist!', HttpStatus.NOT_FOUND);
    if (user.password) user.password = bcrypt.hashSync(user.password, 10);
    let nu = this.userRepo.create(user);
    return this.userRepo.save(nu);
  }
  async delete(id: number): Promise<User> {
    let user = await this.userRepo.findOne(id);
    if (!user)
      throw new HttpException("User Doesn't Exist!", HttpStatus.NOT_FOUND);
    return this.userRepo.remove(user);
  }

  async createMeal(userid: number, meal: CreateMealDto): Promise<Meal> {
    let new_meal = this.mealRepo.create(meal);
    let user = await this.userRepo.findOne({ id: userid });
    if (!user)
      throw new HttpException("User Doesn't Exist!", HttpStatus.NOT_FOUND);
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
    if (!user)
      throw new HttpException("User Doesn't Exist!", HttpStatus.NOT_FOUND);
    let meals = user.meals;
    user = await this.userRepo.findOne({ id: userid });
    meals = meals.map((meal) => ({ ...meal, user }));
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
    let end: number = Number(offset) + Number(limit);
    return meals.slice(offset, end);
  }
  async updateMeal(new_meal: UpdateMealDto): Promise<Meal> {
    let meal = await this.mealRepo.findOne(new_meal.id);
    if (!meal)
      throw new HttpException('Meal Doesnt Exist!', HttpStatus.NOT_FOUND);
    let nm = this.mealRepo.create(new_meal);
    return this.mealRepo.save(nm);
  }

  async deleteMeal(mealid: number): Promise<Meal> {
    let meal = await this.mealRepo.findOne(mealid);
    if (!meal)
      throw new HttpException('Meal Doesnt Exist!', HttpStatus.NOT_FOUND);
    return this.mealRepo.remove(meal);
  }
}
