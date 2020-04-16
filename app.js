const express = require("express");
const useMiddleware = require("./middleware");
const indexRouter = require("./routes/index");
const organizationRouter = require('./routes/organization')
const useErrorHandlers = require("./middleware/error-handlers");

const app = express();
useMiddleware(app);

// Подключаем импортированные маршруты с определенным url префиксом.
app.use("/", indexRouter);
app.use('/org', organizationRouter);

useErrorHandlers(app);

module.exports = app;
