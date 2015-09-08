/**
 * Created by pc on 2015/7/8.
 * @author wxl
 * @des :中间frame页面
 */
angular.module('starter.controllers')
    .controller('IframeCtrl', function($scope,$stateParams) {
      ///  console.log($scope)
        $scope.fromURL=$stateParams.from;//得到url的值
    });
