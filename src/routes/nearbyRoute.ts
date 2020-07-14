import {Request, Response, Router, NextFunction} from 'express';
import {BAD_REQUEST, CREATED, OK} from 'http-status-codes';
import {ParamsDictionary} from 'express-serve-static-core';

import UserDAO from '../dao/userDAO';
import {BaseResponse} from '../entity/BaseResponse';
import { checkJwt } from "../middlewares/checkJwt";

const userDAO: UserDAO = new UserDAO();
const dataResponse: BaseResponse = new BaseResponse();

// Init shared
const router = Router();

export default router;
