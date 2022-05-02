import { ApiProperty } from '@nestjs/swagger';

export class SignupDTO {
  @ApiProperty({ example: 'signupemail@provider.com' })
  email: string;
  @ApiProperty({ example: 'Firstname Lastname' })
  name: string;
  @ApiProperty({ example: 'Your Password' })
  password: string;
}
