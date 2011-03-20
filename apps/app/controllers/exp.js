// ==========================================================================
// Project:   App.expController
// Copyright: ©2011 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

        A generic controller that will store the four input data streams in
 multiple forms to binding to a variety of experiments widgets

 @extends SC.ArrayController
 */

App.expController = SC.ArrayController.create({

    mostRecentTime: 0, // Time of the most recently acquired data set
    startTime:      0, // Experiment start time based on server

    //sending input parameters from the client to the server 
    // Variables for setting output to experiment
    desiredIn0: 0,
    desiredIn1: 0,
    numIn0:  0,//the current input0
    numIn1:  0,//the current input 1

    // Units of the outputs for display on UI
    unitIn0: 'V',
    unitIn1: 'V',

    //Sending the values from the server to the client
    // Variables for storing input to experiment
    numOut0: 0,
    numOut1: 0,
    numOut2: 0,
    numOut3: 0,

    // List or array of all data collected since the start of the experiment that
    // is useful for displaying on graphs
    listOut0: [SC.Object.create({})],
    listOut1: [SC.Object.create({})],
    listOut2: [SC.Object.create({})],
    listOut3: [SC.Object.create({})],

    // Units of the inputs for display on UI
    unitOut0: 'V',
    unitOut1: 'V',
    unitOut2: 'V',
    unitOut3: 'V',

    // String versions of input and outputs for binding with labels
    strOut0: '0V',
    strOut1: '0V',
    strOut2: '0V',
    strOut3: '0V',
    strIn0: '0V',
    strIn1: '0V',

    // Flags used to enable/disable buttons depending on experiment state
    // i.e. experiment progress currently paused means pause and start buttons disabled
    // and resume and stop buttons enabled
    // 0 = disabled, 1 = enabled
    flagResume: 0,
    flagPause:  0,
    flagStop:   0,
    flagStart:  1,
    expState:   0, // 1 = polling, 0 = not polling

    // Function returns variables responsible for holding experiment parameters back to default
    returnToDefaults: function(){
        this.set('mostRecentTime', 0);
        this.set('startTime', 0);

        this.set('desiredIn0', 0);
        this.set('desiredIn1', 0);
        this.set('numIn0', 0);
        this.set('numIn1', 0);

        this.set('numOut0', 0);
        this.set('numOut1', 0);
        this.set('numOut2', 0);
        this.set('numOut3', 0);

        this.set('listOut0', [SC.Object.create({})]);
        this.set('listOut1', [SC.Object.create({})]);
        this.set('listOut2', [SC.Object.create({})]);
        this.set('listOut3', [SC.Object.create({})]);

        this.set('strOut0', '0V');
        this.set('strOut1', '0V');
        this.set('strOut2', '0V');
        this.set('strOut3', '0V');
        this.set('strIn0', '0V');
        this.set('strIn1', '0V');

        this.set('unitOut0', 'V');
        this.set('unitOut1', 'V');
        this.set('unitOut2', 'V');
        this.set('unitOut3', 'V');
        this.set('unitIn0', 'V');
        this.set('unitIn1', 'V');
    },
    /*
     camera: '',
     prevTime: 0,

     cameraImage: function() {
     //  SC.Request.getUrl('/projects/lightbox2/images/image-2.jpg')
     //    .notify(this, this.receiveCameraImage)
     //    .send();
     this.receiveCameraImage();

     return YES;
     },

     receiveCameraImage: function() {
     //var imge = new Image();
     //imge = response.get('body');
     // console.log(imge.src);
     //this.set('camera', response.get('body'));
     /*
     var fh = fopen("blah.jpg", 3); // Open the file for writing

     if (fh != -1) {
     console.log("eeek");
     fwrite(fh, imge); // Write the string to a file
     fclose(fh); // Close the file
     }  */
    //App.expController.set('camera', 'http://foyercam.itee.uq.edu.au/axis-cgi/jpg/image.cgi');
    /*        SC.imageCache.loadImage('http://foyercam.itee.uq.edu.au/axis-cgi/jpg/image.cgi', App.expController, App.expController.imageDidLoad, false);

     setTimeout(function() {
     //   var happy = new Date();
     //var imgStampURL = 'http://foyercam.itee.uq.edu.au/axis-cgi/jpg/image.cgi?' + happy.getTime();
     //SC.imageCache.loadImage(imgStampURL, App.expController, App.expController.imageDidLoad, true);
     console.log("eep");
     App.expController.set('camera', '');
     SC.imageCache.releaseImage('http://foyercam.itee.uq.edu.au/axis-cgi/jpg/image.cgi', App.expController, App.expController.deloaded);
     }, 500);
     },

     imageDidLoad: function(imageUrl, imageOrError) {
     console.log(imageUrl);
     App.expController.set('camera', imageUrl);
     // SC.imageCache.reloadImage('http://foyercam.itee.uq.edu.au/axis-cgi/jpg/image.cgi');


     },

     deloaded: function() {
     App.expController.receiveCameraImage();
     }, */

    // Function is to be bound to the start button and used to:
    // 1. Send a request to the server to obtain the start time
    // 2. Let the server know that it needs to start polling the LabJack
    // 3. Get the client to start polling the server to obtain experiment data
    //    for display
    startExp: function() {
        this.set('flagStart', 0);
        this.set('flagPause', 1);
        this.set('flagStop', 1);

        // Define the graph labels and create a single point at time = 0
        this.set('listOut0', [
            SC.Object.create({
                label: 'in0',
                data:[[0,0]]
            })
        ]);

        this.set('listOut1', [
            SC.Object.create({
                label: 'in1',
                data:[[0,0]]
            })
        ]);

        this.set('listOut2', [
            SC.Object.create({
                label: 'in2',
                data:[[0,0]]
            })
        ]);

        this.set('listOut3', [
            SC.Object.create({
                label: 'in3',
                data:[[0,0]]
            })
        ]);

        // Send a request to the server to start polling for experiment data
        var expID = App.expListController.get('expID');
        var authCookie = SC.Cookie.find('SESS');
        SC.Request.getUrl('/rest/start/' + expID)
                .header({
            'Cookie': authCookie.name
        })
                .notify(this, this.expStarted)
                .send();
    },

    // Callback function which store the start time and start polling server
    expStarted: function(response) {
        // Check to see if the HTTP response status is 200 OK
        if (SC.ok(response)) {
            var startTime = response.get('body');
            this.set('checked', 0);
            this.set('startTime', startTime);

            // Run pollExp which will continuously call itself at a set interval
            // to poll the server for data
            this.pollExp(this.get('mostRecentTime'));
        }
    },

    // Function will check to see if user has changed the output:
    // a. yes, then send a request to change output and continue to poll
    // b. no, then just continue to poll
    pollExp: function(mostRecentTime) {
        var expID = App.expListController.get('expID');
        var authCookie = SC.Cookie.find('SESS');

        var desIn0 = this.get('desiredIn0');
        var currIn0 = this.get('numIn0');
        var desIn1 = this.get('desiredIn1');
        var currIn1 = this.get('numIn1');
        console.log(this.get('desiredIn0')+"   HIP"+this.get('numIn0'));
        if ((desIn0 !== currIn0) || (desIn1 !== currIn1)) {
            this.set('numIn0', desIn0);
            this.set('numIn1', desIn1);

            var sendMessage = {
                "out0": desIn0,
                "out1": desIn1
            };

            SC.Request.putUrl('/rest/param/' + expID)
                    .header({
                'Accept': 'application/json',
                'Cookie': authCookie.name
            })
                    .json()
                    .notify(this, this.didChangeSlider)
                    .send(sendMessage);

        } else
            this.doPoll(mostRecentTime);
    },

    doPoll: function(mostRecentTime) {
        var expID = App.expListController.get('expID');
        var authCookie = SC.Cookie.find('SESS');

        var pollMessage = expID + '/' + mostRecentTime;
        SC.Request.getUrl('/rest/poll/' + pollMessage)
                .header({
            'Cookie': authCookie.name
        })
                .json()
                .notify(this, this.getPolled)
                .send();
    },

    // This function to get the response from the server to fetch the graph with the voltage value
    getPolled: function(response) {
        if (SC.ok(response)) {
            var resBody = response.get('body');
            var state = this.get('expState');
            var startTime = this.get('startTime');
            var dataIn0 = this.get('listOut0').copy();
            var dataIn1 = this.get('listOut1').copy();
            var dataIn2 = this.get('listOut2').copy();
            var dataIn3 = this.get('listOut3').copy();

            var emptyTest = {
                time: -1,
                value: -1
            };

            // Fetch the graph with the server paramaters (voltage, the time)
            if (this.testEquivalent(resBody, emptyTest) === false) {
                App.store.createRecords(App.Voltage, resBody.isEnumerable ? resBody : [resBody]);
                var indRec = App.store.find(App.Voltage);
                var recTime = indRec.getEach('time');
                var recVal = indRec.getEach('dataVal');
                var dataType = indRec.getEach('dataType');

                for (var i = 0; i < dataType.length; i++) {
                    if (i === (dataType.length - 1))
                        this.set('mostRecentTime', recTime[i]);

                    if (dataType[i] === 'ain0') {
                        dataIn0.objectAt(0).get('data').pushObject([((recTime[i] - startTime)/1000), recVal[i]]);
                        this.set('numOut0', recVal[i]);
                        this.set('strOut0', (recVal[i].toFixed(3) + "V"));
                    } else if (dataType[i] === 'ain1') {
                        dataIn1.objectAt(0).get('data').pushObject([((recTime[i] - startTime)/1000), recVal[i]]);
                        this.set('numOut1', recVal[i]);
                        this.set('strOut1', (recVal[i].toFixed(3) + "V"));
                    } else if (dataType[i] === 'ain2') {
                        dataIn2.objectAt(0).get('data').pushObject([((recTime[i] - startTime)/1000), recVal[i]]);
                        this.set('numOut2', recVal[i]);
                        this.set('strOut2', (recVal[i].toFixed(3) + "V"));
                    } else if (dataType[i] === 'ain3') {
                        dataIn3.objectAt(0).get('data').pushObject([((recTime[i] - startTime)/1000), recVal[i]]);
                        this.set('numOut3', recVal[i]);
                        this.set('strOut3', (recVal[i].toFixed(3) + "V"));
                    }
                }

                this.set('listOut0', dataIn0);
                this.set('listOut1', dataIn1);
                this.set('listOut2', dataIn2);
                this.set('listOut3', dataIn3);
                App.expListController.destroyExpRecords();
            }

            // If pause or stop button is not pressed then continue to poll server
            if (state === 0) {
                setTimeout(function() {
                    App.expController.pollExp(App.expController.get('mostRecentTime'));
                }, 1000);
            }
        }
    },

    // this function is the response from the server avout changing the voltage (slider)
    didChangeSlider: function (response) {
        if (SC.ok(response)) {
            console.log("Voltage change successful with new value = " + response.get('body'));

            this.doPoll(this.get('mostRecentTime'));
        }
    },

    // Function to resume the experiment
    resumeExp: function() {
        this.set('expState', 0);
        this.set('flagStart', 0);
        this.set('flagStop', 1);
        this.set('flagPause', 1);
        this.set('flagResume', 0);
        var authCookie = SC.Cookie.find('SESS');
        var expID = App.expListController.get('expID');

        // Send resume request to the server
        SC.Request.getUrl('/rest/resume/' +expID)
                .header({
            'Cookie': authCookie.name
        })
                .json()
                .send();
        this.pollExp(this.get('mostRecentTime'));
    },

    // Function to pause the experiment
    pauseExp: function() {
        this.set('expState', 1);
        this.set('flagStart', 0);
        this.set('flagStop', 1);
        this.set('flagPause', 0);
        this.set('flagResume', 1);
        var authCookie = SC.Cookie.find('SESS');
        var expID = App.expListController.get('expID');
        // Send pause request to the server
        SC.Request.getUrl('/rest/pause/' + expID)
                .header({
            'Cookie': authCookie.name
        })
                .json()
                .send();
    },

    // Function to stop the experiment
    stopExp: function() {
        this.returnToDefaults();
        App.expSelectController.clearUI();
        this.set('checked', 1);
        this.set('flagStart',true);
        this.set('flagStop',false);
        this.set('flagPause',false);
        this.set('flagResume',false);
        var authCookie = SC.Cookie.find('SESS');
        var expID = App.expListController.get('expID');

        //send a stop request to the server
        SC.Request.getUrl('/rest/stop/' + expID)
                .header({
            'Cookie': authCookie.name
        })
                .json()
                .send();
        var query = SC.Query.local(App.Prevexptask);
        App.prevExpController.destroyData(query);
        App.prevExpController.getPreviousExpList(); // Update the previous experiment records
        this.invokeLater(function() {
            App.expSelectController.set('nowShowing', 'selectContainer'); // Direct the user back to the expList container
        });
    },

    // Function to test the response from the server about fetching the graph with the voltage from the experiment
    testEquivalent: function(a, b) {
        var result = true;
        function typeTest(a, b) {
            return (typeof a == typeof b)
        }
        function test(a, b) {
            if (!typeTest(a, b))
                return false;
            if (typeof a == 'function' || typeof a == 'object') {
                for (var p in a) {
                    result = test(a[p], b[p]);
                    if (!result)
                        return false;
                }
                return result;
            }
            return (a == b);
        }
        return test(a, b);
    }
});
