import {getManager} from "typeorm";
import {User} from "../entity/User";

class AuthenDAO {

    loginUser(email: string) {
        return User.findOne({'email': email});
    }

    forgetPassword(email: string) {
        return User.findOne(email);
    }
}

export default AuthenDAO;