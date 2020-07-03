import {getManager} from "typeorm"
import {User} from "../entity/User";

class UserDAO {

    getAll() {
        return getManager().find(User);
    }

    getUserByID(idParam: string) {
        return User.findOne(idParam, {relations: ["location"]});
    }

    insert(users: User) {
        return getManager().save<User>(users);
    }

}

export default UserDAO;
