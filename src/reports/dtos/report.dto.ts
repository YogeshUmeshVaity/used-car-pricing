import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/user.entity';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;
  @Expose()
  approved: boolean;

  // obj is a reference to the original report entity
  // so, we pull out the property that we need from this object
  // now the value of obj.user.id will be assigned to our userId field.
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
