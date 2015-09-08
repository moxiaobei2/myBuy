/**
 * Created by pc on 2015/7/8.
 * @author wxl
 * @des :tabs车型页
 */
angular.module('starter.controllers', ['ngAria', 'ngMaterial'])
    .controller('SerialBlankCtrl', function($scope,$http, $ionicSideMenuDelegate,$state) {//$ionicSideMenuDelegate用于右边内容的显示
        //品牌数据信息
       var url="http://mrobot.pcauto.com.cn/v2/price/brands";
       // var url="../json/brands.json";
        $http.get(url).success(function(data){//跨域请求真是坑爹
            var sections=data.sections;
            $scope.myvalues=sections;
            var indexs=[];
            sections.forEach(function(e,index){
                indexs.push(e.index);
            });
            $scope.indexs=indexs;
            $scope.indexsLength=Math.ceil((window.innerHeight-100)/indexs.length)+"px";

        },function(err){
            console.log("请求数据失败");
        });

        $scope.goToSerial=function(serialId){
            var url="http://mrobot.pcauto.com.cn/xsp/s/auto/buy/v1.3/serial.xsp?serialId="+serialId+"&areaId=1&isSubscribed=0&modelIds=&v=1.1.0";
           // $location.path("/iframe?url="+url);//跳转到中间页面
            $state.go('iframe',{from:url});//传参
        }
        $scope.toggleRightSideMenu = function(brandId) {
         //  var url="../json/serials.json";
           var url="http://mrobot.pcauto.com.cn/xsp/s/auto/buy/v1.3/getSerialListByBrandId.xsp?brandId="+brandId+"&type=1"
            $http.get(url).success(function(data){
                var manufacturers=data.manufacturers;
                manufacturers.forEach(function(e1,index1){
                    var count=0;
                    e1.serials.forEach(function(e,index){//对停售车系进行查看
                        if(e.carField==1){
                            count++;
                        }
                    });
                    manufacturers[index1].count=count;
                });
                $scope.manufacturers=manufacturers;//得到总的数据
                $ionicSideMenuDelegate.toggleRight();
            },function(err){
                console.log("get the error");
                console.log(err);
            });;

        };

      //  $scope.myvalues=[{'name':'ling'},{'name':'hong'}];
    });
