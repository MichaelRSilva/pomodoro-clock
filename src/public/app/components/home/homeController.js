/**
 * Created by michaeldfti on 21/02/17.
 */

angular
    .module('pomodoroClock')
    .controller('homeController', homeController);

homeController.$inject = ['$scope', '$interval'];

function homeController($scope, $interval) {

    $scope.sessionTime          = twoDigits(25);
    $scope.dateBase             = "01/01/1970 00:00:00";
    $scope.breakTime            = twoDigits(5);
    $scope.juiceWhole           = 282;
    $scope.currentTime          = moment($scope.dateBase, "DD/MM/YYYY HH:mm:ss").add($scope.sessionTime, 'minutes');
    $scope.currentTimeToShow    = $scope.currentTime.format("mm:ss");
    $scope.status               = "paused";
    $scope.sound                = true;
    $scope.timePointer          = null;
    $scope.running              = "session";
    $scope.cupContentPercent    = 100;


    /**
     * Increase the local time
     * @param local: Can be break or session
     */
    $scope.upTime = function (local) {

        if($scope.status != "running"){
            $scope[local+"Time"]        = twoDigits(parseInt($scope[local+"Time"]) + 1);

            if(local == "session"){
                $scope.currentTime          = $scope.currentTime.add(1, 'minute');
            }

            $scope.resetTime();
        }
    };

    /**
     * Decrease the local time
     * @param local: Can be break or session
     */
    $scope.downTime = function (local) {

        if($scope.status != "running") {

            $scope[local + "Time"] = twoDigits(parseInt($scope[local + "Time"]) - 1);

            if (local == "session") {
                $scope.currentTime = $scope.currentTime.subtract(1, 'minute');
            }

            $scope.resetTime();
        }
    };


    /**
     * Turn off the alert sound, then when to end the session, it will not transmit sound
     */
    $scope.turnOffSound = function () {
        $scope.sound = false;
    };

    /**
     * Turn on the alert sound (default), then when to end the session, it will transmit sound
     */
    $scope.turnOnSound = function () {
        $scope.sound = true;
    };


    /**
     * To run pomodoro clock and yours effects: decrease time and decrease cup content
     */
    $scope.playPomodoro = function () {

        $scope.status                   = "running";

        function decreaseCurrentTime() {
            $scope.currentTime          = $scope.currentTime.subtract(1, 'second');
            $scope.currentTimeToShow    = $scope.currentTime.format("mm:ss");

            $scope.calculateCupPercent();
            $scope.changeJuiceContent();
            $scope.controlTimeType();
        }

        $scope.timePointer = $interval(decreaseCurrentTime, 1000);

    };

    /**
     * Calculate the cup's content percent
     */
    $scope.calculateCupPercent = function (defaultPercent) {

        if(!defaultPercent){
            var start              = moment($scope.dateBase, "DD/MM/YYYY HH:mm:ss").add($scope.sessionTime, 'minutes');
            var duration           = moment.duration(start.diff($scope.currentTime)).asSeconds();
            var secs               = $scope.sessionTime * 60;

            if($scope.running == 'session'){
                $scope.cupContentPercent                = 100 - (duration*100)/secs;
            }else{
                $scope.cupContentPercent                = (duration*100)/secs;
            }
        }else{
            $scope.cupContentPercent                    = defaultPercent;
        }
    };

    /**
     * Verify if the time session or time break ended. If yes, change the local to session or break
     */
    $scope.controlTimeType = function () {

        //break
        if($scope.cupContentPercent <= 0){

            $scope.currentTime          = moment($scope.dateBase, "DD/MM/YYYY HH:mm:ss").add($scope.sessionTime, 'minutes');
            $scope.currentTimeToShow    = $scope.currentTime.format("mm:ss");

            if($scope.sound){
                $scope.playAudioStartBreak();
            }

            $scope.running = 'break';

        }else{

            //session
            if($scope.cupContentPercent >= 100){
                $scope.currentTime          = moment($scope.dateBase, "DD/MM/YYYY HH:mm:ss").add($scope.breakTime, 'minutes');
                $scope.currentTimeToShow    = $scope.currentTime.format("mm:ss");

                if($scope.sound){
                    $scope.playAudioStartSession();
                }

                $scope.running = 'session';
            }

        }
    };

    /**
     * To pause pomodoro clock and yours effects: show play button.
     */
    $scope.pausePomodoro = function () {

        $scope.status               = "paused";

        if($scope.timePointer){
            $interval.cancel($scope.timePointer);
        }
    };



    /**
     * Do the calculation of the juice's quantity in the cup
     */
    $scope.changeJuiceContent = function () {

        var quantity               = ($scope.cupContentPercent * $scope.juiceWhole)/100;
        angular.element(document.getElementById('juice-content')).css("height", quantity + "px");

    };


    /**
     * Reset the session time and break time for default value.
     */
    $scope.resetTime = function () {
        $scope.currentTime          = moment($scope.dateBase, "DD/MM/YYYY HH:mm:ss").add($scope.sessionTime, 'minutes');
        $scope.currentTimeToShow    = $scope.currentTime.format("mm:ss");
        $scope.status               = "session";

        $scope.pausePomodoro();
    };


    /**
     * Play a audio when start a new session
     */
    $scope.playAudioStartSession = function() {
        var audio = new Audio('https://dl.dropboxusercontent.com/s/hbl00a2no1eqd64/start_session.mp3');
        audio.play();
    };

    /**
     * Play a audio when start a new break
     */
    $scope.playAudioStartBreak = function() {
        var audio = new Audio('https://dl.dropboxusercontent.com/s/bjq9rx7iz4tuxp6/start_break.mp3');
        audio.play();
    };



    //Call default functions
    $scope.calculateCupPercent(100);
    $scope.changeJuiceContent();



}
