const db = require("../db/db");
const utils = require("../utils/utils");
let Timer = require('../models/Timer');
const router = require('express').Router();

/**
 * Route serving creating new timer.
 * @name post/timers
 * Creates timestamp from post data and saves it to mongoDB
 * Then calling monitorNextTimer to create new scheduled job
 */

router.post('/timers' , async function (req , res){
    try {
        const { hours, minutes, seconds, url } = req.body;
        const timerTimeStamp = utils.calculateTimeStamp(hours, minutes, seconds);

        const newTimer = new Timer({
            date: timerTimeStamp,
            url
        });

        await newTimer.save();

        utils.monitorNextTimer(newTimer.url ,newTimer._id ,  newTimer.date);
        console.log(`New timer has been created with id=${newTimer._id} and url=${url}`)
        res.send({"id": newTimer._id})

    } catch (err) {
        console.log("There was an error in /timers api")
        res.status(500).send("Failed to create new timer")
    }
})

/**
 * Route serving getting a timer by its id.
 * @name get/timers/:id
 * Finds timer by id from mongoDB and returns its id and time left
 */


router.get('/timers/:id' , async function (req , res){

    try {
        const { _id, date } = await Timer.findOne({_id: req.params.id});
        const timeLeft = utils.calculateTimeLeft(date);
        console.log(`Get request: timerId=${_id} , timeLeft=${timeLeft}`)
        res.send({id: _id, time_left: timeLeft});
    } catch (err) {
        console.log("There was an error in /timers/:id api")
        res.status(500).send("Invalid ID: Not exist in the system")
    }

})

/**
 * Route for internal use and testing getting all timers data.
 * @name get/getAll
 */

router.get('/getAll' , async function (req , res){

    const data = await Timer.find();
    res.send(data)
})

/**
 * Route for internal use and testing deleting all timers data.
 * @name get/deleteAll
 */

router.delete('/deleteAll' , async function (req , res){

    await Timer.deleteMany({});
    res.send("All data deleted")
})

router.get('/' , function (req , res){
    res.status(200).json({message: "Server is running!"})
})

module.exports = router