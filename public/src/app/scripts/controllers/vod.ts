/// <reference path="../../../../../typings/index.d.ts" />

module app.vod {

    'use strict';

    export interface IVODCtrl {}
    export class VODCtrl implements IVODCtrl {
        constructor(
            public $scope: ng.IScope
        ){}
    }

    export interface IVODService {
        getExcited: boolean;
    }
    export class VODService implements IVODService {
        getExcited: boolean = false;
    }

    angular
        .module('app.vod', [])
        .directive("vod", function(): ng.IDirective {
            return {
                templateUrl: 'app-templates/views/vod.html',
                controller:  VODCtrl,
                controllerAs: 'vodCtrlVM'
            };
        })
        .controller("vodCtrl", VODCtrl)
        .factory("vodService", [() => new app.vod.VODService()]);
}
