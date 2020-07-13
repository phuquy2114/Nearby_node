import {Request, Response, Router, NextFunction} from 'express';
import {BAD_REQUEST, CREATED, OK} from 'http-status-codes';
import {ParamsDictionary} from 'express-serve-static-core';
import { checkJwt } from "../middlewares/checkJwt";
import {User} from "../entity/User";
import UserDAO from '../dao/userDAO';


const userDAO: UserDAO = new UserDAO();

// Init shared
const router = Router();

router.post('/add',[checkJwt], async (req : Request, res : Response, next : NextFunction) => {
    console.log('addfriend', req.body);
     //Get ID from JWT
     const { userId, nickName } = res.locals.jwtPayload;
     let user: User;
     try {
         user = await userDAO.getUserByID(userId) as User;
     }catch (error) {
        return res.status(400).send({});
    }



    user.friends = [req.body.id];

    user.friends.push(req.body.id);

user.save();

});

export default router;