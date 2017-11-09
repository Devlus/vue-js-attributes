import 'reflect-metadata';
import * as classComponent from 'vue-class-component';
var DependencyInjectionAttributePlugin = (function () {
    function DependencyInjectionAttributePlugin() {
    }
    DependencyInjectionAttributePlugin.prototype.install = function (Vue, options) {
        console.log('config');
        Vue.mixin({
            beforeCreate: function () {
            },
            provide: getNewServices(),
        });
    };
    return DependencyInjectionAttributePlugin;
}());
export var DependencyInjectionAttribute = new DependencyInjectionAttributePlugin();
function getNewServices() {
    var newServices = {};
    for (var key in serviceDefs) {
        if (serviceDefs.hasOwnProperty(key)) {
            newServices[key] = new serviceDefs[key]();
        }
    }
    return newServices;
}
// [Key:ServiceName, Value: ServiceConstructor]
var serviceDefs = {};
export function Service(target) {
    console.log('Service called on: ', target.name);
    serviceDefs[target.name] = target;
}
var classDefs = {};
export function Import(options) {
    if (options === void 0) { options = {}; }
    if (options === void 0) {
        options = {};
    }
    return function (target, key) {
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
//# sourceMappingURL=index.js.map