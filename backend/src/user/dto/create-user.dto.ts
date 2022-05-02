import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
