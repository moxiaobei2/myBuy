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
    .controller('ChatsCtrl', function($scope, Chats,socket,$localStorage) {//Chats这个是个server
        var user=$localStorage.getObject('user');
        socket.emit('get_user_list',user);//通过用户信息去查用户弄表
        socket.on("get_user_list_result",function(arr){
             var groups=[];
             arr.forEach(function(e,index){
                 if(index==0)
                 groups.push({'tid':e.tid,'tname': e.tname,friends:[e]});
                 else{
                     groups.forEach(function(e1,index){
                         if(e1.tid== e.tid){
                             groups[index].friends.push(e);
                         }
                     });
                 }

             });

            $scope.groups=groups;//这次没有错啦 ，只有一个分组，且这个分组里有三个好友
        });
        socket.on("get_user_list_last_result",function(results){
            $scope.groups.forEach(function(e){
                e.friends.forEach(function(e1){
                    if(e1.id==results.cid||e1.id==results.uid){//这里用于存储最后一条信息
                        e1.lastContent=results.content;
                    }
                });
            })
        });
        $scope.chats = Chats.all();//Chats.all是一个方法
        $scope.remove = function(chat) {
            Chats.remove(chat);
        }
    });