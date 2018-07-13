/// <reference path="../../../../../typings/index.d.ts" />

module app.clips {

    'use strict';

    export interface IClipsCtrl {}
    export class ClipsCtrl implements IClipsCtrl {
        constructor(
            public $scope: ng.IScope
        ){}
    }

    export interface IClipsService {
        getExcited: boolean;
    }
    export class ClipsService implements IClipsService {
        getExcited: boolean = false;
    }

    angular
        .module('app.clips', [])
        .directive("clips", function(): ng.IDirective {
            return {
                templateUrl: 'app-templates/views/clips.html',
                controller:  ClipsCtrl,
                controllerAs: 'clipsCtrlVM'
            };
        })
        .controller("clipsCtrl", ClipsCtrl)
        .factory("clipsService", [() => new app.clips.ClipsService()]);
}