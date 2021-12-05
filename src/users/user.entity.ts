import { Exclude } from 'class-transformer'
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  /**
   * Circular dependency explained:
   * We import Report entity in the User entity file and import User entity in the Report entity
   * file. This is called circular dependency. When that happens only of them exist at one
   * particular time and the other is undefined while the files are being loaded. You can test this
   * by writing console.log(Report) in the user.entity file and console.log(User) in the
   * report.entity file. Only of them will be defined and the other will print undefined.
   *
   * Due to this circular dependency, we can't directly make reference to the Report entity inside
   * the User entity file and vice versa. To solve this problem, we wrap the Report entity in a
   * function () => Report. Once both these files get executed, only after that at some point in
   * time in the future when our code is actually running and we need to actually figure out what
   * is meant by this relationship does this function gets executed. And at that point in time the
   * User and Report in the other file will actually be defined.
   */
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
