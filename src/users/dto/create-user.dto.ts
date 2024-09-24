import { Role } from 'src/enums/role';
export class CreateUserDto {
    phone_number: string
    password?: string
    email?: string
    first_name?: string
    last_name?: string
    role? : Role
    is_active? : boolean

}
