import { CreateUserDto } from './../dto/create-user.dto';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role } from 'src/enums/role';
import { UserStatus } from 'src/enums/user-status';
;

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    refreshToken?: string;

    @Column({unique: true,name:'phone_number'})
    phone_number:string

    @Column({default:null})
    email?: string

    
    @Column({})
    password: string

    @Column({name:'first_name',default:null})
    first_name?: string;

    @Column({name:'last_name',default:null})
    last_name?: string;

    @Column({default:true,name:'is_active'})
    is_active: boolean;

    @Column({name:'role', default:Role.UnAssign})
    role: Role;




    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date

    @DeleteDateColumn()
    deleted_at: Date; // Deletion date


    @Column({name:'status',default:'active'})
    status?: UserStatus;

    @Column({name:'verification_code', nullable: true })
    verificationCode: string;
  
    @Column({name:'verification_code_expiration', nullable: true, type: 'timestamp' })
    verificationCodeExpiration: Date;
  
    @Column({name:'is_verified_reset', default: false })
    isVerifiedForReset: boolean;

    

    static removePassword(userObj: User) {
        return Object.fromEntries(
          Object.entries(userObj).filter(([key, val]) => key !== 'password')
        );
    }



    static async userFromDTO(dto: UpdateUserDto)  : Promise<User>{
        const user = new User()
        if (dto.email != null) {
          user.email = dto.email
        }

        if (dto.phone_number != null) {
          user.phone_number = dto.phone_number
        }

        if (dto.password != null) {
          user.password = await this.hashPassword(dto.password)
        }
        if (dto.first_name != null) {
          user.first_name = dto.first_name
        }
        if (dto.last_name != null) {
          user.last_name = dto.last_name
        }

        if (dto.role != null) {
          user.role = dto.role
        }
        return user;
    }

         

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 13; // Adjust according to your security needs
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

}
