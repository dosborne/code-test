/**
 * Created by Darron on 1/28/2017.
 */

import React from 'react';
import { render } from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import eventBus from '../core/event-bus';
import currentUser from '../data/current-user-repo';

export default class Form extends React.Component {

    constructor(props) {
        super(props);

        this.dateChange = this.dateChange.bind(this);
        this.usersChange = this.usersChange.bind(this);
        this.run = this.run.bind(this);

        this.gotResidentUsers = this.gotResidentUsers.bind(this);
        eventBus.on('gotResidentUsers', this.gotResidentUsers);

        this.changedUser = this.changedUser.bind(this);
        eventBus.on('changedUser', this.changedUser);

        this.state = {
            startDate: moment().subtract(28, 'days'),
            residentUsers: [],
            selectedResidentUserIds: [],
            currentUser: currentUser.getCurrentUser()
        };
    }

    componentDidMount() {
        eventBus.emit('getResidentUsers');
    }

    componentWillUnmount() {
        eventBus.removeListener('gotResidentUsers', this.gotResidentUsers);
        eventBus.removeListener('changedUser', this.changedUser);
    }

    changedUser(user) {
        this.setState({currentUser: user});
    }

    gotResidentUsers(residentUsers) {
        this.setState({
            residentUsers: residentUsers
        });
    }

    usersChange(users) {
        let options = users.target.options;
        let values = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                values.push(options[i].value);
            }
        }
        this.setState({
            selectedResidentUserIds: values
        });
    }

    run() {
        eventBus.emit('runReport', {
            users: this.state.selectedResidentUserIds,
            startDate: this.state.startDate.toDate()
        });
    }

    dateChange(date) {
        this.setState({
            startDate: date
        });
    }


    render() {
        let users = [];
        if (this.state.currentUser.role == "Admin") {
            users = this.state.residentUsers;
        } else {
            users = [this.state.currentUser];
        }
        return (
            <div className="form-inline">
                <div className="small-padding form-group">
                    <label className="label-format">User(s):</label>
                    <select value={this.state.selectedResidentUserIds} onChange={this.usersChange} multiple
                            className="small-input small-padding form-control">
                        {users.map(function (user, i) {
                            return <option key={i} value={user.id}>{user.name}</option>;
                        })}
                    </select>
                </div>
                <div className="label-format form-group">
                    <label className="small-padding">Start Date:</label>
                    <DatePicker className="small-padding form-control"
                                selected={this.state.startDate} onChange={this.dateChange}/>
                </div>
                <div className="label-format form-group">
                    <button type="button" onClick={this.run} className="btn btn-primary">Run</button>
                </div>
            </div>
        )
    }
};