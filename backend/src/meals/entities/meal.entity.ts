import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'meal_name' })
  name: string;

  @Column()
  @ApiProperty({ example: 285 })
  calories: number;

  @Column()
  @ApiProperty({ example: 11 })
  date: number;

  @Column()
  @ApiProperty({ example: 11 })
  month: number;

  @Column()
  @ApiProperty({ example: 2021 })
  year: number;

  @Column()
  @ApiProperty({ example: 18 })
  hour: number;

  @Column()
  @ApiProperty({ example: 30 })
  minute: number;

  @ManyToOne((type) => User, (user) => user.meals, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => User })
  user: User;

  totalforday: number;
}
