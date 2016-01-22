export function routerConfig ($stateProvider, $urlRouterProvider,$locationProvider) {
  'ngInject';
  $stateProvider
  .state('user', {
    url: '/user',
    templateUrl: 'app/user/user.html',
    controller: 'UserController',
    controllerAs: 'users',
    resolve: {
      auth: function($q,$firebaseAuth,$location){
        // var deferred = $q.defer();
        var ref = new Firebase("https://vyapi.firebaseio.com");
        var authObj = $firebaseAuth(ref);
        var authData = authObj.$getAuth();
        if (authData) {
          // deferred.resolve();
          $location.path('/dashboard')
        } else {
          $location.path('/');
          // deferred.reject('You are not allowed on this page');
        }
        return true;
      }
    }
  })
  .state('home',{
    url:'/',
    templateUrl: 'app/login/login.html',
    controller: 'LoginController',
    controllerAs: 'login'
  })
  .state('action', {
    url: '/action',
    templateUrl: 'app/action/action.html',
    controller: 'ActionController',
    controllerAs: 'action',
    resolve: {
      auth: function($q,$firebaseAuth,$location){
        // var deferred = $q.defer();
        var ref = new Firebase("https://vyapi.firebaseio.com");
        var authObj = $firebaseAuth(ref);
        var authData = authObj.$getAuth();
        if (authData) {
          // deferred.resolve();
          $location.path('/dashboard')
        } else {
          $location.path('/');
          // deferred.reject('You are not allowed on this page');
        }
        return true;
      }
    }
  })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'app/dashboard/dashboard.html',
    controller:'DashboardController',
    controllerAs: 'dashboard',
    resolve: {
      auth: function($q,$firebaseAuth,$location){
        // var deferred = $q.defer();
        var ref = new Firebase("https://vyapi.firebaseio.com");
        var authObj = $firebaseAuth(ref);
        var authData = authObj.$getAuth();
        if (authData) {
          // deferred.resolve();
          $location.path('/dashboard')
        } else {
          $location.path('/');
          // deferred.reject('You are not allowed on this page');
        }
        return true;
      }
    }
  })
  .state('board', {
    url: '/board',
    templateUrl: 'app/board/board.html',
    controller: 'BoardController',
    controllerAs: 'board',
    resolve: {
      auth: function($q,$firebaseAuth,$location){
        // var deferred = $q.defer();
        var ref = new Firebase("https://vyapi.firebaseio.com");
        var authObj = $firebaseAuth(ref);
        var authData = authObj.$getAuth();
        if (authData) {
          // deferred.resolve();
          $location.path('/dashboard')
        } else {
          $location.path('/');
          // deferred.reject('You are not allowed on this page');
        }
        return true;
      }
    }
  })
  .state('room', {
    url: '/room',
    // templateUrl: 'app/room/room.html',
    //controller:'RoomController',
    //controllerAs: 'room',
    views: {

      // the main template will be placed here (relatively named)
      '': { templateUrl: 'app/room/room.html' },
      // the child views will be defined here (absolutely named)
      'board@room': { templateUrl: 'app/board/board.html',
      controller: 'BoardController',
      controllerAs: 'board'
    },

    //user room view
    'user@room': {
      templateUrl: 'app/user/user.html',
      controller: 'UserController',
      controllerAs: 'users'

    },

    //action room view
    'action@room':{
      templateUrl: 'app/action/action.html',
      controller: 'ActionController',
      controllerAs: 'action'
    }
  },
  resolve: {
    auth: function($q,$firebaseAuth,$location){
      // var deferred = $q.defer();
      var ref = new Firebase("https://vyapi.firebaseio.com");
      var authObj = $firebaseAuth(ref);
      var authData = authObj.$getAuth();
      if (authData) {
        // deferred.resolve();
        $location.path('/dashboard')
      } else {
        $location.path('/');
        // deferred.reject('You are not allowed on this page');
      }
      return true;
    }
  }
});
$locationProvider.html5Mode(true);
$urlRouterProvider.otherwise('/');
}
