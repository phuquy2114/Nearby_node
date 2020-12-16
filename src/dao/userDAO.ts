import { getManager, getConnection } from "typeorm"
import { User } from "../entity/User";

class UserDAO {

    getAll() {
        return getManager().find(User,{ relations: ["location"] });
    }

    getListMyFriend(idParam: string) {
        return User.findOne(idParam, { relations: ["friends"] });
    }

    getUserByID(idParam: string) {
        return User.findOne(idParam, { relations: ["location", "friends"] });
    }

    getUserByIDNotFriend(idParam: string) {
        return User.findOne(idParam, { relations: ["location"] });
    }

    update(user: User) {
        return User.update(user.id, user);
    }

    insert(users: User) {
        return getManager().save<User>(users);
    }

    getUnfriend(idParam: string) {

    }
}

export default UserDAO;
