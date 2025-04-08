import { DataTypes, Model } from "sequelize";
import sequelize from "../config/conn";

export interface IUser {
  id?: number;
  name: string;
  email: string;
  role: string;
  password: string;
}

class User extends Model<IUser> implements IUser {
  public id!: number;
  public name!: string;
  public email!: string;
  public role!: string;
  public password!: string;

  // Sequelize Timestamps (createdAt & updatedAt)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define Sequelize Model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Corrected default behavior
      primaryKey: true,
      defaultValue: 1,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 20],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // avatar: {
    //   type: DataTypes.STRING,
    //   allowNull: true, // Optional field
    // },
    role: {
      type: DataTypes.ENUM("Admin", "User", "Manager"),
      defaultValue: "User",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true, // Enables createdAt & updatedAt fields
  }
);

export default User;
