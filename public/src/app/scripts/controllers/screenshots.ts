/// <reference path="../../../../../typings/index.d.ts" />

module app.screenshots {

    'use strict';

    export interface IScreenshotsCtrl {}
    export class ScreenshotsCtrl implements IScreenshotsCtrl {
        constructor(
            public $scope: ng.IScope
        ){}
    }

    export interface IScreenshotsService {
        getExcited: boolean;
    }
    export class ScreenshotsService implements IScreenshotsService {
        getExcited: boolean = false;
    }

    angular
        .module('app.screenshots', [])
        .directive("screenshots", function(): ng.IDirective {
            return {
                templateUrl: 'app-templates/views/screenshots.html',
                controller:  ScreenshotsCtrl,
                controllerAs: 'screenshotsCtrlVM'
            };
        })
        .controller("screenshotsCtrl", ScreenshotsCtrl)
        .factory("screenshotsService", [() => new app.screenshots.ScreenshotsService()]);
}