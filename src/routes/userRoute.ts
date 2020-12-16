import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import { paramMissingError } from '@shared/constants';
import { User } from '../entity/User';
import { Location } from '../entity/Location'
import UserDAO from '../dao/userDAO';
import LocationDAO from '../dao/locationDAO';
import { BaseResponse } from '../entity/BaseResponse';
import { checkJwt } from "../middlewares/checkJwt";

const fs = require('fs');
const multer = require('multer');
const path = require('path');
const storages = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, 'src/public/images');
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storages });

const userDAO: UserDAO = new UserDAO();
const locationDAO: LocationDAO = new LocationDAO();
const dataResponse: BaseResponse = new BaseResponse();
// Init shared
const router = Router();

interface MulterRequest extends Request {
    file: any;
}

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const data: Array<User> = await userDAO.getAll();
    const dataResponse: BaseResponse = new BaseResponse();
    dataResponse.status = OK;
    dataResponse.data = data;
    dataResponse.message = 'Successfull';
    return res.status(OK).json(dataResponse);
});

router.get('/me', [checkJwt], async (req: Request, res: Response) => {
    const { userId, nickName } = res.locals.jwtPayload;
    const data: User = await userDAO.getUserByID(userId) as User;
    const dataResponse: BaseResponse = new BaseResponse();
    dataResponse.status = OK;
    dataResponse.data = data;
    dataResponse.message = 'Successfull';
    return res.status(OK).json(dataResponse);
});

router.get('/profile/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    const data: User = await userDAO.getUserByID(id) as User;

    const dataResponse: BaseResponse = new BaseResponse();
    dataResponse.status = OK;
    dataResponse.data = data;
    dataResponse.message = 'Successfull';
    return res.status(OK).json(dataResponse);
});

router.get('/profile', async (req: Request, res: Response) => {
    console.log(req.query);
    return res.status(OK).json({ "data": "data" });
});

/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/
router.post('/register', upload.single('avatar'), async (req: Request, res: Response) => {
    console.log('ubhiuhui', req.body);

    console.log('huhuhuhuh', req.body.file);

    if (!req.body) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    // add user here
    const users: User = new User();
    users.firstName = req.body.firstName;
    users.lastName = req.body.lastName;
    users.name = req.body.firstName + req.body.lastName;
    users.birthDay = req.body.birthDay;
    users.email = req.body.email;
    users.nickName = req.body.nickName;

    console.log(new Date().getFullYear());
    const yearUser = req.body.birthDay.split('/', 3);
    console.log(yearUser);

    users.age = new Date().getFullYear() - yearUser[2];
    users.phoneCode = req.body.phoneCode;
    users.phone = req.body.phone;
    users.address = req.body.address;
    users.password = req.body.password;
    users.deviceToken = req.body.deviceToken;
    users.code = 1111;

    console.log((req as MulterRequest).file.originalname);
    users.avatar = (req as MulterRequest).file.originalname;


    const locations: Location = new Location();
    locations.lat = req.body.lat;
    locations.long = req.body.long;

    users.location = await locationDAO.insert(locations);

    //Hash the password, to securely store on DB
    users.hashPassword();

    try {
        const insertValue = await userDAO.insert(users);
    } catch (error) {
        dataResponse.status = BAD_REQUEST;
        dataResponse.data = {};
        dataResponse.message = 'Email đã được sử dụng';
        return res.status(BAD_REQUEST).json(dataResponse);
    }

    dataResponse.status = CREATED;
    dataResponse.data = users;
    dataResponse.message = 'Successfull';
    return res.status(CREATED).json(dataResponse);
});


/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', [checkJwt], async (req: Request, res: Response) => {
    
    const { userId, nickName } = res.locals.jwtPayload;

    var users: User;

    try {
        users = await userDAO.getUserByIDNotFriend(userId) as User;
    } catch (error) {
        //If not found, send a 404 response
        return res.status(404).send("User not found");;
    }

    if (!users) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    if (req.body.firstName != null) {
        users.firstName = req.body.firstName;
        users.name = req.body.firstName + " " + users.lastName;
    }

    if (req.body.lastName != null) {
        users.lastName = req.body.lastName;
        users.name = users.firstName + " " + req.body.lastName;
    }

    if (req.body.birthDay != null) {
        users.birthDay = req.body.birthDay;
        console.log(new Date().getFullYear());
        const yearUser = req.body.birthDay.split('/', 3);
        console.log(yearUser);

        users.age = new Date().getFullYear() - yearUser[2];
    }

    if (req.body.email != null) {
        users.email = req.body.email;
    }

    if (req.body.nickName != null) {
        users.nickName = req.body.nickName;
    }


    if (req.body.phoneCode != null && !req.body.phone != null) {
        users.phoneCode = req.body.phoneCode;
        users.phone = req.body.phone;
    }

    if (req.body.address != null) {
        users.address = req.body.address;
    }

    if (req.body.password != null) {
        users.password = req.body.password;
    }
    if (req.body.deviceToken != null) {
        users.deviceToken = req.body.deviceToken;
    }

    if (req.body.code != null) {
        users.code = 1111;
    }

    try {
        console.log((req as MulterRequest).file.originalname);
        users.avatar = (req as MulterRequest).file.originalname;
    } catch (error) {
        console.log(error);
    }

    // user.id = Number(user.id);
    // updateUser
    const saveUser = await users.save();

    dataResponse.status = OK;
    dataResponse.data = saveUser;
    dataResponse.message = 'Successfull';
    return res.status(OK).json(dataResponse);
});

/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    // delete user
    return res.status(OK).end();
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
