import { Sequelize } from "sequelize";

const sequelize = new Sequelize("task", "root", "", {
  host: "localhost",
  dialect: "mysql",
  pool: { max: 5, min: 0, idle: 1000 },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((error) => {
    console.log("Error" + error);
  });

export default sequelize;
