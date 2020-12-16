import {Request, Response, Router, NextFunction} from 'express';
import {BAD_REQUEST, CREATED, OK} from 'http-status-codes';
import {ParamsDictionary} from 'express-serve-static-core';
import * as jwt from 'jsonwebtoken';
import config from "../config/config";
import {User} from "../entity/User";
import AuthDAO from '../dao/authenDAO';
import {BaseResponse} from 'src/entity/BaseResponse';
import UserDAO from '../dao/userDAO';
import { checkJwt } from "../middlewares/checkJwt";

const userDAO: UserDAO = new UserDAO();
const fs = require('fs-extra');
const dataResponse: BaseResponse = new BaseResponse();
const authenDAO: AuthDAO = new AuthDAO();
// Init shared
const router = Router();

router.post('/login', async (req, res, next) => {


    let {email, password} = req.body;

    if (!(email && password)) {
        dataResponse.status = 400;
        dataResponse.data = {};
        dataResponse.message = 'Tài khoản không tồn tại';
        return res.status(400).send(dataResponse);
    }

    var user = await authenDAO.loginUser(email) as User;
    if (!user) {
        dataResponse.status = 400;
        dataResponse.data = {};
        dataResponse.message = 'Tài khoản không tồn tại';
        return res.status(400).send(dataResponse);
    }

    console.log(user);

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        dataResponse.status = 401;
        dataResponse.data = {};
        dataResponse.message = 'Sai mật khẩu';
        return res.status(401).send(dataResponse);
      }

      
    //Sing JWT, valid for 1 hour
    const token = jwt. sign({userId: user.id, nickname: user.nickName}, config.jwtSecret,
        { expiresIn: "10h" });
       
    console.log(token);
    dataResponse.status = 200;
    dataResponse.data = {"token" : token , "user" : user };
    dataResponse.message = 'Successfull';
    return res.status(OK).json(dataResponse);
});


//Change my password
router.post('/change-password',[checkJwt], async (req : Request, res : Response, next : NextFunction) => {

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
      res.status(400).send({});
    }
    //Get ID from JWT
    const { userId, nickName } = res.locals.jwtPayload;
    let user: User;
    try {
        user = await userDAO.getUserByID(userId) as User;
          //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        dataResponse.status = OK;
        dataResponse.data = {};
        dataResponse.message = 'Mật khẩu củ không đúng ';
    
        return res.status(400).send(dataResponse);
      }

       //Validate de model (password lenght)
     user.password = newPassword;

     //Hash the new password and save
    user.hashPassword();
    const insertValue = await userDAO.insert(user);
    dataResponse.status = OK;
    dataResponse.data = user;
    dataResponse.message = 'Success';
    return res.status(OK).send(dataResponse);
    
    } catch (id) {
        dataResponse.status = OK;
        dataResponse.data = {};
        dataResponse.message = 'Mật khẩu củ không đúng ';
        return res.status(400).send(dataResponse);
    }
});


export default router;