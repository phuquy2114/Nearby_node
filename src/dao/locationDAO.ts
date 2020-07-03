import {getManager} from "typeorm"
import {Location} from "../entity/Location"

class PhotoDao {

    getAll() {
        return getManager().find(Location);
    }

    insert(location: Location) {
        return getManager().save<Location>(location);
    }

}

export default PhotoDao;
