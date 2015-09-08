/**
 * Created by pc on 2015/7/8.
 * @author wxl
 * @des :tabs 优惠弄表
 */
angular.module('starter.controllers')
    .controller('PromotionListCtrl', function($scope,$http,$state) {
        var url="http://mrobot.pcauto.com.cn/xsp/s/auto/buy/v1.2/promotionList.xsp?pageSize=10&pageNo=1&areaId=1";
        // var url="../json/promotion.json";
         $http.get(url).success(function(data){
             $scope.mySearchValue=data.models;
         });
        $scope.modelShow=false;
        //$scope.isTab=true;
        $scope.searchModels=function(currentIndex,$event){
            $event.stopPropagation();//去掉冒泡事件
            $scope.currentIndex=currentIndex;
            $scope.modelShow=!$scope.modelShow;
        }

        $scope.goPromotionDetail=function(marketId){
           var url="http://mrobot.pcauto.com.cn/xsp/s/auto/buy/v1.2/promotionDetail.xsp?marketId="+marketId;
            $state.go('iframe',{from:url});//早间iframe页面
        }

        $scope.goToModel=function(modelId){
            var url="http://mrobot.pcauto.com.cn/xsp/s/auto/buy/v1.3/model.xsp?v=1.1.0&areaId=1&isSubscribed=0&modelId="+modelId;
            $state.go("iframe",{from:url});
        }

        $scope.goToSerial=function(serialId){
            var url="http://mrobot.pcauto.com.cn/xsp/s/auto/buy/v1.3/serial.xsp?serialId="+serialId+"&areaId=1&isSubscribed=0&modelIds=&v=1.1.0";
            // $location.path("/iframe?url="+url);//跳转到中间页面
            $state.go('iframe',{from:url});//传参
        }

        $scope.getPromotion=function(dealerId,modelId){
           var url="http://mrobot.pcauto.com.cn/buy/price/modelMessage/"+modelId+"?areaId=1";//通过代理拿车型基础信息
           // var url="../json/modelMessage.json";//通过代理拿车型基础信息
            $http.get(url).success(function(data){
                var serialId=data.serialId;
                var modelName=data.modelName;
                var image=data.url_120x90;
                var url="http://mrobot.pcauto.com.cn/xsp/s/auto/buy/v1.2/getPromotion.xsp?areaId=1&dealerId="+dealerId+"&serialId="+serialId+"&modelId="+modelId+"&modelName=" +modelName+
                    "&image="+image+"&v=1.1.0";
                console.log(url);
                $state.go('iframe',{from:url});//传参
            },function(err){
                console.log("error");
            });
            //跳转到我要优惠页面

        }

    });
