import 'reflect-metadata';
import { Vue as _Vue } from 'vue/types/vue';
import { PluginFunction, PluginObject } from 'vue/types/plugin';
import * as classComponent from 'vue-class-component';

import { PropOptions } from 'vue';

class DependencyInjectionAttributePlugin {
    install(Vue: typeof _Vue, options?: any) {
        console.log('config');
        Vue.mixin({
            beforeCreate: function () {

            },
            provide: getNewServices(),
        });
    }
}
export const DependencyInjectionAttribute: PluginObject<any> = new DependencyInjectionAttributePlugin();

function getNewServices() {
    let newServices = {};
    for (let key in serviceDefs) {
        if (serviceDefs.hasOwnProperty(key)) {
            newServices[key] = new serviceDefs[key]();
        }
    }
    return newServices;
}

// [Key:ServiceName, Value: ServiceConstructor]
let serviceDefs = {};

export function Service(target: Function) {
    console.log('Service called on: ', target.name);
    serviceDefs[target.name] = target;
}

let classDefs = {};

export type Constructor = {
    new(...args: any[]): any
};

export function Import(options = {}) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        debugger;
        if (!Array.isArray(options) && typeof options['type'] === 'undefined') {
            options['type'] = Reflect.getMetadata('design:type', target, key);
        }
        classComponent.createDecorator(function (componentOptions, k) {
            if (typeof componentOptions.inject === 'undefined') {
                componentOptions.inject = {};
            }
            if (!Array.isArray(componentOptions.inject)) {
                componentOptions.inject[key] = options['type'].name || key;
            }
        })(target, key);
    };
}