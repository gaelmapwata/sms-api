import {
  Table, Column, Model,
} from 'sequelize-typescript';

@Table({
  tableName: 'contacts',
  timestamps: true,
  paranoid: true,
})
export default class User extends Model {
  static fillable = [
    'firstName',
    'dateOfBorn',
    'phoneNumber',
    'email',
    'destinationOf',
    'destinationTo',
  ];

  @Column
    firstName!: string;

  @Column
    dateOfBorn!: string;

  @Column
    phoneNumber!: string;

  @Column
    email!: string;

  @Column
    destinationOf!: string;

  @Column
    destinationTo!: string;
}
