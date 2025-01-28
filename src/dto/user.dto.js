

export class UserDTO {
    
    constructor(user) {
        this.fullName = `${user.firstName} ${user.lastName}`,
        this.email = user.email
    }
}