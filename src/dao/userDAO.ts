import { getManager } from "typeorm"
import { User } from "../entity/User";

class UserDAO {

    getAll() {
        return getManager().find(User);
    }

    getListMyFriend(idParam: string) {
        return User.findOne(idParam, { relations: ["friends"] });
    }

    getUserByID(idParam: string) {
        return User.findOne(idParam, { relations: ["location"] });
    }

    update(user: User) {
        return User.update(user.id, user);
    }

    insert(users: User) {
        return getManager().save<User>(users);
    }

}

export default UserDAO;
