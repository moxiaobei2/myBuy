/**
 * Created by pc on 2015/7/8.
 * @author wxl
 * @des :tabs 工具
 */
angular.module('starter.controllers')
    .controller('SearchCtrl', function($scope,$http) {
      //  $scope.footHide=true;
        $scope.myItemTitle=[{'id':1,'title':'热门'},{'id':2,'title':'最贵'},{'id':3,'title':'最便宜'}];
         //$http.get("../json/search.json").success(function(data){
         //    $scope.mySearchValue=data.items;
         //});

        $http.get("http://mrobot.pcauto.com.cn/buy/price/search?devId=bee56a5dc4583400b6842e79009d0c72&appKey=782ae91ba147435a00000539&list=true&rid=1&ps=12&pe=75").success(function(results){
                   var data=results.data;
                   $scope.mySearchValue=data[0].items;},function(err){});
        $scope.modelShow=[false,false,false];
        $scope.searchModels=function(currentIndex,titleIndex){
            $scope.currentIndex=currentIndex;
            $scope.modelShow[titleIndex]=!$scope.modelShow[titleIndex];
        }
        $scope.searchModelsList=true;


    });
