/*jshint camelcase: false */
'use strict';
angular.module('listeningsApp').controller('ShowListeningCtrl', function ($scope, $routeParams, Session, ngToast, listeningModel, $filter) {
    var listeningId = $filter('unslugify')($routeParams.listening_id);
    $scope.allowedUser = false;
    $scope.fetchError = false;

    listeningModel.find(listeningId).then(function(doc) {
        $scope.interview = doc;
        $scope.allowedUser = Session.user && (Session.user.is_admin || doc.userId === Session.user.id);
    }).catch(function() {
        $scope.fetchError = true;
        ngToast.create({content: 'Failed to load listening' , className: 'danger'});
    });

    $scope.listening_id = $routeParams.listening_id;
});
/*jshint camelcase: true */
