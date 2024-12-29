import { Table, Column, Model, DataType, AutoIncrement, PrimaryKey, Default, Unique, HasMany } from "sequelize-typescript";

import Match from "./match.model";

@Table<User>({
  tableName: "users",
  timestamps: true,
  paranoid: true,
})
class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column(DataType.INTEGER)
  declare id: number;
  
  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare photoId: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare password: string;

  @Column(DataType.STRING)
  declare gender: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isPremium: boolean;

  @Column(DataType.GEOMETRY("POINT"))
  declare location: { type: string; coordinates: number[] };

  @Column(DataType.INTEGER)
  declare age: number;

  @Column(DataType.INTEGER)
  declare preferredAgeMin: number;

  @Column(DataType.INTEGER)
  declare preferredAgeMax: number;

  @Column(DataType.INTEGER)
  declare preferredRange: number;

  @HasMany(() => Match, "userId1")
  myMatches: Match[];

  @HasMany(() => Match, "userId2")
  matchedMe: Match[];
}

export default User;
