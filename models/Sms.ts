import {
  Table, Column, Model,
} from 'sequelize-typescript';

@Table({
  tableName: 'sms',
  timestamps: true,
  paranoid: true,
})
export default class User extends Model {
  static fillable = [
    'message',
    'contactIds',
  ];

  @Column
    message!: string;

  @Column
    contactIds!: string;
}
