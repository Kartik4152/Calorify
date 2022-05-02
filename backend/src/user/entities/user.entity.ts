import { ApiProperty } from '@nestjs/swagger';
import { Meal } from 'src/meals/entities/meal.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '1' })
  id: number;

  @Column()
  @ApiProperty({ example: 'Your_email@emailprovider.com' })
  email: string;

  @Column()
  @ApiProperty({ example: 'Your name' })
  name: string;

  @Column()
  @ApiProperty({ example: 'Your password' })
  password: string;

  @Column()
  @ApiProperty({ example: 2000 })
  calorielimit: number;

  @Column()
  @ApiProperty({ example: 'user|mod|admin' })
  role: string;

  @OneToMany((type) => Meal, (meal) => meal.user, { cascade: true })
  @ApiProperty({ isArray: true, type: () => Meal })
  meals: Meal[];
}
