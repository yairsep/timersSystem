const axios = require('axios');
const nodeSchedule = require("node-schedule");
const db = require("../db/db");
let Timer = require('../models/Timer');

/**
 * Calculating timestamp of the new Timer created
 * @param  {Number} hours  hours inserted for timer in post request
 * @param  {Number} minutes  minutes inserted for timer in post request
 * @param  {Number} seconds  seconds inserted for timer in post request
 * @return {Date} timestamp
 */

function calculateTimeStamp(hours, minutes, seconds) {

    const timestamp = Date.now() + ((hours * 60 + minutes) * 60000 + seconds * 1000)
    return timestamp;
}

/**
 * Calculating time left for a timer to be executred
 * @param  {Date} date  timestamp of the timer
 * @return {Date} timestamp or 0 if time has passed
 */

function calculateTimeLeft(date) {
    //return amount of seconds
    let timeLeft = Math.floor((date - Date.now()) / 1000)

    if (timeLeft < 0) {
        timeLeft = 0;
    }

    return timeLeft;
}

/**
 * If a timer should have fired when the server was down, the server should fire the web hook
 * after initializing.
 * The function differentiate from webhooks that should already been executed
 * and webhooks that still need to be called in the future
 * @return {void}
 */

async function checkForMissedWebHooks() {

    let finished =false;

    while (!finished){
        const timer = await Timer.findOneAndUpdate({fired: false , triggered: false} , {triggered: true});
        if (timer === null){
            break;
        }
        if (timer.date <= Date.now()){
            //Triggering web hooks that their time has already passed
            triggerExternalApiCalls(timer.url, timer._id)
        }
        else{
            //Triggering web hooks that their time is in the future
            monitorNextTimer(timer.url, timer._id, timer.date)
        }
    }
}

/**
 * Creating new scheduled job in order to execute specific timer using nodeSchedule module
 * @param  {String} url this url will be called once timer is triggered
 * @param  {Number} id  timer ID
 * @param  {Date} date  timer timestamp
 * @return {void}
 */

function monitorNextTimer(url, id, date) {

    nodeSchedule.scheduleJob(date, function () {
        triggerExternalApiCalls(url, id);
    })
}

/**
 * Triggering post request to timer.url/:id using axios and updating mongoDB
 * @param  {String} url axios will send post request to this url
 * @param  {Number} id  timer ID
 * @return {void}
 */

async function triggerExternalApiCalls(url, id) {

    try {
        await axios.post(`${url}/${id}`);
        console.log(`Post request to ${url}/${id} sent successfully!`)
    } catch (err) {
        console.log(`Failed to execute post request to: ${url}/${id}`)
    }
    await Timer.findOneAndUpdate({_id: id}, {fired: true});
}

module.exports = {
    calculateTimeStamp,
    calculateTimeLeft,
    checkForMissedWebHooks,
    monitorNextTimer
}