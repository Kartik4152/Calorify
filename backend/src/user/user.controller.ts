import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @ApiOkResponse({ type: User })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', default: 403 },
        message: { type: 'string' },
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
  getUser(@Req() req): Promise<User> {
    return this.userService.findOne(req.user.email);
  }
  @Post('calorielimit')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        calorielimit: {
          type: 'number',
          example: 1500,
        },
      },
    },
  })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        calorielimit: {
          type: 'number',
          example: 2000,
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
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', default: 403 },
        message: { type: 'string' },
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
  @HttpCode(201)
  setCalorieLimit(
    @Req() req,
    @Body('calorielimit', ParseIntPipe)
    calories: number,
  ): Promise<{ calorielimit: number }> {
    return this.userService.updateCalorieLimit(req.user.email, calories);
  }

  @Get('calorielimit')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        calorieLimit: {
          type: 'number',
          example: 2000,
        },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', default: 403 },
        message: { type: 'string' },
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
  getCalorieLimit(@Req() req): Promise<{ calorielimit: number }> {
    return this.userService.getCalorieLimit(req.user.email);
  }
}
