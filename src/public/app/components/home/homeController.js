/**
 * Created by michaeldfti on 21/02/17.
 */

angular
    .module('calculatorMS')
    .controller('homeController', homeController);

homeController.$inject = ['$scope'];

function homeController($scope) {

    $scope.historyDisplay = "0";
    $scope.currentDisplay = "0";
    $scope.operators      = ['÷','×','-','+'];
    $scope.executed       = false;
    $scope.showError      = false;

    $scope.dragOptions = {
        start: function(e) {},
        drag: function(e) {},
        stop: function(e) {},
        container: 'calculator'
    };


    function showErrorMessage(msg) {
        $scope.showError       = true;
        $scope.msgErrorDisplay = msg
    }

    function hideErrorMessage(clearAll) {
        if($scope.showError) {
            $scope.showError       = false;
            $scope.msgErrorDisplay = "";

            if(clearAll){
                $scope.clearAll();
            }
        }
    }


    function beforeEval(str) {
        str = str.replace(new RegExp("÷", 'g'), "/");
        str = str.replace(new RegExp("×", 'g'), "*");

        return str;
    }

    function isFloat(n) {
        return n === +n && n !== (n|0);
    }

    function deleteLastToken(){
        var found = false;
        var res   = "";

        for(var i=$scope.historyDisplay.length-1; i >=0 ; i--){

            if($scope.operators.indexOf($scope.historyDisplay.charAt(i)) > -1 && !found){
                found = true;
            }

            if(found){
                res = $scope.historyDisplay.charAt(i-1) + res;
            }
        }

        $scope.historyDisplay = res;
    }

    $scope.clearAll = function() {
        $scope.currentDisplay  = "0";
        $scope.historyDisplay  = "0";
        $scope.executed = false;

        hideErrorMessage(false);
    };

    $scope.clearCurrent = function() {
        $scope.currentDisplay  = "0";
        deleteLastToken();

        if($scope.executed){
            $scope.clearAll();
        }

        hideErrorMessage(true);
    };


    $scope.executeCurrentOperation = function () {

        try {
            var res = eval(beforeEval($scope.historyDisplay));

            if(isFloat(res)){
                res = res.toFixed(3);
            }

            $scope.currentDisplay  = res;
            $scope.historyDisplay  += "=" + res;
            $scope.executed        = true;

        }catch(err) {
            showErrorMessage("Invalid Operation!");
        }

    };

    $scope.keyClick = function (value) {

        value = value.toString();

        hideErrorMessage(true);

        //Limit of the history display
        if($scope.historyDisplay.length == 20){
            showErrorMessage("Data limit met!");
            return;
        }

        //Limit of the calculator's display
        if($scope.currentDisplay.length == 9 && $scope.operators.indexOf(value) == -1){
            return;
        }

        //console.log($scope.historyDisplay.length);


        //When the user to click at the operator
        if($scope.operators.indexOf(value) > -1){

            //If the user to press a operator key after it executed an operation
            if($scope.executed){

                $scope.historyDisplay = $scope.currentDisplay + value;
                $scope.currentDisplay = value;
                $scope.executed       = false;

                return;
            }


            if($scope.historyDisplay == 0) {
                $scope.historyDisplay = $scope.currentDisplay + value;
            }else{
                $scope.historyDisplay += value;
            }

            $scope.currentDisplay = value;

            return;
        }

        if($scope.executed){
            $scope.clearAll();
            return;
        }


        if($scope.currentDisplay == 0 || $scope.operators.indexOf($scope.currentDisplay.charAt(0)) > -1){
            $scope.currentDisplay = value;
        }else{
            $scope.currentDisplay += value;
        }

        if($scope.historyDisplay != 0){
            $scope.historyDisplay += value;
        }
    };

}
