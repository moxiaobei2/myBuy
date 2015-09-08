angular.module('starter.services', ['ngAria', 'ngMaterial','btford.socket-io'])
    .factory('socket',function(socketFactory){
    //Create socket and connect to http://chat.socket.io
     var myIoSocket = io.connect('ws://192.168.22.145:8884/')
        mySocket = socketFactory({
            ioSocket: myIoSocket
        });

        mySocket.on('open', function (data) {//服务器会调用Open函数
            if(!mySocket) {
                alert('没有连接到服务器');
                return;
            }
            console.log("connect response:"+data);
        });
    return mySocket;
})
.factory('Chats', function() {//聊天列表
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
    //定位directive
    .directive('geolation',function() {
      return {
        restrict: 'A',//attribute属性 div geolation
        template:"{{location}}",
        transclude:true,
        link:function(scope, element, attrs) {//js 函数
          element.bind("click",function(){//从link中去绑定元素的click事件
           // console.log(scope);
               window.location.href="#/tab/promotionList";//跳转到其他页面
          })
        },
        controller: function ($rootScope,$cordovaGeolocation, $cacheFactory,$http,$window) {
          if ($window.localStorage.getItem("location")== null) {
            $cordovaGeolocation.getCurrentPosition().then(function (position) {
              // Position here: position.coords.latitude, position.coords.longitude
              //是否支持定位 得到经纬度
              var lng = position.coords.longitude, lat = position.coords.latitude;
              $http.jsonp('http://api.map.baidu.com/geoconv/v1/?coords=' + lng + ',' + lat + '&from=1&to=5&ak=A226e59f9ee3bbbe0fcc35878b45787b&callback=JSON_CALLBACK').success(
                  function (data) {
                    $http.jsonp('http://api.map.baidu.com/geocoder/v2/?ak=A226e59f9ee3bbbe0fcc35878b45787b&callback=?&location=' + data.result[0].y + ',' + data.result[0].x + '&output=json&pois=0&callback=JSON_CALLBACK').success(function (result) {
                      var city = result.result.addressComponent.city;//城市
                      var province = result.result.addressComponent.province;//省
                      $rootScope.location =city;
                      $window.localStorage.setItem("location",city);

                    })
                  });

            }, function (err) {
              $rootScope.location = "广州市";//是一个对像
            });
          }else{
            $rootScope.location=$window.localStorage.getItem("location");
          }
        }
      }
    })
    .directive('scrollIf', function () {
    var getScrollingParent = function(element) {
        element = element.parentElement;
        while (element) {
            if (element.scrollHeight !== element.clientHeight) {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    };
    return function (scope, element, attrs) {
        scope.$watch(attrs.scrollIf, function(value) {
            if (value) {
                var sp = getScrollingParent(element[0]);
                var topMargin = parseInt(attrs.scrollMarginTop) || 0;
                var bottomMargin = parseInt(attrs.scrollMarginBottom) || 0;
                var elemOffset = element[0].offsetTop;
                var elemHeight = element[0].clientHeight;

                if (elemOffset - topMargin < sp.scrollTop) {
                    sp.scrollTop = elemOffset - topMargin;
                } else if (elemOffset + elemHeight + bottomMargin > sp.scrollTop + sp.clientHeight) {
                    sp.scrollTop = elemOffset + elemHeight + bottomMargin - sp.clientHeight;
                }
            }
        });
    }
}).directive('sortview',function(){//首页车每次分类
      return {
          scope: {
            "mySortData": "="//,
          //  "toggleRightSideMenu":"&"//局部作用域
          },
          priority: 'template',
          restrict: 'A',
          replace: true,
          require: '?ngModel',
          transclude: true,
          template: '<div >' +
          '<li class="item item-divider none top" id="top_div" ></li>' +
          '<ul class="list list-borderless" ng-repeat="section in mySortData"  >' +//scroll-if="true"
          '<li class="item item-divider" id="index{{section.index}}">{{section.index}}</li>' +
          '<div ng-repeat="brand in section.brands">' +
          '<li class="item item-thumbnail-left item-light"  ng-click="toggleRightSideMenu(brand.id)"><img src="{{brand.logo}}">{{brand.name}}</li>' +
          '</div></ul>' +
          '</div>',
          link:function(scope,eles,attrs) {
              scope.toggleRightSideMenu= function (brandId) {
                  scope.$parent.toggleRightSideMenu(brandId);//调用父类的方法
              }
          }
      }
    })
    .directive('sidebarR',function(){//首页车每次分类
      return{
                restrict: 'A',//attribute属性 div geolation
                replace:true,
                transclude:false,
                scope:{
                  "myDataKey":"=",
                   "myDataLength":"="
                },
               template:'<div style="float:right;margin-top:40px;">'+
                          '<div ng-repeat="dial in myDataKey"  style="height:{{myDataLength}};width:20px;">'+
                          '<md-button ng-click="onAclick($event,dial)" class="md-no-style"  >'+
                          '{{dial}}'+
                          ' </md-button>'+
                          '</div>'+
                          '</div>',
               controller:function($scope,$window,$location,$anchorScroll){
                    $scope.onAclick=function($event,key){//跳转到锚点
                        if($event.$material){
                            $location.hash("index"+key);
                            $anchorScroll();
                        }

                    }
               }
      }
    })
    .directive('topStriped',function(){//首页车每次分类
        return {
            restrict: 'A',
            replace: true,
            transclude:true,
            scope: {
                "myItemTitle": "=",
                "mySearchValue": "="
            },
            template:  '<div class="tabs tabs-top tabs-striped" >'+
            '<a class="tab-item" style="max-width:100%" ng-init="$index==0?item.active=true:item.active=false"  ng-class={"active":item.active} ng-repeat="item in myItemTitle" ng-click="onItemTapClick($index)">{{item.title}}</a>'+
            ' </div>',
            controller: function ($scope) {
                $scope.onItemTapClick=function (currentIndex){
                    $scope.myItemTitle.forEach(function(e,index){
                        if(index==currentIndex){
                            e.active=true;
                        }else{
                            e.active=false;
                        }
                    })
                }


            }
        }
    })
    //抽离模板
    .directive('searchModelsList',function(){
           return {
               restrict:"A",
               replace:true,
               scope:{
                   mySearchValue:"=",
                   currentIndex:"="
               },
               template:'<div>'+
               //'<div class="bar-relative">'+
               '<div class="bar-top-relative">'+
               '<span>{{mySearchValue[currentIndex].name}}</span>'+
               '<span class="red">￥{{mySearchValue[currentIndex].prices}}万</span>'+
               '</div>'+
            //   '</div>'+
               '<ion-content class="has-header padding has-subheader">'+
               '<div class="list padding">'+
               '<div class="item item-card search-model-item" ng-repeat="model in mySearchValue[currentIndex].models">'+
               '<p>{{model.name}}</p>'+
               '<p>'+
               '<span class="red">￥{{model.modelPrice}}万元起</span>'+
               '<span class="lineThrough">{{model.price}}万</span>'+
               '<span ng-show="model.isPromote">促销</span>'+
               '</p>'+
               '</div>'+
               '</div>'+
               '</ion-content>'+
               '</div>'
           }
    })
    .directive('searchDealersList',function(){//下拉经销商
    return {
        restrict:"A",
        replace:true,
        scope:{
            mySearchValue:"=",
            currentIndex:"="
        },
        template:'<div>'+
        '<div class="bar-relative top-0">'+
        '<div class="bar-top-relative">'+
        '<span>{{mySearchValue[currentIndex].name}}</span>'+
        //'<span class="red">￥{{mySearchValue[currentIndex].prices}}万</span>'+
        '</div>'+
        '</div>'+
        '<ion-content class="has-header padding">'+
        '<div class="list padding">'+
        '<div class="search-model-item marginBottom" ng-repeat="dealer in mySearchValue[currentIndex].dealers" ng-click="goPromotionDetail(dealer.newsId)">'+
        '<div class="item item-card " >'+
        '<p><span ng-show="dealer.is4s">[4S]</span>{{dealer.name}}</p>'+
        '<p>{{dealer.address}}</p>'+
        '<p>'+
        '<span class="red">￥{{dealer.discountPrice}}万元起</span>'+
        '<span ng-if="dealer.namelistRange==3" class="span-last-child">现车充足</span>'+
        '</p>'+
        '</div>'+
        '<div class="whole-line" ><a class="half m-phone"><i>400电话</i></a><a class="half m-promote" ng-click="getPromotion($event,dealer.dealerId,dealer.modelId)"><i>我要优惠</i></a></div>'+
        '</div>'+
        '</div>'+
        '</ion-content>'+
        '</div>',
        link:function(scope,eles,attrs){
            scope.goPromotionDetail=function(newsId){
                scope.$parent.$parent.goPromotionDetail(newsId);//调用父类跳转
            }
            scope.getPromotion=function($event,dealerId,modelId){
                $event.stopPropagation();//去掉冒泡事件
               scope.$parent.$parent.getPromotion(dealerId,modelId)
            }

        }
    }
})
    .directive('chatInput',['$cordovaCamera','$cordovaImagePicker','$cordovaActionSheet','$ionicActionSheet','$cordovaContacts','$cordovaToast',
        function($cordovaCamera,$cordovaImagePicker, $cordovaActionSheet,$ionicActionSheet, $cordovaContacts,$cordovaToast){
        return {
            restrict:'A',
            replace:true,
            require: '?ngModel',
            transclude: true,
            scope:true,
            template:'<div class="fit-bottom" ng-init="showMoreFace=false;showMore=false">'+
        '<div class="fit-bottom-bar" >'+
       // '<button class="button  icon ion-android-microphone circle-button" ></button>'+
       ' <button ng-init="showFn=true" class="button icon ion-plus-round circle-button " ng-show="showFn" ng-click="showMore=true;showMoreFace=false;"></button>'+
        '<label class="item-input item-input-wrapper" >'+
        '<div contenteditable="true" style="width: 92%;"  id="inputcontent" class="inputcontent"></div>'+
        '<button class="button button-clear icon ion-android-happy" ng-click="showMoreFace=false;showMore=false;"></button>'+
        '</label>'+
        ' <button  ng-init="showSendBtn=true" ng-show="showSendBtn" class="button button-positive button-small" ng-click="sendMessage($event)">发送</button>'+
        '</div>'+
        '<ion-slide-box ng-show="showMore" class="show-more hide-on-keyboard-open" on-slide-changed="slideHasChanged(index)">'+
        '<ion-slide>'+
        '<div class="tool-item more-tool-item">'+
        '<a ng-click="openCamera()" >'+
        '<div class="tool-item-pink" ></div>'+
        '照相'+
        '</a>'+
        '<a ng-click="getImagePicker()">'+
        '<div class="tool-item-pink" ></div>'+
        '去相册拿照片'+
        '</a>'+
        ' <a ng-click="openActionSheet()">'+
        '<div class="tool-item-pink" ></div>'+
        '调用actionsheet'+
        '</a>'+
        '<a ng-click="openIonicSheet()">'+
        '<div class="tool-item-pink" ></div>'+
        '自带$ionicActionSheet'+
        '</a>'+
        '</div>'+

        '<div class="tool-item more-tool-item">'+
        ' <a ng-click="getAllContacts()">'+
        '<div class="tool-item-pink" ></div>'+
        ' 得到联系人所有信息'+
        '</a>'+
        ' <a >'+
        '<div class="tool-item-pink" ></div>'+
        '购车计算器44r'+
        '</a>'+
        '<a >'+
        '<div class="tool-item-pink" ></div>'+
        ' 购车计算器333'+
        ' </a>'+
        '<a >'+
        '<div class="tool-item-pink" ></div>'+
        ' 购车计算器222'+
        '</a>'+
        '</div>'+
        '</ion-slide>'+
        '<ion-slide>'+
        '<div class="tool-item more-tool-item">'+
        '<a >'+
        '<div class="tool-item-pink" ></div>'+
        ' 购车计算器'+
        ' </a>'+
        '<a >'+
        ' <div class="tool-item-pink" ></div>'+
        ' 购车计算器44r'+
        '</a>'+
        ' <a >'+
        ' <div class="tool-item-pink" ></div>'+
        ' 购车计算器333'+
        '</a>'+
        '<a >'+
        '<div class="tool-item-pink" ></div>'+
        ' 购车计算器222'+
        '</a>'+
        '</div>'+
        '</ion-slide>'+
        '</ion-slide-box>'+
        '<ion-slide-box  ng-show="showMoreFace" class="show-more show-more-face hide-on-keyboard-open" on-slide-changed="slideHasChanged(index)">'+
        ' <ion-slide ng-repeat="pageNo in [1,2,3]" >'+
        ' <div class="tool-item more-tool-item moreface" ng-repeat="pageline in [1,2,3,4,5]">'+
        ' <a ng-repeat="index in [1,2,3,4,5,6,7]"><img src="img/qqface/{{index+(pageline-1)*7+(pageNo-1)*35}}.gif" ng-click="faceLink({{index+(pageline-1)*7+(pageNo-1)*35}})"/></a>'+
        '</div>'+
        '</ion-slide>'+
        ' </ion-slide-box>'+
        '</div>',
            link:function(scope,eles,attrs){
               var input= angular.element(eles[0].querySelector(".inputcontent"));//输入的内容
               scope.faceLink=function(index){
                   var img='<img src="img/qqface/'+index+'.gif">';
                   input.html(input.html()+img);

               }
              scope.sendMessage=function($event){
                  if($event.$material!=undefined){//问题没解决的时候不要把自己逼死
                      scope.$parent.add(input.html());
                      scope.showMore=false;
                      scope.showMoreFace=false;
                      input.html("");//重新设置为空
                  }

              }

//打开照相机的功能
                scope.openCamera=function(){
                   // console.log($cordovaCamera)
                    document.addEventListener("deviceready", function () {
                        var options = {
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.CAMERA
                        };

                        $cordovaCamera.getPicture(options).then(function(imageURI) {
                            var img='<img src="'+imageURI+'">';
                            scope.$parent.add(img);
                            scope.showMore=false;
                        }, function(err) {

                        });


                      $cordovaCamera.cleanup().then(); // only for FILE_URI

                    }, false);


                }

//相册功能
                scope.getImagePicker=function(){
                  //  document.addEventListener("deviceready", function () {
                        var options = {
                            maximumImagesCount: 1,//取单张图
                            quality: 80
                        };

                        $cordovaImagePicker.getPictures(options).then(function(results) {
                        var uri = results[0],
                            name = uri;
                        if (name.indexOf('/')) {
                            var i = name.lastIndexOf('/');
                            name = name.substring(i + 1);
                        }
                       // alert(name);
                           // input.html(name);
                            var img='<img src="'+uri+'"/>';//uri才是真正的地址
                            scope.$parent.add(img);
                            scope.showMore=false;

                    }, function(error) {
                        alert(error);
                    });
                 //   }, false);
                }

                //调用actionSheet插件
                scope.openActionSheet=function(){
                    var options = {
                        title: 'What do you want with this image?',
                        buttonLabels: ['Share via Facebook', 'Share via Twitter'],
                        addCancelButtonWithLabel: 'Cancel',
                        androidEnableCancelButton : true,
                        winphoneEnableCancelButton : true,
                        addDestructiveButtonWithLabel : 'Delete it'
                    };


                    document.addEventListener("deviceready", function () {

                        $cordovaActionSheet.show(options)
                            .then(function(btnIndex) {
                                var index = btnIndex;
                            });
                    }, false);

                }

                scope.openIonicSheet=function(){
                    var hideSheet = $ionicActionSheet.show({
                        buttons: [
                            { text: '<b>Share</b> This' },
                            { text: 'Move' }
                        ],
                        destructiveText: 'Delete',
                        titleText: 'Modify your album',
                        cancelText: 'Cancel',
                        cancel: function() {
                            // add cancel code..
                        },
                        buttonClicked: function(index) {
                            return true;
                        }
                    });

                    // For example's sake, hide the sheet after two seconds
                    $timeout(function() {
                        hideSheet();
                    }, 2000);

                };




                scope.addContact = function() {
                    $cordovaContacts.save(scope.contactForm).then(function(result) {
                        // Contact saved
                    }, function(err) {
                        // Contact error
                    });
                };

                scope.getAllContacts = function() {
                    $cordovaToast
                        .show("what's wrong????", 'long', 'center')
                        .then(function(success) {
                            // success
                        }, function (error) {
                            // error
                        });
                    $cordovaContacts.find().then(function(allContacts) { //omitting parameter to .find() causes all contacts to be returned
                        allContacts=JSON.stringify(allContacts);
                        $cordovaToast
                            .show(allContacts, 'long', 'center')
                            .then(function(success) {
                                // success
                            }, function (error) {
                                // error
                            });

                        //$cordovaToast.showShortTop('Here is a message').then(function(success) {
                        //    // success
                        //}, function (error) {
                        //    // error
                        //});

                        //$cordovaToast.showLongBottom('Here is a message').then(function(success) {
                        //    // success
                        //}, function (error) {
                        //    // error
                        //});
                    });
                };

                //scope.findContactsBySearchTerm = function (searchTerm) {
                //    var opts = {                                           //search options
                //        filter : searchTerm,                                 // 'Bob'
                //        multiple: true,                                      // Yes, return any contact that matches criteria
                //        fields:  [ 'displayName', 'name' ],                  // These are the fields to search for 'bob'.
                //        desiredFields: [id];    //return fields.
                //};

                //if ($ionicPlatform.isAndroid()) {
                //    opts.hasPhoneNumber = true;         //hasPhoneNumber only works for android.
                //};

            //    $cordovaContacts.find(opts).then(function (contactsFound) {
            //        $scope.contacts = contactsFound;
            //    };
            //}

            scope.pickContactUsingNativeUI = function () {
            $cordovaContacts.pickContact().then(function (contactPicked) {
                scope.contact = contactPicked;
            });
           }


           }
        }
    }])
    .directive('searchModels',function(){//首页车每次分类
        return {
            restrict: 'A',
            replace: true,
            transclude:true,
            scope: {
                "currentIndex": "=",
                "modelShow":"=",
                "mySearchValue":"=",
                "searchModelsListFlag":"=",
                 "isTab":"=",
                "searchDealersListFlag":"="
            },
            template: '<div style="z-index:9999;" ng-show="modelShow">'+
            '<div search-models-list my-search-value="mySearchValue"  current-index="currentIndex" ng-show="searchModelsListFlag"></div>'+
            '<div search-dealers-list my-search-value="mySearchValue"  current-index="currentIndex" ng-show="searchDealersListFlag"></div>'+
           '<div class="deleteModel" ng-class={"deleteModelTab":isTab} ng-click="modelShow=!modelShow"><i></i></div>'+
            '</div>'
            }
    }).factory('$localStorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }]).filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }])


;
