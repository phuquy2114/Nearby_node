import { Request, Response, Router, NextFunction } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { checkJwt } from "../middlewares/checkJwt";
import { User } from "../entity/User";
import UserDAO from '../dao/userDAO';
import { BaseResponse } from 'src/entity/BaseResponse';
import { getConnection } from 'typeorm';


const dataResponse: BaseResponse = new BaseResponse();
const userDAO: UserDAO = new UserDAO();

// Init shared
const router = Router();

router.post('/add', [checkJwt], async (req: Request, res: Response, next: NextFunction) => {
    console.log('addfriend', req.body);

    //Get ID from JWT
    const { userId, nickName } = res.locals.jwtPayload;

    let user: User;
    try {
        user = await userDAO.getUserByID(userId) as User;
    } catch (error) {
        return res.status(400).send({});
    }

    let friend: User;
    try {
        friend = await userDAO.getUserByID(req.body.id) as User;
    } catch (error) {
        return res.status(400).send({});
    }

    if (user.friends == null) {
        user.friends = [];
    }

    user.friends.push(friend);

    const saveFriend = await user.save();
    console.log('saveFriend', saveFriend);
    dataResponse.status = OK;
    dataResponse.data = {};
    dataResponse.message = 'Success';
    return res.status(OK).send(dataResponse);
});

router.post('/unfriend',[checkJwt], async (req: Request, res: Response, next: NextFunction) => {

    //Get ID from JWT
    const { userId, nickName } = res.locals.jwtPayload;

    let user: User;
    try {
        user = await userDAO.getUserByID(userId) as User;
    } catch (error) {
        return res.status(400).send({});
    }

    user.friends = user.friends.filter(friend => {
       return friend.id !== req.body.id;
    });

    const saveFriend = await user.save();

    dataResponse.status = OK;
    dataResponse.data = {};
    dataResponse.message = 'Success';
    return res.status(OK).send(dataResponse);
});

router.get('/getListAll', [checkJwt], async (req: Request, res: Response, next: NextFunction) => {

    //Get ID from JWT
    const { userId, nickName } = res.locals.jwtPayload;

    console.log(userId);

    let user = await userDAO.getListMyFriend(userId);

    dataResponse.status = OK;
    dataResponse.data = { "data": user };
    dataResponse.message = 'Success';
    return res.status(OK).send(dataResponse);
});

export default router;