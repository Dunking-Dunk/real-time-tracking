import { Response, Request, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({errors: err.serializeErrors() })
    }
    console.error(err)
    res.status(400)
        .send({
        errors: [{message: 'something went wrong'}]
    })
}