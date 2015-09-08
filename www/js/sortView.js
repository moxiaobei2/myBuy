/**
 * Created by Administrator on 2015/7/8.
 */
angular.module('starter.services')
.factory('sortView',function(){
        return {
            restrict: 'A',//attribute属性
          //  require: 'ngModel',
            transclude: true,
            controller: function ($scope,$http) {
                 var url="";
                 var p = $http({

                    method:'GET',

                    url:'/json'

                });

                p.success(function(response, status, headers, config){
                    console.log(response);
                    //$scope.name = response.name;

                });


            }
        }
    })
