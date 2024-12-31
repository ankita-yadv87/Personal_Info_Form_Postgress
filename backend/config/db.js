const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" })

const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,  // Ensure this is treated as a string
    database: process.env.DB_NAME,
});

// Test connection
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL connection established.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

connectDB();

// Export sequelize to be used in other files
module.exports = { sequelize, connectDB };
