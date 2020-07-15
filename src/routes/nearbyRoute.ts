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
    var query: string = `select * from (
        SELECT  *,( 3959 * acos( cos( radians(6.414478) ) * cos( radians( ${lat} ) ) * cos( radians( ${lng} ) 
        - radians(12.466646) ) + sin( radians(6.414478) ) * sin( radians( ${lat} ) ) ) ) AS distance FROM users) al
        where distance < 5
        ORDER BY distance
        LIMIT 20;`;
    
    var result = await getManager().query(query);
    
    dataResponse.status = OK;
    dataResponse.data = {"data" : result};
    dataResponse.message = 'Success';
    return res.status(OK).json(dataResponse);

});

export default router;
