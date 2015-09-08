/**
 * Created by pc on 2015/7/8.
 * @author wxl
 * @des :tabs 找车
 */
angular.module('starter.controllers')
    .controller('ChooseOptionCtrl', function($scope,$http,$location) {
             $http.get("http://mrobot.pcauto.com.cn/xsp/s/auto/buy/v1.3/chooseOption.xsp").success(function(data){
                     $scope.chooses=data.choose;
                 },
             function(err){

             });
        /*
         *@param $parent_index 父ng-repeat的$index $index是本ng-repeat的索引
         */
           $scope.itemClick=function($parent_index,$index){
                $scope.chooses[$parent_index].options.forEach(function(e,index){
                    if(index!=$index)e.show=!e.show;

                });
               $scope.itemCount=Math.floor(Math.random()*10);//生成1-10的随机数
           }

        /**
         * 重置按钮的操作对象
         */
          $scope.itemReset=function(){
               $scope.chooses.forEach(function(e){
                   e.options.forEach(function(eo){
                     eo.show=true;
                   });
               });
              itemCount=0;
          }

        $scope.itemCount=0;

        $scope.itemRange=function(rangeValue){
            $scope.itemCount=$scope.itemCount+Number(rangeValue);//一定要把string字段改为数据字段
        }


        $scope.itemCountClick=function(){
           // console.log($location.path())
            //跳转到查车结果表
            $location.path("/search/1");
         //   $scope.go('/search/1');
        }
    });
