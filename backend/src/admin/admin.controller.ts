import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiConflictResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { AdminService } from './admin.service';
import { ARolesGuard } from './role.guard';
import { User } from 'src/user/entities/user.entity';
import { Meal } from 'src/meals/entities/meal.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { CreateMealDto } from 'src/meals/dto/create-meal.dto';
import { UpdateMealDto } from 'src/meals/dto/update-meal.dto';
import { CreateSchema, UpdateSchema } from 'src/user/schema/user.schema';
import {
  CreateSchema as CreateMealSchema,
  UpdateSchema as UpdateMealSchema,
} from 'src/meals/schema/meal.schema';
import { ChangeRoleSchema } from './schemas/ChangeRole.schema';

import { UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from 'src/pipes/JoiValidation.pipe';

@ApiBearerAuth()
@UseGuards(ARolesGuard)
@UseGuards(JwtAuthGuard)
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('changeUserRole')
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 400 },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        role: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 401 },
        message: { type: 'string' },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 403 },
        message: { type: 'string' },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: '1' },
        role: { type: 'string', example: 'admin' },
      },
    },
  })
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(ChangeRoleSchema))
  changerole(@Body() body): Promise<{ role: string }> {
    return this.adminService.changerole(body.id, body.role);
  }

  @Get('users/byEmail')
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 400 },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({ type: User, isArray: true })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 401 },
        message: { type: 'string' },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 403 },
        message: { type: 'string' },
      },
    },
  })
  getUserByEmail(@Query('email') email: string): Promise<User> {
    return this.adminService.findUserEmail(email);
  }

  @Get('users')
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 400 },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({ type: User, isArray: true })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 401 },
        message: { type: 'string' },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 403 },
        message: { type: 'string' },
      },
    },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: 'number',
  })
  getUsers(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<User[]> {
    return this.adminService.getUsers(limit, offset);
  }

  @Post('users')
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 400 },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ type: User, isArray: true })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 401 },
        message: { type: 'string' },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 403 },
        message: { type: 'string' },
      },
    },
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 409 },
        message: { type: 'string' },
      },
    },
  })
  @UsePipes(new JoiValidationPipe(CreateSchema))
  create(@Body() user: CreateUserDto): Promise<User> {
    return this.adminService.create(user);
  }

  @Put('users')
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 400 },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({ type: User, isArray: true })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 401 },
        message: { type: 'string' },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 403 },
        message: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 404 },
        message: { type: 'string' },
      },
    },
  })
  @UsePipes(new JoiValidationPipe(UpdateSchema))
  update(@Body() user: UpdateUserDto): Promise<User> {
    return this.adminService.update(user);
  }

  @Delete('users/:id')
  @ApiOkResponse({ type: User, isArray: true })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 401 },
        message: { type: 'string' },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 403 },
        message: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 404 },
        message: { type: 'string' },
      },
    },
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.adminService.delete(id);
  }

  @Post('meals')
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 400 },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ type: Meal })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 401 },
        message: { type: 'string' },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 403 },
        message: { type: 'string' },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userid: { type: 'number' },
        meal: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Iced Coffee' },
            calories: { type: 'number', example: '225' },
            date: { type: 'number', example: '11' },
            month: { type: 'number', example: '11' },
            year: { type: 'number', example: '2021' },
            hour: { type: 'number', example: '13' },
            minute: { type: 'number', example: '43' },
          },
        },
      },
    },
  })
  @HttpCode(201)
  createmeal(
    @Body('meal', new JoiValidationPipe(CreateMealSchema)) meal: CreateMealDto,
    @Body('userid', ParseIntPipe) userid: number,
  ): Promise<Meal> {
    return this.adminService.createMeal(userid, meal);
  }

  @Get('meals')
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 400 },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({ type: Meal, isArray: true })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 401 },
        message: { type: 'string' },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 403 },
        message: { type: 'string' },
      },
    },
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: 'string',
    description: 'Format DD-MM-YYYY',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: 'string',
    description: 'Format DD-MM-YYYY',
  })
  @ApiQuery({
    name: 'startTime',
    required: false,
    type: 'string',
    description: 'Format HH:MM',
  })
  @ApiQuery({
    name: 'endTime',
    required: false,
    type: 'string',
    description: 'Format HH:MM',
  })
  @ApiQuery({
    name: 'userid',
    required: true,
    type: 'number',
    description: 'UserId',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: 'number',
  })
  getMeals(
    @Query('userid', ParseIntPipe) userid: number,
    @Query('startDate') start_date: string,
    @Query('startTime') start_time: string,
    @Query('endDate') end_date: string,
    @Query('endTime') end_time: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<Meal[]> {
    return this.adminService.getMeals(
      userid,
      start_date,
      start_time,
      end_date,
      end_time,
      limit,
      offset,
    );
  }

  @Put('meals')
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 400 },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({ type: Meal })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 401 },
        message: { type: 'string' },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 403 },
        message: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 404 },
        message: { type: 'string' },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: '2' },
        name: { type: 'string', example: 'Iced Coffee' },
        calories: { type: 'number', example: '225' },
        date: { type: 'number', example: '11' },
        month: { type: 'number', example: '11' },
        year: { type: 'number', example: '2021' },
        hour: { type: 'number', example: '13' },
        minute: { type: 'number', example: '43' },
      },
    },
  })
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(UpdateMealSchema))
  updateMeal(@Body() meal: UpdateMealDto): Promise<Meal> {
    return this.adminService.updateMeal(meal);
  }

  @Delete('meal/:id')
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 400 },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({ type: Meal })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 401 },
        message: { type: 'string' },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 403 },
        message: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 404 },
        message: { type: 'string' },
      },
    },
  })
  deleteMeal(@Param('id', ParseIntPipe) id: number): Promise<Meal> {
    return this.adminService.deleteMeal(id);
  }
}
