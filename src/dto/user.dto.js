

export class UserDTO {
    
    constructor(user) {
        this._id = user._id;
        this.fullName = `${user.firstName} ${user.lastName}`,
        this.email = user.email
        this.role = user.role
    }
}