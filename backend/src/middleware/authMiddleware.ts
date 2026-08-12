import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'


export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    var header = req.headers.authorization;
    console.log('JWT_SECRET beim Verify:', process.env.JWT_SECRET);
    if(header === undefined) {
        res.status(401).json({message: "Header undefined"});
        return;
    }

    var token = header.split(' ');

    if(token[0] === "Bearer" && token[1] != undefined) {
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET not defined');
            }
            var check = jwt.verify(token[1], process.env.JWT_SECRET);
            console.log('Decoded Payload:', check);
            if(typeof check === 'string') {
                res.status(401).json({message: "Invalid Token"})
                return;
            }
            console.log('Secret (Verify):', JSON.stringify(process.env.JWT_SECRET));
            (req as any).userId = check.userId;
            next();
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'unknown error';
            res.status(409).json({status: 'error', message});
        }
    } else {
        res.status(401).json({message: "Invalid Token"})
    }

    
}