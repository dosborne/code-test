import React from 'react';
import { render } from 'react-dom';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Shift from './shift';
import eventBus from '../core/event-bus';
import currentUser from '../data/current-user-repo'

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);


export default class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.gotShifts = this.gotShifts.bind(this);
        eventBus.on('gotShifts', this.gotShifts);

        this.addedShift = this.addedShift.bind(this);
        eventBus.on('addedShift', this.addedShift);

        this.removedShift = this.removedShift.bind(this);
        eventBus.on('removedShift', this.removedShift);

        this.gotShift = this.gotShift.bind(this);
        eventBus.on('gotShift', this.gotShift);

        this.onNavigate = this.onNavigate.bind(this);
        this.onSelectSlot = this.onSelectSlot.bind(this);

        this.changedUser = this.changedUser.bind(this);
        eventBus.on('changedUser', this.changedUser);

        this.state = {
            shifts: [],
            currentUser: currentUser.getCurrentUser(),
            shiftId: props.params.shiftId,
            defaultDate: new Date()
        };
    }

    componentDidMount() {
        if (!this.state.shiftId) {
            eventBus.emit('getShifts', this.state.currentUser);
        } else {
            eventBus.emit('getShift', this.state.shiftId);
        }
    }

    gotShift(shift) {
        if (shift) {
            this.changedUser(shift.user);
            this.setState({defaultDate: shift.start});
        }
    }

    componentWillUnmount() {
        eventBus.removeListener('gotShifts', this.gotShifts);
        eventBus.removeListener('gotShift', this.gotShift);
        eventBus.removeListener('addedShift', this.addedShift);
        eventBus.removeListener('removedShift', this.removedShift);
        eventBus.removeListener('changedUser', this.changedUser);
    }

    addedShift() {
        eventBus.emit('getShifts', this.state.currentUser);
    }

    removedShift() {
        eventBus.emit('getShifts', this.state.currentUser);
    }

    changedUser(user) {
        this.setState({currentUser: user});
        eventBus.emit('getShifts', user);
    }

    gotShifts(shifts) {
        this.setState({shifts: shifts});
    }

    onSelectSlot(shift) {
        eventBus.emit('addShift', {
            'title': 'Shift ' + shift.start + " - " + shift.end,
            'start': shift.start,
            'end': shift.end,
            'user': this.state.currentUser
        });
    }

    onNavigate(date) {
        this.setState({defaultDate: date})
    }

    render() {
        return (
            <div className="calendar-height">
                <BigCalendar
                    components={{
                        event: Shift
                    }}
                    selectable
                    events={this.state.shifts}
                    date={this.state.defaultDate}
                    onSelectSlot={this.onSelectSlot}
                    onNavigate={this.onNavigate}
                    defaultView='week'
                />
            </div>
        )
    }
};