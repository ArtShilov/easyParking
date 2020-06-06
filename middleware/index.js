module.exports = function (app) {
  const express = require('express');
  const morgan = require('morgan');
  const flash = require('connect-flash');
  const cookieParser = require('cookie-parser');
  const session = require('express-session');
  const path = require('path');
  // библиотека для сохранении сессии в монго
  const MongoStore = require('connect-mongodb-session')(session);
  // const FileStore = require("session-file-store")(session);
  const { cookiesCleaner } = require('./auth');
  const dbConnection = require('./db-connect');
  app.use(morgan('dev'));

  const store = new MongoStore({
    collection: 'sessions', // название коллекции где хранятся сессии
    uri: 'mongodb://localhost:27017/easyParking',
  });

  // Body POST запросов.
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // initialize cookie-parser to allow us access the cookies stored in the browser.
  app.use(cookieParser());

  // initialize express-session to allow us track the logged-in user across sessions.
  app.use(
    session({
      secret: 'some secret value',
      resave: false,
      saveUninitialized: false,
      store,
    }),
  );
  app.use(flash());

  app.use(cookiesCleaner);

  // Подключаем статику
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Подключаем views(hbs)
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'hbs');
};
