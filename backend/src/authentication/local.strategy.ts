import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { User } from 'src/user/entities/user.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // initialize authenticationService, set userNamefield to use email instead
  constructor(private authenticationService: AuthenticationService) {
    super({ usernameField: 'email' });
  }
  // get email, password from request body and login if password matches
  async validate(
    email: string,
    password: string,
  ): Promise<User | HttpException> {
    email = email.toLowerCase();
    const user = await this.authenticationService.findUser(email);
    // if user not found
    if (!user) {
      throw new HttpException(
        'No user found with given email',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return user;
    } else {
      throw new HttpException(
        'Please check your email/password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
