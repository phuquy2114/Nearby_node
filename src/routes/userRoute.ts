import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED, OK} from 'http-status-codes';
import {ParamsDictionary} from 'express-serve-static-core';

import {paramMissingError} from '@shared/constants';
import {User} from '../entity/User';
import {Location} from '../entity/Location'
import UserDAO from '../dao/userDAO';
import LocationDAO from '../dao/locationDAO';
import {BaseResponse} from '../entity/BaseResponse';

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
const upload = multer({storage: storages});

const userDAO: UserDAO = new UserDAO();
const locationDAO: LocationDAO = new LocationDAO();
// Init shared
const router = Router();

interface MulterRequest extends Request {
    file: any;
}

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    return res.status(OK).json(userDAO.getAll());
});

router.get('/profile/:id', async (req: Request, res: Response) => {
    const {id} = req.params as ParamsDictionary;
    const data: User = await userDAO.getUserByID(id) as User;

    const dataResponse: BaseResponse = new BaseResponse();
    dataResponse.status = OK;
    dataResponse.data = data;
    dataResponse.message = 'Successfull';
    return res.status(OK).json(dataResponse);
});

router.get('/profile', async (req: Request, res: Response) => {
    console.log(req.query);

    return res.status(OK).json({"data": "data"});
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
    users.age = 30;
    users.phoneCode = '+84';
    users.phone = req.body.phone;
    users.address = req.body.address;

    console.log((req as MulterRequest).file.originalname);
    users.avatar = (req as MulterRequest).file.originalname;


    const locations: Location = new Location();
    locations.lat = 1234567;
    locations.long = 12345678;
    users.location = await locationDAO.insert(locations);

    const insertValue = await userDAO.insert(users);

    const dataResponse: BaseResponse = new BaseResponse();
    dataResponse.status = CREATED;
    dataResponse.data = users;
    dataResponse.message = 'Successfull';
    return res.status(CREATED).json(dataResponse);
});


/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    const {user} = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    user.id = Number(user.id);
    // updateUser
    return res.status(OK).end();
});

/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const {id} = req.params as ParamsDictionary;
    // delete user
    return res.status(OK).end();
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
