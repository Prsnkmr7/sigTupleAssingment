quintBuild = angular.module('quintDiamond-app', ['ui.router']);

// Route Provider Starts

quintBuild.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('Rules', {
            url: '/',
            templateUrl: 'Templates/rules.html'
        })
        .state('Easy', {
            url: '/Easy',
            templateUrl: 'Templates/home.html'
        })

});

// Info Controller Logic

quintBuild.controller('infoController', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
    $scope.user = {};
    $scope.submitForm = function (val) {
        if (val) {
            $rootScope.userName = $scope.user.name;
            $rootScope.mode = parseInt($scope.user.modeSelected);
            sessionStorage.clear();
            $state.go('Easy');
        }
    }
}]);


// Home Controller logic

quintBuild.controller('homeController', ['$scope', '$rootScope','$interval','$timeout','$state', function ($scope, $rootScope,$interval,$timeout,$state) {
    $scope.listItems = [];
    $scope.highScore = 0;
    $scope.yourScore = 0;
    $scope.ExchangeRateTimerDuration = 120;
    $scope.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    $scope.IpTimeTicker = function() {
        if ( $scope.ExchangeRateTimerDuration > 0 ) {
            $scope.getActive();
            $scope.ExchangeRateTimerDuration = $scope.ExchangeRateTimerDuration - 1;
        } else {
            $scope.transactionTimeOut = true;
            $scope.disableIpExchangeRateTimer();
        }
    };
    $scope.getActive = function() {
        var row = $scope.getRandomInt(0,3);
        var columnData = $scope.getRandomInt(0,3);
        if (row && columnData); {
        var data = $scope.listItems[row].column[columnData];
        if($scope.listItems.length > 0 && $scope.listItems[row].column && !data.active){
            data.active = true;
        }
        $timeout(function () {
            data.active = false;
    }, 1000);
        }
           
    }
    $scope.disableIpExchangeRateTimer = function() {
        $interval.cancel( $scope.ExchangeRateTimer );
        $scope.ExchangeRateTimer = '';
    };

    // Initial Functional called on load
    $scope.init = function () {
        $scope.userName = $rootScope.userName;
        $interval( $scope.IpTimeTicker, 1000 )
        gridGenerator($rootScope.mode);
    };

    var gridGenerator = function (val) {
        for(var i = 0;i<val;i++) {
            var gridStructure = {
                'name':'',
                'column':[]
            };
            gridStructure.name = i + 'Row';
            for(var j = 0;j<val;j++) {
                var column = {
                    'index':'',
                    'active':false
                };
                column.index = j;
                gridStructure.column.push(column);
            }
            $scope.listItems.push(gridStructure);
        };
    
    };

    $scope.boxIsClicked = function(val) {
        if(val.active) {
            $scope.highScore = $scope.highScore + 1;
        }else{
            if($scope.highScore > 0){
                $scope.highScore = $scope.highScore - 1;
            }
        }

    };

    $scope.resetValue = function () {
        $state.go('Rules');
    };
   
    $scope.init();

}]);
