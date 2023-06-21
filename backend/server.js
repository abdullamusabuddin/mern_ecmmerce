const app = require("./app");

const dotenv = require("dotenv")
const connectDataBase = require("./config/database")


//config
dotenv.config({ path: "backend/config/config.env" })

// handleing Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server due to Uncaught Exception");

    process.exit(1);

})
//connect to database
connectDataBase()

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})

//unhandeled promise rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server due to unhandled promise rejection");

    server.close(() => {
        process.exit(1)
    })
})