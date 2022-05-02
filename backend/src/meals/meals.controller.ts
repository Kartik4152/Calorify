import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  UsePipes,
  HttpCode,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { Meal } from './entities/meal.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JoiValidationPipe } from 'src/pipes/JoiValidation.pipe';
import { CreateSchema, UpdateSchema } from './schema/meal.schema';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Meals')
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}
  @Post('')
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
  @HttpCode(201)
  @UsePipes(new JoiValidationPipe(CreateSchema))
  create(@Body() meal: CreateMealDto, @Req() req): Promise<Meal> {
    return this.mealsService.create(req.user.id, meal);
  }

  @Get('')
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
    @Req() req,
    @Query('startDate') start_date: string,
    @Query('startTime') start_time: string,
    @Query('endDate') end_date: string,
    @Query('endTime') end_time: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<Meal[]> {
    return this.mealsService.getMeals(
      req.user.id,
      start_date,
      start_time,
      end_date,
      end_time,
      limit,
      offset,
    );
  }
  @Put('')
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
  @HttpCode(201)
  @UsePipes(new JoiValidationPipe(UpdateSchema))
  updateMeal(@Req() req, @Body() meal: UpdateMealDto): Promise<Meal> {
    return this.mealsService.update(req.user.id, meal);
  }
  @Delete(':id')
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
  deleteMeal(@Req() req, @Param('id', ParseIntPipe) id: number): Promise<Meal> {
    return this.mealsService.delete(req.user.id, id);
  }
}
