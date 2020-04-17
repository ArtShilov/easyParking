const { body } = require('express-validator/check')

exports.registerValidators = [
  body('name', 'Название должно быть минимум 5 символов').isLength({ min: 5 }),
  body('phone').isMobilePhone('ru-RU').withMessage('Введите корректный номер'),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
  body('email', 'Введите корректный email').isEmail(),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Пароли должны совпадать')
    }
    return true
  })
]

exports.addParkingValidators = [
  body('name').isLength({ min: 3 }).withMessage('Минимальная длина названия 3 символа').trim(),
  body('position').isLength({ min: 3 }).withMessage('Минимальная длина позиции 3 символа').trim(),
  body('countAll').isNumeric().withMessage('Введите число парковочных мест'),
  body('price').isNumeric().withMessage('Введите конкретную сумму')
]

exports.loginOrgValidators = [ 

]
