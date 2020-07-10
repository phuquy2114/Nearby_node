import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    Unique,
    OneToOne,
    JoinColumn,
    BaseEntity,
    ManyToMany, JoinTable
} from "typeorm";

import {Location} from "./Location";
import * as bcrypt from 'bcryptjs';

@Entity({name: "users"})
@Unique(['email','nickName'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        length: 20
    })
    firstName: string;

    @Column({
        length: 50
    })
    lastName: string;

    @Column({length: 50})
    email!: string;

    @Column({name: "birth_day"})
    birthDay: string;

    @Column()
    age: number;

    @Column()
    nickName!: string;

    @Column({name: "phone_code"})
    phoneCode: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    avatar: string;

    @OneToOne(type => Location)
    @JoinColumn()
    location: Location;

    @Column()
    password: string;

    @Column()
    deviceToken: string;

    @Column({default: new Date()})
    @CreateDateColumn({name: 'created_at'}) 'created_at': Date;

    @Column({default: new Date()})
    @UpdateDateColumn({name: 'updated_at'}) 'updated_at': Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
    
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

    @ManyToMany(type => User)
    @JoinTable()
    friends: User[];
}