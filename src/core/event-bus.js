/**
 * Created by Darron on 1/29/2017.
 */

import Event from 'events';

let eventBus = new Event.EventEmitter();
module.exports = eventBus;
