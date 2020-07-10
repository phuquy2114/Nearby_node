import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED, OK} from 'http-status-codes';
import {ParamsDictionary} from 'express-serve-static-core';
import * as jwt from 'jsonwebtoken';
import config from "../config/config";
import {User} from "../entity/User";
import AuthDAO from '../dao/authenDAO';
import {BaseResponse} from 'src/entity/BaseResponse';

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
        res.status(401).send();
        return;
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
router.post("/change-password");


export default router;