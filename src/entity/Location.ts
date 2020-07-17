import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "locations"})
export class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "double"})
    long: number;

    @Column({ type: "double"})
    lat: number;
}