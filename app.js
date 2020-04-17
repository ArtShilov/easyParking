const express = require("express");
const useMiddleware = require("./middleware");
const indexRouter = require("./routes/index");
const organizationRouter = require('./routes/organization')

const mapRouter = require("./routes/map");
const useErrorHandlers = require("./middleware/error-handlers");


const app = express();
useMiddleware(app);



// Подключаем импортированные маршруты с определенным url префиксом.
app.use("/", indexRouter);
app.use('/org', organizationRouter);
app.use("/map", mapRouter);

useErrorHandlers(app);

module.exports = app;
