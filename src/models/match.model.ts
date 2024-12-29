import { Table, Column, Model, DataType, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo, Default } from "sequelize-typescript";

import User from "./user.model";

@Table({
  tableName: "matches",
  timestamps: true,
  paranoid: true,
})
class Match extends Model<Match> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare userId1: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare userId2: number;

  @Column(DataType.STRING)
  declare status: "PASS" | "LIKE";

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isMatch: boolean;

  @BelongsTo(() => User, "userId1")
  declare user1: User;

  @BelongsTo(() => User, "userId2")
  declare user2: User;
}

export default Match;
