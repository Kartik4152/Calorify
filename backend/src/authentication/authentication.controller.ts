import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Request,
  HttpException,
  UsePipes,
  Get,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { User } from 'src/user/entities/user.entity';
import { SignupDTO } from './dto/Signup.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { JoiValidationPipe } from 'src/pipes/JoiValidation.pipe';
import { SignupSchema, LoginSchema } from 'src/user/schema/user.schema';
import { LoginDTO } from './dto/Login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('authentication')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('/signup')
  @ApiCreatedResponse({ type: CreateUserDto })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', default: 409 },
        message: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', default: 400 },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @HttpCode(201)
  @UsePipes(new JoiValidationPipe(SignupSchema))
  signup(@Body() body: SignupDTO): Promise<User | HttpException> {
    return this.authenticationService.signup(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', default: 400 },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', default: 401 },
        message: { type: 'string' },
      },
    },
  })
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(LoginSchema))
  login(@Request() req, @Body() body: LoginDTO): any {
    return this.authenticationService.generateJWT(req.user);
  }
}
