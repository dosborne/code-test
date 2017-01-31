/**
 * Created by Darron on 1/29/2017.
 */

import EventBus from '../core/event-bus';
import shifts from './shifts';

class ShiftsRepo {
    constructor() {
        this.getShifts = this.getShifts.bind(this);
        EventBus.on('getShifts', this.getShifts);

        this.addShift = this.addShift.bind(this);
        EventBus.on('addShift', this.addShift);

        this.removeShift = this.removeShift.bind(this);
        EventBus.on('removeShift', this.removeShift);

        this.getShift = this.getShift.bind(this);
        EventBus.on('getShift', this.getShift);

        this.shifts = shifts;
    }

    getShift(shiftId) {
        let shift;
        for (let i = 0; i < this.shifts.length; i++) {
            if (this.shifts[i].id == shiftId) {
                shift = this.shifts[i];
                break;
            }
        }
        EventBus.emit('gotShift', shift);
    }

    getShifts(user) {
        EventBus.emit('gotShifts', this.getShiftsByUser(user));
    }

    addShift(shift) {
        let add = true;

        //trying to hack cross day shifts
        if (shift.end.getHours() === 23 && shift.end.getMinutes() === 59) {
            //shift.end.setSeconds(60);
        }

        //merge with continuous shifts
        let userShifts = this.getShiftsByUser(shift.user);
        for (let i = 0; i < userShifts.length; i++) {
            if (userShifts[i] &&
                shift.start.getTime() <= userShifts[i].end.getTime() &&
                shift.end.getTime() >= userShifts[i].end.getTime()) {
                userShifts[i].end = shift.end;
                add = false;
                this.checkForOverlap(shift.user);
            }
            if (userShifts[i] &&
                shift.end.getTime() >= userShifts[i].start.getTime() &&
                shift.start.getTime() <= userShifts[i].start.getTime()) {
                userShifts[i].start = shift.start;
                add = false;
                this.checkForOverlap(shift.user);
            }
            if (userShifts[i] &&
                shift.end.getTime() <= userShifts[i].end.getTime() &&
                shift.start.getTime() >= userShifts[i].start.getTime()) {
                add = false;
            }
        }

        if (add) {
            shift.id = this.getMaxShiftId() + 1;
            this.shifts.push(shift);
        }

        EventBus.emit('addedShift');
    }

    removeShift(id) {
        let shiftIndex = this.getShiftIndexById(id);
        if (shiftIndex != -1) {
            this.shifts.splice(shiftIndex, 1);
            EventBus.emit('removedShift');
        }
    }

    //used by reports-repo
    getShiftsByUserAndDateRange(user, startDate, endDate) {
        let self = this;
        let userShifts = function () {
            let shifts = [];
            for (let i = 0; i < self.shifts.length; i++) {
                if (self.shifts[i].user.id == user &&
                    startDate <= self.shifts[i].start &&
                    self.shifts[i].start <= endDate) {
                    shifts.push(self.shifts[i]);
                }
            }
            return shifts;
        }();
        return userShifts;
    }

    //merge overlapping shifts
    //internal use
    checkForOverlap(user) {
        let userShifts = this.getShiftsByUser(user);
        done:
            for (let i = 0; i < userShifts.length; i++) {
                for (let j = 0; j < userShifts.length; j++) {
                    if (userShifts[i].id === userShifts[j].id) {
                        continue;
                    }
                    if (userShifts[i].start.getTime() <= userShifts[j].end.getTime() &&
                        userShifts[i].end.getTime() >= userShifts[j].end.getTime()) {
                        userShifts[j].end = userShifts[i].end;
                        this.removeShift(userShifts[i].id);
                        break done;
                    }
                    if (userShifts[i].end.getTime() >= userShifts[j].start.getTime() &&
                        userShifts[i].start.getTime() <= userShifts[j].start.getTime()) {
                        userShifts[j].start = userShifts[i].start;
                        this.removeShift(userShifts[i].id);
                        break done;
                    }
                }
            }
    }

    //internal use
    getShiftIndexById(id) {
        let shiftIndex = -1;
        for (let i = 0; i < this.shifts.length; i++) {
            if (this.shifts[i].id == id) {
                shiftIndex = i;
                break;
            }
        }
        return shiftIndex;
    }

    //internal use
    getMaxShiftId() {
        let maxId = 0;
        for (let i = 0; i < this.shifts.length; i++) {
            if (this.shifts[i].id > maxId) {
                maxId = this.shifts[i].id;
            }
        }
        return maxId;
    }

    //internal
    getShiftsByUser(user) {
        let self = this;
        let userShifts = function () {
            let shifts = [];
            for (let i = 0; i < self.shifts.length; i++) {
                if (self.shifts[i].user.id === user.id) {
                    shifts.push(self.shifts[i]);
                }
            }
            return shifts;
        }();
        return userShifts;
    }


}
;

export default new ShiftsRepo();