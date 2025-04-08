import { DataTypes, Model } from "sequelize";
import sequelize from "../config/conn";

export interface ITask {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  statu: string;
  assignedToId: number;
  assignedById: number;
}

class Task extends Model<ITask> implements ITask {
  public id!: number;
  public title!: string;
  public description!: string;
  public dueDate!: string;
  public priority!: string;
  public statu!: string;
  public assignedToId!: number;
  public assignedById!: number;

  // Sequelize Timestamps (createdAt & updatedAt)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define Sequelize Model
Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Corrected default behavior
      primaryKey: true,
      defaultValue: 1,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
    priority: {
      type: DataTypes.ENUM("Normal", "High", "Low"),
      defaultValue: "Normal",
    },
    statu: {
      type: DataTypes.ENUM("Active", "Closed", "Pending"),
      defaultValue: "Active",
    },
    assignedById: {
      type: DataTypes.INTEGER,
    },
    assignedToId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "Task",
    timestamps: true, // Enables createdAt & updatedAt fields
  }
);

export default Task;
