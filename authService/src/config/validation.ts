import {check} from 'express-validator'

export const loginValidation = [
    check('username')
        .exists()
        .withMessage('Username is empty')
        .isEmail()
        .withMessage('Username is wrong format'),
    check('password')
        .exists()
        .withMessage('Passport is empty')
        .isLength({ min: 6 })
        .withMessage('Passport length must be > 6'),
];
