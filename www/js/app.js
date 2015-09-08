// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
//要在了解app的基础上才能做
var db=null;
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','ionic.contrib.frostedGlass'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

       if(window.cordova) {
	        db = $cordovaSQLite.openDB({name:"chat.db" , bgType: 1});
	    } else {
	        db = window.openDatabase("chat.db" , '1', 'ES Database', 5 * 1024 * 1024);
	    }
    //  db = $cordovaSQLite.openDB({ name: "chat.db" });//创建建数据库
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user_chat_records (cid integer, uid integer, content text, inserttime date)");//创建表


      //以下部分是闪屏启动图，相当于app里面的广告图操作
      document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady() {
          navigator.splashscreen.hide();
      }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
       $ionicConfigProvider.platform.android.navBar.alignTitle('center');//before left

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.serialBlank', {
    url: '/serialBlank',
        //页面上有写着ion-nav-view name=tab-xx些晨要和这里的相对应
    views: {
      'tab-serialBlank': {
        templateUrl: 'templates/tab-serialBlank.html',
        controller: 'SerialBlankCtrl'
      }
    }
  })

  .state('tab.chooseOption', {
      url: '/chooseOption',
      views: {
        'tab-chooseOption': {
          templateUrl: 'templates/tab-chooseOption.html',
          controller: 'ChooseOptionCtrl'
        }
      }
    })
    .state('search', {//查车结果页面
      url: '/search/:sortType',
     views: {
      //'tab-chooseOption': {//返回的地方
      '':{
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
      }
     }
    })
      .state('iframe', {//进入中间页面
          url: '/iframe?from',
          views: {
              //'tab-chooseOption': {//返回的地方
              '':{
                  templateUrl: 'templates/iframe.html',
                  controller: 'IframeCtrl'
              }
          }
      })
  .state('tab.promotionList', {
    url: '/promotionList',
    views: {
      'tab-promotionList': {
        templateUrl: 'templates/tab-promotionList.html',
        controller: 'PromotionListCtrl'
      }
    }
  })
      .state('tab.activity', {
        url: '/activity',
        views: {
          'tab-activity': {
            templateUrl: 'templates/tab-activity.html',
            controller: 'ActivityCtrl'
          }
        }
      })

      .state('tab.tool', {
        url: '/tool?isLogin',
        views: {
          'tab-tool': {
            templateUrl: 'templates/tab-tool.html',
            controller: 'ToolCtrl'
          }
        }
      })
      .state('login', {
        url: '/login',
        views: {
       //   'tab-login': {
            '':{
            templateUrl: 'templates/tab-login.html',
             controller: 'LoginCtrl'
          }
        }
      })
      .state('chats', {
        url: '/chats',
        views: {
         // 'tab-login': {
            '':{
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('chat-detail', {
        url: '/chats/:cid',
        views: {
        //  'tab-login': {
            '':{
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/serialBlank');
});
