/**
 * 
 * @type TopicAnalysisService
 */
var topicAnalysisClient = new TopicAnalysisService();

var settingsApp = angular.module('settingsApp', [])
        .controller('DomainsCtrl', function($scope, $timeout) {
            var domainsArr = topicAnalysisClient.get(KEY_DOMAINS, true, DEFAULT_DOMAINS);
            $scope.domainList = [];
            for (var i in domainsArr) {
                $scope.domainList.push({'host': domainsArr[i]});
            }

            var blank = {'host': ""};
            $scope.remove = function(idx) {
                $scope.domainList.splice(idx, 1);
            };

            $scope.add = function() {
                $scope.domainList.push(angular.copy(blank));
            };

            $scope.addMulti = function() {
                var domainsArr = $('#multiDomains').val().trim().split(/\s+/);
                var domain;
                for (var i = 0; i < domainsArr.length; i++) {
                    domain = domainsArr[i].toLowerCase();
                    $scope.domainList.push({'host': domain});
                }
                $('#multiDomains').val("");
                $('#multipleModal').modal('hide');
            };

            $scope.persistAndClose = function() {
                //console.log($scope.domainList);
                domainsArr = [];
                for (var i in $scope.domainList) {
                    if(domainsArr.indexOf($scope.domainList[i].host) < 0){
                        domainsArr.push($scope.domainList[i].host);
                    }
                }
                topicAnalysisClient.store(KEY_DOMAINS, domainsArr, true);
                location.href = "newsapp.html";
            };

            $timeout(function() {
                $('#multipleModalToggle').click(function() {
                    $('#multipleModal').modal();
                });
            }, 100);

        });