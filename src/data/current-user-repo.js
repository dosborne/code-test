/**
 * Created by Darron on 1/28/2017.
 */

import eventBus from '../core/event-bus';
import usersRepo from './users-repo';

class CurrentUser {

    constructor() {
        this.gotUsers = this.gotUsers.bind(this);
        eventBus.on('gotUsers', this.gotUsers);

        this.changeUser = this.changeUser.bind(this);
        eventBus.on('changeUser', this.changeUser);

        this.currentUser = null;
        this.users = [];

        eventBus.emit('getUsers');
    }

    changeUser(userId) {

        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id == userId) {
                this.currentUser = this.users[i];
                eventBus.emit('changedUser', this.currentUser);
                break;
            }
        }
    }

    gotUsers(users) {
        this.users = users;
        //default user to first user
        if (!this.currentUser) {
            this.currentUser = users[1];
            eventBus.emit('changedUser');
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }


}
;

let currentUser = new CurrentUser();
module.exports = currentUser;