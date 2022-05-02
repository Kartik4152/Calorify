import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 3 })
  id: number;
  @ApiProperty({ example: 'youremail@provider.com' })
  email: string;
  @ApiProperty({ example: 'Firstname Lastname' })
  name: string;
  @ApiProperty({ example: 'Your password' })
  password: string;
  @ApiProperty({ example: 'user' })
  role: string;
  @ApiProperty({ example: 2000 })
  calorielimit: number;
}
