/// <reference path="../../../../../typings/index.d.ts" />

module app.mainfooter {

    'use strict';

    export interface IMainFooterCtrl {}
    export class MainFooterCtrl implements IMainFooterCtrl {
        constructor(
            public $scope: ng.IScope
        ){}
    }

    export interface IMainFooterService {
        getExcited: boolean;
    }
    export class MainFooterService implements IMainFooterService {
        getExcited: boolean = false;
    }

    angular
        .module('app.mainfooter', [])
        .directive("mainfooter", function(): ng.IDirective {
            return {
                templateUrl: 'app-templates/views/mainfooter.html',
                controller:  MainFooterCtrl,
                controllerAs: 'mainfooterCtrlVM'
            };
        })
        .controller("mainfooterCtrl", MainFooterCtrl)
        .factory("mainfooterService", [() => new app.mainfooter.MainFooterService()]);
}
