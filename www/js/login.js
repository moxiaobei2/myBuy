/**
 * Created by pc on 2015/4/15.
 */
//'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:ChatCtrl
 * @description
 *
 */

angular.module('starter.controllers')
    .controller('LoginCtrl', function($scope,socket,$localStorage,$state) {//Chats这个是个server
        //返回注册的结果
        socket.on("user_reg_result",function(result){
            if(result.code==0){
                var uid=result.uid;
               // $localStorage.setObject(uid,$scope.user);//设置本地变量
                window.location.href="#/chats";
            }else{
                console.log("register fail");
                console.log(result.error);
            }

        });

        socket.on('check_email_result', function (data) {
            console.log(data)
                if (data.code) {
                    console.log('此邮箱已注册');
                } else {

                    socket.emit("user_reg",$scope.user);//邮箱不存在，那么就进行插件操作
                    return true;//true才可以进行下一步，否则执行不了。
                }
            });


        socket.on('login_result', function (data) {
            if (!data.code) {//data.code==0 表登录成功
               console.log($scope.user.nick+'正在登录...');
                $localStorage.setObject("user",data.user);//设置本地变量
                $state.go("chats");//跳转到聊天列表

            } else {
                console.log("登录失败");
            }
        });

        $scope.user={};
        $scope.isDisabled = true;
        $scope.click=function($event){
         $scope.isRegister=true;
       }
          $scope.login=function($event){
            socket.emit("user_login",$scope.user);
        }

        $scope.register=function(){
             socket.emit("check_email",$scope.user);
            //这里进行js验证，然后才能进行 reg操作

        }






});