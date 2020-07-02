import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED, OK} from 'http-status-codes';
import {ParamsDictionary} from 'express-serve-static-core';

import {paramMissingError} from '@shared/constants';
import {User} from '../entity/User';
import {Location} from '../entity/Location'
import UserDAO from '../dao/userDAO';
import {BaseResponse} from '../entity/BaseResponse';

const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const userDAO: UserDAO = new UserDAO();
// Init shared
const router = Router();

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    return res.status(OK).json({'user1': 'data'});
});


/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/
const type = upload.single('avatar');
router.post('/register', type, async (req: Request, res: Response) => {
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

    const locations: Location = new Location();
    locations.lat = 1234567;
    locations.long = 12345678;
    users.location = locations;

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
