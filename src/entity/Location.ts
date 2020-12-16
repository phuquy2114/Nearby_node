import {Entity, Column, PrimaryGeneratedColumn,OneToOne,} from "typeorm";
import { User } from './User';

@Entity({name: "locations"})
export class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "double"})
    long: number;

    @Column({ type: "double"})
    lat: number;

    @OneToOne(() => User, user => user.location) // specify inverse side as a second parameter
    user: User;
}