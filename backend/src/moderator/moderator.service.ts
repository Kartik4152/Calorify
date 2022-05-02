import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

const bcrypt = require('bcrypt');

@Injectable()
export class ModeratorService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  finduser(id: number): Promise<User | undefined> {
    return this.userRepo.findOne(id);
  }
  async finduseremail(email: string): Promise<User | undefined> {
    let user = this.userRepo.findOne({ email });
    if (!user)
      throw new HttpException('User Doesnt Exist!', HttpStatus.NOT_FOUND);
    return user;
  }
  async getUsers(offset: number, limit: number): Promise<User[]> {
    const [users, count] = await this.userRepo.findAndCount({
      order: { id: 'ASC' },
      skip: offset,
      take: limit,
    });
    return users;
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
    if (old_user.role == 'admin')
      throw new HttpException('Cannot Update Admin', HttpStatus.FORBIDDEN);
    if (user.password) user.password = bcrypt.hashSync(user.password, 10);
    let nu = this.userRepo.create(user);
    return this.userRepo.save(nu);
  }
  async delete(id: number): Promise<User> {
    let user = await this.userRepo.findOne(id);
    if (!user)
      throw new HttpException("User Doesn't Exist!", HttpStatus.NOT_FOUND);
    if (user.role == 'admin')
      throw new HttpException('Cannot Delete Admin', HttpStatus.FORBIDDEN);
    return this.userRepo.remove(user);
  }
}
