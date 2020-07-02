import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    Unique,
    OneToOne,
    JoinColumn
} from "typeorm";
import {Location} from "./Location";

@Entity({name: "users"})
@Unique(['email'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({length: 50})
    email!: string;

    @Column({name: "birth_day"})
    birthDay: string;

    @Column()
    age: number;

    @Column()
    nickName: string;

    @Column({name: "phone_code"})
    phoneCode: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @OneToOne(type => Location, location => [location.long, location.lat])
    @JoinColumn()
    location: Location;

    @Column({default: new Date()})
    @CreateDateColumn({name: 'created_at'}) 'created_at': Date;

    @Column({default: new Date()})
    @UpdateDateColumn({name: 'updated_at'}) 'updated_at': Date;

}