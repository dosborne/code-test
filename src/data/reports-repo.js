/**
 * Created by Darron on 1/29/2017.
 */

import EventBus from '../core/event-bus';
import usersRepo from './users-repo';
import shiftsRepo from './shifts-repo';

class ReportsRepo {
    constructor() {
        this.runReport = this.runReport.bind(this);
        EventBus.on('runReport', this.runReport);
        this.report = [];
    }

    runReport(params) {
        this.report = [];

        let startPlus4Weeks = new Date(params.startDate);
        startPlus4Weeks.setDate(startPlus4Weeks.getDate() + 28);

        for (let i = 0; i < params.users.length; i++) {
            let userShifts = shiftsRepo.getShiftsByUserAndDateRange(params.users[i],
                params.startDate,
                startPlus4Weeks
            );
            let user = usersRepo.getUserById(params.users[i]);
            this.applyRules(user, userShifts);
        }

        EventBus.emit("ranReport", this.report);
    }

    //internal use
    applyRules(user, shifts) {
        this.averageShiftsTotalHoursByWeek(user, shifts);
        this.twentyFourHourShift(user, shifts);
        this.eightHourBetweenShifts(user, shifts);
    }

    //internal use
    dateDiffInHours(start, end) {
        let oneHour = 1000 * 60 * 60;
        let startMs = start.getTime();
        let endMs = end.getTime();
        let diff = endMs - startMs;

        return diff / oneHour;
    }

    //internal use
    eightHourBetweenShifts(user, shifts) {
        let illegalShifts = [];
        let violations = 0;
        for (let i = 0; i < shifts.length; i++) {
            for (let j = 0; j < shifts.length; j++) {
                if (shifts[i].id === shifts[j].id) {
                    continue;
                }
                let shiftEndPlus8Hours = new Date(shifts[i].end);
                shiftEndPlus8Hours.setHours(shiftEndPlus8Hours.getHours() + 8);

                if (shifts[j].start > shifts[i].end && shiftEndPlus8Hours > shifts[j].start) {
                    if (!illegalShifts[shifts[j].id]) {
                        illegalShifts[shifts[j].id] = shifts[j];
                        violations++;
                    }
                }
            }
        }

        if (illegalShifts.length > 0) {
            this.createReportRecord(user, "8 Hours Between Shifts Violation", violations, illegalShifts);
        }
    }

    //internal use
    createReportRecord(user, description, numberOfViolations, violatingShifts) {
        this.report.push({
            user: user,
            description: description,
            numberOfViolations: numberOfViolations,
            violatingShifts: violatingShifts
        });
    }

    //internal use
    dayOff(user, shifts) {
        //todo
    }

    //internal use
    twentyFourHourShift(user, shifts) {
        let illegalShifts = [];
        for (let i = 0; i < shifts.length; i++) {
            let shiftLength = this.dateDiffInHours(shifts[i].start, shifts[i].end);
            if (shiftLength > 24) {
                illegalShifts.push(shifts[i]);
            }
        }
        if (illegalShifts.length > 0) {
            this.createReportRecord(user, "24 Hour Shift Violation", illegalShifts.length, illegalShifts);
        }
    }

    //internal use
    averageShiftsTotalHoursByWeek(user, shifts) {
        let totalHours = 0;
        let illegalShifts = [];
        for (let i = 0; i < shifts.length; i++) {
            totalHours += this.dateDiffInHours(shifts[i].start, shifts[i].end);
            if (totalHours > 320) {
                illegalShifts.push(shifts[i]);
            }
        }
        if ((totalHours / 4) > 80) {
            //brea
            this.createReportRecord(user, "80 Hour Average Work Week", illegalShifts.length, illegalShifts);
        }
    }
}
;

export default new ReportsRepo();