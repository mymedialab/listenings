/*jshint camelcase: false */
'use strict';
angular.module('listeningsApp').controller('ShowListeningCtrl', function ($scope, $routeParams, Session, ngToast, listeningModel) {
    $scope.allowedUser = false;

    listeningModel.find($routeParams.listening_id.replace(/-/, '/')).then(function(doc) {
        $scope.interview = doc;
        $scope.allowedUser = Session.user && (Session.user.is_admin || doc.userId === Session.user.id);
    }).catch(function() {
        ngToast.create({content: 'Failed to load listening' , className: 'danger'});
    });

    $scope.listening_id = $routeParams.listening_id;
});
/*jshint camelcase: true */
