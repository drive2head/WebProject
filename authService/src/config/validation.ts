import {NextFunction, Request, Response} from "express";
import {body, validationResult} from 'express-validator'

// export async function validateUser(req: Request, res: Response, next: NextFunction) {
//     body('username').isEmail(),
//         body('username').isLength({min: 6}),
//         body('password').isLength({min: 6})
//     const errors = validationResult(req);

//     await check('username').isLength({min: 6}).run(req);
//     await check('password').isLength({min: 6}).run(req);
//
//     const result = validationResult(req);
//     if (!result.isEmpty()) {
//         return
//     } {
//         return next
//     }
// }
