import {getManager} from "typeorm";
import {User} from "../entity/User";

class AuthenDAO {

    loginUser(email: string) {
        return User.findOne({'email': email},{ relations: ["location"] });
    }

    forgetPassword(email: string) {
        return User.findOne(email);
    }
}

export default AuthenDAO;