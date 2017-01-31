/**
 * Created by Darron on 1/29/2017.
 */

import EventBus from '../core/event-bus';
import users from './users';

class UserRepo {
    constructor() {
        this.getResidentUsers = this.getResidentUsers.bind(this);
        EventBus.on('getResidentUsers', this.getResidentUsers);

        this.getUsers = this.getUsers.bind(this);
        EventBus.on('getUsers', this.getUsers);

        this.users = users;
    }

    getResidentUsers() {
        let self = this;
        let residentUsers = function () {
            let residents = [];
            for (let i = 0; i < self.users.length; i++) {
                if (self.users[i].role === "Resident") {
                    residents.push(self.users[i]);
                }
            }
            return residents;
        }();
        EventBus.emit('gotResidentUsers', residentUsers);
    }

    getUsers() {
        EventBus.emit('gotUsers', this.users);
    }

    //used by other repo
    getUserById(id) {
        let user;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id == id) {
                user = this.users[i];
                break;
            }
        }
        return user;
    }

}
;

export default new UserRepo();