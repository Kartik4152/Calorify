import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupDTO } from './dto/Signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { configConstants } from './constants';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signup(user: SignupDTO): Promise<User> {
    user.email = user.email.toLowerCase().trim();
    user.name = user.name.trim();
    user.password = bcrypt.hashSync(user.password, 10);
    const present = await this.userRepo.findAndCount({ email: user.email });
    if (present[1] === 0) {
      const created_user = this.userRepo.create(user);
      created_user.calorielimit = configConstants.calorielimit;
      created_user.role = configConstants.role;
      return this.userRepo.save(created_user);
    } else {
      throw new HttpException('Email Already In Use', HttpStatus.CONFLICT);
    }
  }
  findUser(email: string): Promise<User> {
    return this.userRepo.findOne({ email });
  }
  generateJWT(user: User) {
    const payload = { email: user.email, id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
