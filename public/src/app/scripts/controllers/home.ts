/// <reference path="../../../../../typings/index.d.ts" />

module app.home {

    'use strict';

    export interface IHomeCtrl {}
    export class HomeCtrl implements IHomeCtrl {
        constructor(
            public $scope: ng.IScope
        ){}
    }

    export interface IHomeService {
        getExcited: boolean;
    }
    export class HomeService implements IHomeService {
        getExcited: boolean = false;
    }

    angular
        .module('app.home', [])
        .directive("home", function(): ng.IDirective {
            return {
                templateUrl: 'app-templates/views/home.html',
                controller:  HomeCtrl,
                controllerAs: 'homeCtrlVM'
            };
        })
        .controller("homeCtrl", HomeCtrl)
        .factory("homeService", [() => new app.home.HomeService()]);
}
