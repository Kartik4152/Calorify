import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ example: 'YourEmail@Provider.com' })
  email: string;
  @ApiProperty({ example: 'Your Password' })
  password: string;
}
