/**
 * Created by pc on 2015/7/8.
 * @author wxl
 * @des :tabs 工具
 */
angular.module('starter.controllers')
    .controller('ToolCtrl', function($scope,$http,$localStorage,$stateParams) {
            $scope.isLogin=false;//默认是false
            if($stateParams.isLogin==1)$scope.isLogin=true;//已经登录后返回到tool页面时在页面上显示的内容

            if($localStorage.getObject("user")){//已经登录过之后
                $scope.isLogin=true;
            }
         $scope.clearCache=function(){
             $localStorage.setObject("user",null);
             $scope.isLogin=false;
         }
    });
