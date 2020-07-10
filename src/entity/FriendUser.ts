
import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "friend_user"})
export class FriendUser {

    @PrimaryGeneratedColumn()
    id: number;

    
}