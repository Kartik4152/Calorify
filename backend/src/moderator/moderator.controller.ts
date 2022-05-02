import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  ParseIntPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { MRolesGuard } from './role.guard';
import { User } from 'src/user/entities/user.entity';
import { JoiValidationPipe } from 'src/pipes/JoiValidation.pipe';
import { CreateSchema, UpdateSchema } from 'src/user/schema/user.schema';
import { number, required } from 'joi';

@ApiBearerAuth()
@UseGuards(MRolesGuard)
@UseGuards(JwtAuthGuard)
@ApiTags('Moderator')
@Controller('moderator')
export class ModeratorController {
  constructor(private readonly moderatorService: ModeratorService) {}

  @Get('user')
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
    name: 'email',
    required: true,
    type: 'string',
  })
  getuserbyemail(@Query('email') email: string): Promise<User> {
    return this.moderatorService.finduseremail(email);
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
    name: 'offset',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
  })
  getUsers(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<User[]> {
    return this.moderatorService.getUsers(offset, limit);
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
    return this.moderatorService.create(user);
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
    return this.moderatorService.update(user);
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
    return this.moderatorService.delete(id);
  }
}
