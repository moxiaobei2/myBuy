/**
 * Created by pc on 2015/7/8.
 * @author wxl
 * @des :tabs 活动列表
 */
angular.module('starter.controllers')
    .controller('ActivityCtrl', function($scope,$http,$state) {
            var url="http://mrobot.pcauto.com.cn/buy/price/activityListv11?regionId=1&pageNo=1&pageSize=20&filter=1";
           //  var url="../json/activity.json";
             $http.get(url).success(function(results){
                 $scope.activities=results.data;
             });
            $scope.goActivityDetail=function(activityId){
                var url="http://mrobot.pcauto.com.cn/buy/price/activityDetailv11/"+activityId+"?areaId=1&dId=8de02a33d33a3a50988bb45c39281e2e";
                $state.go('iframe',{from:url});//早间iframe页面
            }
    });
