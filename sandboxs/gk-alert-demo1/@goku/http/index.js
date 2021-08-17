import * as i0 from '@angular/core';
import { NgModule, Injectable } from '@angular/core';
import * as i1 from '@angular/common/http';
import { HttpParams, HttpClient } from '@angular/common/http';

class GKHttpModule {
}
GKHttpModule.decorators = [
    { type: NgModule, args: [{
                declarations: [],
                imports: [],
                exports: [],
            },] }
];

/**
 * 接口类,包含请求路径和请求方法
 * ### 示例:
 * ```typescript
 * new GKApi('/api/users')
 * ```
 */
class GKApi {
    /**
     * 创建一个接口实例
     * @param url 请求路径
     * @param method 请求方法
     * ### 示例:
     * ```typescript
     * new GKApi('/api/users') // get请求
     * new GKApi('/api/users','post') // post请求
     * new GKApi('/api/users','put') // put请求
     * new GKApi('/api/users','delete') // delete请求
     * ```
     */
    constructor(url, method = 'get') {
        this.url = url;
        this.method = this.methodHandler(method);
    }
    /**
     * 请求类型字符处理,传入简写方式 输出标准方法类型
     * @param type 请求类型
     */
    methodHandler(type) {
        let mtd;
        switch (type) {
            case 'g':
            case 'get':
            case 'GET':
            case 'Get':
                mtd = 'GET';
                break;
            case 'p':
            case 'post':
            case 'POST':
            case 'Post':
                mtd = 'POST';
                break;
            case 'put':
            case 'PUT':
            case 'Put':
                mtd = 'PUT';
                break;
            case 'd':
            case 'delete':
            case 'del':
            case 'Delete':
            case 'DELETE':
            case 'Del':
            case 'DEL':
                mtd = 'DELETE';
                break;
            default:
                throw new Error('无法识别请求方法类型.');
        }
        return mtd;
    }
}

/**
 * 列表，增删改查服务创建基类
 * ## 用法
 * 页面服务只需要继承当前抽象类,并将API集合以及GKRequestService实例传入到super()方法中,页面服务即可具备api集合中存在的各方法(add,list,update等)
 * ### 示例:
 * ```typescript
 * import { API } from '../api/api.conf';
 * export class DepartmentService extends GKBaseService {
 *   constructor(private req: GKRequestService) {
 *     super(API.DEPARTMENT,req);
 *   }
 * }
 * ```
 */
class GKBaseService {
    // abstract requestService: GKRequestService;
    /**
     * 传入api实例集合 自动根据存在的api属性生成增删改查等方法
     * @param apis api实例集合
     * @param requestService GKRequestService实例，用于在生成的函数中发起请求
     */
    constructor(apis, requestService) {
        this.apis = apis;
        this.requestService = requestService;
        this.loadList();
        this.loadAdd();
        this.loadRemove();
        this.loadUpdate();
        this.loadDetail();
        this.loadOption();
    }
    loadList() {
        if (this.apis.LIST) {
            this.list = (data) => this.requestService.request(this.apis.LIST, data);
        }
    }
    loadAdd() {
        if (this.apis.ADD) {
            this.add = (data) => this.requestService.request(this.apis.ADD, data);
        }
    }
    loadRemove() {
        if (this.apis.REMOVE) {
            this.remove = (id, data = {}) => this.requestService.request(this.apis.REMOVE, Object.assign({ id }, data));
        }
    }
    loadUpdate() {
        if (this.apis.UPDATE) {
            this.update = (data) => this.requestService.request(this.apis.UPDATE, data);
        }
    }
    loadDetail() {
        if (this.apis.DETAIL) {
            this.detail = (id, data = {}) => this.requestService.request(this.apis.DETAIL, Object.assign({ id }, data));
        }
    }
    loadOption() {
        if (this.apis.OPTION) {
            this.option = (data) => this.requestService.request(this.apis.OPTION, data);
        }
    }
}

/**
 * 接受Api接口实例，提供的request方法自动根据Api实例中记载的请求类型发起对应请求，并自动处理参数传递
 */
class GKRequestService {
    constructor(http) {
        this.http = http;
    }
    /**
     * 发起http请求，返回一个observable实例
     * @param api 接口实例
     * @param data 请求时需要传递的参数
     * @param getAllResponse 值为true时会返回全部响应信息（包括状态码，响应头等等）， 默认为GKRequestService.getAllResponse, 只返回响应主体.
     * ### 示例:
     * ```typescript
     * import {API} from '.../api.conf.ts'
     *
     * export class XXXService {
     *
     *  constructor(private req:GKRequestService){}
     *
     *  getList(){
     *    return this.req.request(API.USER.LIST)
     *  }
     *
     *  getListAll(){
     *    // 获取完整响应体
     *    return this.req.request(API.USER.LIST,undefined,true)
     *  }
     * }
     * ```
     */
    request(api, data = null, getAllResponse = GKRequestService.getAllResponse) {
        const params = new HttpParams({ fromObject: data });
        let httpOB;
        let observe;
        if (getAllResponse) {
            observe = 'response';
        }
        switch (api.method) {
            case 'POST':
                httpOB = this.http.post(api.url, data, { observe });
                break;
            case 'PUT':
                httpOB = this.http.put(api.url, data, { observe });
                break;
            case 'DELETE':
                httpOB = this.http.delete(api.url, { params, observe });
                break;
            default:
                httpOB = this.http.get(api.url, { params, observe });
                break;
        }
        return httpOB;
    }
}
/**
 * 全局设定是否返回完整响应体(状态码，响应头等信息). 默认为false,只返回响应主体
 * 也可在调用request()函数时，通过第三个参数单独设置。在单独设置时，函数优先级大于该全局设置的优先级
 */
GKRequestService.getAllResponse = false;
GKRequestService.ɵprov = i0.ɵɵdefineInjectable({ factory: function GKRequestService_Factory() { return new GKRequestService(i0.ɵɵinject(i1.HttpClient)); }, token: GKRequestService, providedIn: "root" });
GKRequestService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
GKRequestService.ctorParameters = () => [
    { type: HttpClient }
];

/**
 * api对象生成器,用于生成包含 列表,添加,删除,修改,查询,下拉选项等接口的对象
 * @param url 请求路径
 * @param excludes 不需要生成的接口类型或者接口类型列表
 * ### 示例:
 * ```typescript
 * const USER = gkApiCreators('/api/user', 'option')
 * ```
 */
function gkApiCreators(url, excludes) {
    const target = {};
    target.LIST = new GKApi(url);
    target.ADD = new GKApi(url, 'post');
    target.REMOVE = new GKApi(url, 'delete');
    target.UPDATE = new GKApi(url, 'put');
    target.DETAIL = new GKApi(`${url}/detail`);
    target.OPTION = new GKApi(`${url}/option`);
    if (typeof excludes === 'string') {
        const exclude = apiTypeHandler(excludes);
        delete target[exclude];
    }
    else if (Array.isArray(excludes)) {
        excludes.map((exclude) => {
            exclude = apiTypeHandler(exclude);
            delete target[exclude];
        });
    }
    return target;
}
/**
 * @internal
 * 将简写api类型处理成全字符的
 * @param type api类型
 */
function apiTypeHandler(type) {
    switch (type) {
        case 'L':
            return 'LIST';
        case 'A':
            return 'ADD';
        case 'R':
            return 'REMOVE';
        case 'U':
            return 'UPDATE';
        case 'D':
            return 'DETAIL';
        case 'O':
            return 'OPTION';
        default:
            return type;
    }
}

/*
 * Public API Surface of http
 */

/**
 * Generated bundle index. Do not edit.
 */

export { GKApi, GKBaseService, GKHttpModule, GKRequestService, gkApiCreators };
//# sourceMappingURL=goku-http.js.map
