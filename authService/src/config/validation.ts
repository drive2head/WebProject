import {check} from 'express-validator'

export const loginValidation = [
    check('email')
        .exists()
        .withMessage('Email is empty')
        .isEmail()
        .withMessage('Email is wrong format'),
    check('password')
        .exists()
        .withMessage('Passport is empty')
        .isLength({ min: 6 })
        .withMessage('Passport length must be > 6'),
];
