import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED, OK} from 'http-status-codes';
import {ParamsDictionary} from 'express-serve-static-core';
import * as jwt from 'jsonwebtoken';
import config from "../config/config";
import {User} from "../entity/User";
import AuthDAO from '../dao/authenDAO';
import {BaseResponse} from 'src/entity/BaseResponse';

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

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
        {userId: user.id, nickname: user.nickName},
        config.jwtSecret,
        {expiresIn: "1h"}
    );

    console.log(token);
});

export default router;