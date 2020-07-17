import { Request, Response, Router, NextFunction } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import UserDAO from '../dao/userDAO';
import { BaseResponse } from '../entity/BaseResponse';
import { checkJwt } from "../middlewares/checkJwt";
import { getManager } from 'typeorm';


const userDAO: UserDAO = new UserDAO();
const dataResponse: BaseResponse = new BaseResponse();

// Init shared
const router = Router();

router.get('/getFriend', [checkJwt], async (req: Request, res: Response, next: NextFunction) => {

    var lng = req.query.long;
    var lat = req.query.lat;

    if (!lng && !lat) {
        dataResponse.status = 401;
        dataResponse.data = {};
        dataResponse.message = 'fail';
        return res.status(401).json(dataResponse);
    }
    var query: string = `select *,SQRT(
        POW(69.1 * (locations.lat - ${lat}), 2) +
        POW(69.1 * (${lng} - locations.long) * COS(locations.lat / 57.3), 2)) AS distance 
        FROM users inner join locations on users.locationId = locations.id 
        HAVING distance < 100 ORDER BY distance`;
    
    var result = await getManager().query(query);
    
    dataResponse.status = OK;
    dataResponse.data = {"data" : result};
    dataResponse.message = 'Success';
    return res.status(OK).json(dataResponse);

});

export default router;
