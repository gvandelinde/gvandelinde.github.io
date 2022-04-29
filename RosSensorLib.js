(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
/**
 * If you use roslib in a browser, all the classes will be exported to a global variable called SENSORLIB.
 *
 * If you use nodejs, this is the variable you get when you require('roslib')
 */
var SENSORLIB = this.SENSORLIB || {
    REVISION: '0.0.1'
};

// Add sensors components
Object.assign(SENSORLIB, require('./sensors'));

global.SENSORLIB = SENSORLIB;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./sensors":5}],2:[function(require,module,exports){
/**
 * Template for object that publishes sensor data to the provided ROS topic.
 */
class IMU {
    

    /**
     * Creates a new sensor publisher that publishes to the provided topic.
     * @param {Topic} topic a Topic from RosLibJS
     */
    constructor(topic) {
        var self = this;
        this.topic = topic;
                
        // First need to detect first device orientation.
        this.orientationReady = false;
        this.motionReady = false;

        // Enable callback for deviceOrientationEvent
        window.addEventListener('deviceorientation', (event) => {
            this.onReadOrientation(self, event);
        });
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (event) => {
                this.onReadOrientation(self, event);
            });
        } else {
            window.alert('acceleration not supported!');
        }

        // start sensor
        this.start();
        console.log('started!');        
    }

    /**
     * Callback for when error occurs while reading sensor data.
     * @param {*} event containing error info.
     */
    onError(event) {
        throw 'onError method not defined!';
    }

    /**
     * Callback for reading sensor data.
     * Should publish data to ROS topic.
     * @param {*} event object containing sensor data.
     */
     onReadOrientation(self, event) {
        self.alpha = event.alpha;
        self.beta = event.beta;
        self.gamma = event.beta;
        self.orientationReady = true;
    }

    /**
     * Callback for reading sensor data.
     * Should publish data to ROS topic.
     * @param {*} event object containing sensor data.
     */
     onReadMotion(self, event) {
         
        var rotation = event.rotation;
        var acceleration = event.acceleration;
        // acceleration
        self.x = acceleration.x;
        self.y = acceleration.y;
        self.z = acceleration.z;
        // rotation
        self.valpha = rotation.alpha;
        self.vbeta = rotation.beta;
        self.vgamma = rotation.gamma;

        self.motionReady = true;
        
    }

    /**
     * Start the publishing of data to ROS.
     */
    start() {
        setInterval(() => {
            console.log('orientation: ' + this.alpha + ':' + this.beta + ':' + this.gamma + '.' + this.orientationReady);
            console.log('acceleration: ' + this.x + ':' + this.y + ':' + this.z + '.' + this.motionReady);
            console.log('rotation: ' + this.valpha + ':' + this.vbeta + ':' + this.vgamma);
            document.getElementById('motion').innerHTML = this.motionReady;
            document.getElementById('orientation').innerHTML = this.orientationReady;
        }, 2000);
    }

    /**
     * Stops the publishing of data to ROS.
     */
    stop() {
        throw 'stop method not defined!';
    }

    /**
     * Sets the maximum frequency at which new data can be published.
     */
    setPublishFrequency() {
        throw 'setPublishFrequency method not defined!';
    }
}

module.exports = IMU;
},{}],3:[function(require,module,exports){
/**
 * Template for object that publishes sensor data to the provided ROS topic.
 */
class SensorPublisher {
    /**
     * Creates a new sensor publisher that publishes to the provided topic.
     * @param {Topic} topic a Topic from RosLibJS
     */
    constructor(topic) {
        this.topic = topic;
    }

    /**
     * Callback for when error occurs while reading sensor data.
     * @param {*} event containing error info.
     */
    onError(event) {
        throw 'onError method not defined!';
    }

    /**
     * Callback for reading sensor data.
     * Should publish data to ROS topic.
     * @param {*} event object containing sensor data.
     */
    onReadData(event) {
        throw 'onReading method not defined!';
    }

    /**
     * Start the publishing of data to ROS.
     */
    start() {
        throw 'start method not defined!';
    }

    /**
     * Stops the publishing of data to ROS.
     */
    stop() {
        throw 'stop method not defined!';
    }

    /**
     * Sets the maximum frequency at which new data can be published.
     */
    setPublishFrequency() {
        throw 'setPublishFrequency method not defined!';
    }
}

module.exports = SensorPublisher;
},{}],4:[function(require,module,exports){
const SensorPublisher = require('./SensorPublisher.js');

class TestSensor extends SensorPublisher {
    constructor(topic, test) {
        super(topic);
        this.test = test;
    }
}

module.exports = TestSensor;
},{"./SensorPublisher.js":3}],5:[function(require,module,exports){
/**
 * This file tells @function require what to import when requiring the entire sensors folder.
 * 
 * Any module to be exported to the library should have an entry in the object below.
 */
module.exports = {
    TestSensor: require('./TestSensor'),
    IMU: require('./IMU')
};
},{"./IMU":2,"./TestSensor":4}]},{},[1]);
