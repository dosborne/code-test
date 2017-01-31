import React from 'react';
import { render } from 'react-dom';
import eventBus from '../core/event-bus';

export default class Shift extends React.Component {
    constructor(props) {
        super(props);

        let regEx = /(#\/shifts\/)(.*)/;
        var match = regEx.exec(window.location.hash);
        let underReview = false;
        if (match != null) {
            if (match[2] == this.props.event.id) {
                underReview = true;
            }
        }

        this.state = {
            shift: this.props.event,
            underReview: underReview
        };
        this.onSelectSlot = this.onSelectSlot.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({shift: nextProps.event});
    }

    onSelectSlot(e) {
        eventBus.emit('removeShift', this.state.shift.id);
        //trying to prevent glitch in removing
        event.preventDefault();
    }

    render() {
        return <div className={this.state.underReview?"slow-blink":""}>
                    <span onClick={this.onSelectSlot}>
                        <icon className="glyphicon glyphicon-remove"></icon>
                    </span>
            <span>{this.state.shift.title}</span>
        </div>;
    }
}