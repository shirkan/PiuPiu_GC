/**
 * Created by shirkan on 12/7/14.
 */

//  <------ Spawning Mechanism (SM) ------>
//  Spawning options:
//  constantTempo - spawn cb every intervalStep seconds
//  rangeTime - spawn cb in a random time between intervalMin to intervalMax, with steps of size intervalStep. for example: range = [0..1000], step = 10.
//  rangeCount - spawn cb every intervalStep seconds, between intervalMin to intervalMax times a level. BE CAREFUL WHEN USING THIS ONE WITH LEVEL DECIDERS!

exports = Class(function () {
    
    this.init = function () {
        this.reset();
    };
    
    //  Clear variables
    this.reset = function () {
        this.availableSpawnTimings = null;
        this.target = null;
        this.callback = null;
        this.scheduler = null;
        this.intervalType = 0;
        this.intervalStep = 0;
        this.intervalMin = 0;
        this.intervalMax = 0;
        this.count = 0;
    };

    this.validate = function (){
        if (this.intervalMax < this.intervalMin) {
            console.log("SM Error! intervalMax is bigger than intervalMin!");
            return false;
        }
        return true;
    };

    //  Initalize variables according to level settings.
    //  "target" is the target running current level and is used for updating the scheduler.
    //  "cb" is the callback for spawning
    this.init = function(target, cb, intervalType, intervalStep, intervalMin, intervalMax) {
        this.reset();
        this.target = target;
        this.callback = cb;
        this.intervalType = intervalType;
        this.intervalStep = intervalStep;
        this.intervalMin = intervalMin;
        this.intervalMax = intervalMax;
        this.scheduler = null;

        switch (this.intervalType) {
            case ("constantTempo"):
            {
                this.availableSpawnTimings = this.intervalStep;
                return;
            }
            case ("rangeTime"):
            {
                if (!this.validate()) { return; }
                var iterator = this.intervalMin;
                this.availableSpawnTimings = [];
                while (iterator <= this.intervalMax) {
                    this.availableSpawnTimings.push(iterator);
                    iterator+= this.intervalStep;
                }
                return;
            }
            case ("rangeCount"):
            {
                if (!this.validate()) { return; }
                this.availableSpawnTimings = this.intervalStep;
                this.count = randomNumber(this.intervalMin, this.intervalMax, true);
                //this.count = Math.floor(Math.random() * (this.intervalMax - this.intervalMin + 1) + this.intervalMin);
                return;
            }
            case ("none"):
            default:
            {
                return;
            }
        }
    };

    //  Start first step
    this.start = function () {
        switch (this.intervalType) {
            case ("constantTempo"):
            {
                //  Run level, wait 1 second before actually starting the level
                this.scheduler = setInterval(bind(this.target, this.callback), this.intervalStep);
                //cc.director.getScheduler().scheduleCallbackForTarget(this.target, this.callback, this.intervalStep, cc.REPEAT_FOREVER, 1);
                return;
            }
            case ("rangeTime"):
            {
                //  Run level, wait 1 second before actually starting the level
                this.scheduler = setTimeout(bind(this.target, this.callback), this.intervalMin);
                //cc.director.getScheduler().scheduleCallbackForTarget(this.target, this.callback, this.intervalMin, cc.REPEAT_FOREVER, 1);
                return;
            }
            case ("rangeCount"):
            {
                this.scheduler = setInterval(bind(this.target, this.callback), this.intervalStep);
                //cc.director.getScheduler().scheduleCallbackForTarget(this.target, this.callback, this.intervalStep, cc.REPEAT_FOREVER, 1);
                return;
            }
            case ("none"):
            default:
            {
                return;
            }
        }
    };

    //  Set scheduler next step
    this.step = function () {
        switch (this.intervalType) {
            case ("constantTempo"):
            {
                //  No need to do nothing
                return;
            }
            case ("rangeTime"):
            {
                var interval = this.availableSpawnTimings[(randomNumber(0, this.availableSpawnTimings.length, true))];
                if (isDebugMode()) { console.log("interval is " + interval); }
                this.scheduler = setTimeout(bind(this.target, this.callback), interval);
                //cc.director.getScheduler().scheduleCallbackForTarget(this.target, this.callback, interval, cc.REPEAT_FOREVER);
                return;
            }
            case ("rangeCount"):
            {
                this.count--;
                if (this.count <= 0) { this.stop(); }
                return;
            }
            case ("none"):
            default:
            {
                return;
            }
        }
    };

    this.stop = function () {
        if (this.intervalType == "rangeTime") {
            clearTimeout(this.scheduler);
        } else {
            clearInterval(this.scheduler);
        }

        //cc.director.getScheduler().unscheduleCallbackForTarget(this.target, this.callback);
    };
});
