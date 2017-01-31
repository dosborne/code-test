/**
 * Created by Darron on 1/28/2017.
 */

import React from 'react';
import { render } from 'react-dom';
import eventBus from '../core/event-bus';
import currentUser from '../data/current-user-repo';

export default class Users extends React.Component {

    constructor(props) {
        super(props);

        this.gotUsers = this.gotUsers.bind(this);
        eventBus.on('gotUsers', this.gotUsers);

        this.usersChange = this.usersChange.bind(this);

        this.changedUser = this.changedUser.bind(this);
        eventBus.on('changedUser', this.changedUser);

        this.state = {
            users: [],
            currentUser: currentUser.getCurrentUser()
        };
    }

    componentDidMount() {
        eventBus.emit('getUsers');
    }

    componentWillUnmount() {
        eventBus.removeListener('gotUsers', this.gotUsers);
        eventBus.removeListener('changedUser', this.changedUser);
    }

    gotUsers(users) {
        this.setState({users: users});
    }

    changedUser(currentUser) {
        this.setState({currentUser: currentUser});
    }

    usersChange(event) {
        let options = event.target.options;
        let selectedUserId;
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedUserId = options[i].value;
            }
        }
        eventBus.emit('changeUser', selectedUserId);
    }

    render() {
        let self = this;
        return (
            <div className="small-padding form-group">
                <label className="small-padding" htmlFor="">Acting as:</label>
                <select value={this.state.currentUser.id} onChange={this.usersChange}
                        className="small-input form-control">
                    {this.state.users.map(function (user, i) {
                        return <option key={i} value={user.id}>{user.name}({user.role})</option>;
                    })}
                </select>
            </div>
        )
    }
};