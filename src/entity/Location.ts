import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "locations"})
export class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    long: number;

    @Column()
    lat: number;
}