import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import {BaseResponse} from 'src/entity/BaseResponse';

const dataResponse: BaseResponse = new BaseResponse();
export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers["authorization"];
  const token1 = token.replace('Bearer ','');
  let jwtPayload;
  
  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token1, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    dataResponse.status = 401;
    dataResponse.data = {};
    dataResponse.message = 'unauthorized ';
    return res.status(401).send(dataResponse);
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request

//   const { userId, username } = jwtPayload;
//   const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
//     expiresIn: "1h"
//   });

//   res.setHeader("token", newToken);
  //Call the next middleware or controller
  next();
};
