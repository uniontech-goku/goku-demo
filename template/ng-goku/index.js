import { cloneDeep, merge, pick, isEqual, debounce, flattenDeep } from 'lodash-es';
import { Component, ViewEncapsulation, Input, EventEmitter, Output, ɵɵdefineInjectable, Injectable, HostBinding, NgModule, InjectionToken, ɵɵinject, Inject, ViewChild, ContentChildren, forwardRef, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, ActivatedRoute, RouterModule } from '@angular/router';
import { filter, tap, debounceTime, map, retry } from 'rxjs/operators';
import { DomSanitizer, BrowserModule } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzIconService, NzIconModule } from 'ng-zorro-antd/icon';
import { DownOutline, UserOutline, SearchOutline, PlusOutline, EyeOutline, EyeInvisibleOutline, UploadOutline, DeleteOutline, FileExclamationOutline, PictureTwoTone, DownloadOutline, FileTwoTone, QuestionCircleOutline, MinusSquareOutline, PlusSquareOutline, CaretRightOutline, CaretDownFill, PaperClipOutline } from '@ant-design/icons-angular/icons';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { GKRequestService, GKApi } from '@goku/http';
import { HttpHeaders, HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { __awaiter } from 'tslib';
import Wangeditor from 'wangeditor';
import * as dayjs from 'dayjs';
import { Observable, Subject } from 'rxjs';
import { use, init } from 'echarts/core';
import { LineChart, PieChart } from 'echarts/charts';
import { TitleComponent as TitleComponent$1, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { graphic } from 'echarts';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { v4 } from 'uuid';

const GKStatusValues = ['default', 'primary', 'success', 'warning', 'danger'];
function isGKStatus(x) {
    return GKStatusValues.includes(x);
}

const util = {
    cloneDeep,
    merge,
    pick,
    isEqual,
    debounce,
    flattenDeep,
    array(v) {
        if (Array.isArray(v)) {
            return v;
        }
        if (v !== undefined) {
            return [v];
        }
        return [];
    },
    sleep(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(undefined);
            }, time);
        });
    },
};

class AsideMenuComponent {
    constructor(router, activatedRoute) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.router$ = this.router.events.pipe(filter((evt) => evt instanceof NavigationEnd), tap(() => {
            this.checkSubmenuOpen();
        }));
        this.submenuOpen = [];
        this.checkSubmenuOpen = () => {
            const urls = [];
            const routerTree = this.activatedRoute.snapshot;
            let routerNow = routerTree;
            while (true) {
                urls.push(routerNow.url);
                if (routerNow.children.length === 0) {
                    break;
                }
                else {
                    routerNow = routerNow.children[0];
                }
            }
            const pathUrl = urls.join('/');
            for (let m = 0; m < this.asideMenus.menuGroups.length; m++) {
                const group = this.asideMenus.menuGroups[m];
                for (let n = 0; n < group.menus.length; n++) {
                    const firstMenu = group.menus[n];
                    if (firstMenu.type === 'firtsMenuWp') {
                        for (const secondMenu of firstMenu.children) {
                            if ('/' + secondMenu.path === pathUrl) {
                                if (!this.submenuOpen[m]) {
                                    this.submenuOpen[m] = [];
                                }
                                this.submenuOpen[m][n] = true;
                                return;
                            }
                        }
                    }
                }
            }
        };
    }
    get fastMenusHeight() {
        return this.asideMenus.fastMenus.length * 48 + 'px';
    }
    get asideMenusBottom() {
        if (this.asideMenus.fastMenus.length === 0) {
            return '0px';
        }
        return this.asideMenus.fastMenus.length * 48 + 24 + 'px';
    }
    ngOnInit() {
        this.checkSubmenuOpen();
    }
}
AsideMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-aside-menu',
                template: "<div class=\"gk-aside-menu-container\">\n    <div class=\"gk-aside-fast\" [ngStyle]=\"{ height: fastMenusHeight }\">\n        <ul nz-menu nzMode=\"inline\" *ngIf=\"asideMenus.fastMenus.length > 0\">\n            <li *ngFor=\"let menu of asideMenus.fastMenus\" nz-menu-item nzMatchRouter>\n                <gk-icon [type]=\"menu.icon\"></gk-icon>\n                <a [routerLink]=\"[menu.path]\" [queryParams]=\"menu.queryParams\">{{ menu.label }}</a>\n            </li>\n        </ul>\n    </div>\n\n    <div class=\"gk-aside-main\" [ngStyle]=\"{ bottom: asideMenusBottom }\">\n        <ul nz-menu nzMode=\"inline\">\n            <ng-container *ngFor=\"let group of asideMenus.menuGroups; let m = index\">\n                <li *ngIf=\"group.title\" nz-menu-group [nzTitle]=\"group.title\" class=\"gk-menu-group\"></li>\n                <ng-container *ngFor=\"let firstMenu of group.menus; let n = index\">\n                    <li *ngIf=\"firstMenu.type === 'firtsMenuWp'\" nz-submenu [nzTitle]=\"titleTpl\"\n                        [nzOpen]=\"submenuOpen[m] && submenuOpen[m][n]\">\n                        <ng-template #titleTpl>\n                            <gk-icon [type]=\"firstMenu.icon\"></gk-icon>\n                            <span>{{ firstMenu.label }}</span>\n                        </ng-template>\n                        <ul>\n                            <li *ngFor=\"let secondMenu of firstMenu.children\" nz-menu-item nzMatchRouter\n                                class=\"child-menu\">\n                                <a [routerLink]=\"[secondMenu.path]\"\n                                    [queryParams]=\"secondMenu.config.queryParams\">{{secondMenu.label}}</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li *ngIf=\"firstMenu.type === 'firtsMenuLink'\" nz-menu-item nzMatchRouter>\n                        <gk-icon [type]=\"firstMenu.icon\"></gk-icon>\n                        <a [routerLink]=\"[firstMenu.path]\" [queryParams]=\"firstMenu.config.queryParams\">{{\n                            firstMenu.label }}</a>\n                    </li>\n                </ng-container>\n            </ng-container>\n        </ul>\n\n        <ng-container *ngIf=\"router$ | async\"></ng-container>\n    </div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}.gk-aside-menu-container{background:#fff;box-sizing:border-box;height:100%;padding-bottom:8px;padding-top:8px;position:relative}.gk-aside-menu-container .gk-aside-main{left:0;margin-bottom:8px;overflow-x:visible;overflow-y:auto;position:absolute;right:0;top:8px}.gk-aside-menu-container .gk-aside-main .gk-menu-group{margin-top:16px}.gk-aside-menu-container .gk-aside-main .gk-menu-group .ant-menu-item-group-title{color:#262626;font-size:16px;font-weight:500}.gk-aside-menu-container .ant-menu-sub.ant-menu-inline{background:#fff}.gk-aside-menu-container .gk-aside-fast{bottom:8px;left:0;overflow-x:visible;overflow-y:auto;position:absolute;right:0}"]
            },] }
];
AsideMenuComponent.ctorParameters = () => [
    { type: Router },
    { type: ActivatedRoute }
];
AsideMenuComponent.propDecorators = {
    asideMenus: [{ type: Input }]
};

const logobase64 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTAycHgiIGhlaWdodD0iMThweCIgdmlld0JveD0iMCAwIDEwMiAxOCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDx0aXRsZT7nvJbnu4Q8L3RpdGxlPgogICAgPGRlZnM+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSItMjkuNzQxMDE5MiUiIHkxPSI0Ni4wMzYzODczJSIgeDI9IjE3ODIuNTM5NjglIiB5Mj0iMTM1Ljg2NzQ0NiUiIGlkPSJsaW5lYXJHcmFkaWVudC0xIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwNzFGRiIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBEREZGIiBzdG9wLW9wYWNpdHk9IjAuNzUiIG9mZnNldD0iMjElIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMDZDRkYiIHN0b3Atb3BhY2l0eT0iMC45MiIgb2Zmc2V0PSI0NiUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwRkNBNyIgb2Zmc2V0PSI3MiUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwQTJGRiIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjEuOTE4Mjk5OCUiIHkxPSI0Mi44ODk3NTQ4JSIgeDI9IjM4OC4yNjY2NTklIiB5Mj0iMTE0LjEwNzU5JSIgaWQ9ImxpbmVhckdyYWRpZW50LTIiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDA3MUZGIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMERERkYiIHN0b3Atb3BhY2l0eT0iMC43NSIgb2Zmc2V0PSIyMSUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwNkNGRiIgc3RvcC1vcGFjaXR5PSIwLjkyIiBvZmZzZXQ9IjQ2JSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBGQ0E3IiBvZmZzZXQ9IjcyJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBBMkZGIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iLTIxNS44MDY1ODIlIiB5MT0iNDAuNTU3OTM0OCUiIHgyPSI2MDAuNjUwMTQyJSIgeTI9IjcyLjUwMTMzMjMlIiBpZD0ibGluZWFyR3JhZGllbnQtMyI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMDcxRkYiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwRERGRiIgc3RvcC1vcGFjaXR5PSIwLjc1IiBvZmZzZXQ9IjIxJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDA2Q0ZGIiBzdG9wLW9wYWNpdHk9IjAuOTIiIG9mZnNldD0iNDYlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMEZDQTciIG9mZnNldD0iNzIlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMEEyRkYiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSItMjE4LjQ3OTU3OSUiIHkxPSI0My41MDgyODczJSIgeDI9IjU5NC4wMTUzNjYlIiB5Mj0iNjMuMTU5OTE0MSUiIGlkPSJsaW5lYXJHcmFkaWVudC00Ij4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwNzFGRiIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBEREZGIiBzdG9wLW9wYWNpdHk9IjAuNzUiIG9mZnNldD0iMjElIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMDZDRkYiIHN0b3Atb3BhY2l0eT0iMC45MiIgb2Zmc2V0PSI0NiUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwRkNBNyIgb2Zmc2V0PSI3MiUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwQTJGRiIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9Ii0yMjMuOTI4MTY5JSIgeTE9IjMwLjY4NjcxMjQlIiB4Mj0iNTc4Ljg1OTM0OCUiIHkyPSI4Ny4yODg5MDYxJSIgaWQ9ImxpbmVhckdyYWRpZW50LTUiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDA3MUZGIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMERERkYiIHN0b3Atb3BhY2l0eT0iMC43NSIgb2Zmc2V0PSIyMSUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwNkNGRiIgc3RvcC1vcGFjaXR5PSIwLjkyIiBvZmZzZXQ9IjQ2JSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBGQ0E3IiBvZmZzZXQ9IjcyJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBBMkZGIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iLTQuNzc2NDk0ODUlIiB5MT0iMzEuODI1ODAwNCUiIHgyPSIyMjYuNTkyODc5JSIgeTI9IjEwMy4zMjIxNjYlIiBpZD0ibGluZWFyR3JhZGllbnQtNiI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMDcxRkYiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwRERGRiIgc3RvcC1vcGFjaXR5PSIwLjc1IiBvZmZzZXQ9IjIxJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDA2Q0ZGIiBzdG9wLW9wYWNpdHk9IjAuOTIiIG9mZnNldD0iNDYlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMEZDQTciIG9mZnNldD0iNzIlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMEEyRkYiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSItMTEuMDAxOTQ4OCUiIHkxPSIzMi42NzI0NDU3JSIgeDI9IjMzMS4xMjk2MjklIiB5Mj0iMTA2LjMwMzU2MiUiIGlkPSJsaW5lYXJHcmFkaWVudC03Ij4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwNzFGRiIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBEREZGIiBzdG9wLW9wYWNpdHk9IjAuNzUiIG9mZnNldD0iMjElIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMDZDRkYiIHN0b3Atb3BhY2l0eT0iMC45MiIgb2Zmc2V0PSI0NiUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwRUFCOSIgb2Zmc2V0PSI3MiUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwQTJGRiIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9Ii0xMjkuMDUxNDQyJSIgeTE9IjExLjE5Mjk1NjElIiB4Mj0iMjEyLjk2NDYxNSUiIHkyPSI4NS4zNTM0Mjc5JSIgaWQ9ImxpbmVhckdyYWRpZW50LTgiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDA3MUZGIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMERERkYiIHN0b3Atb3BhY2l0eT0iMC43NSIgb2Zmc2V0PSIyMSUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwNkNGRiIgc3RvcC1vcGFjaXR5PSIwLjkyIiBvZmZzZXQ9IjQ2JSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBFQUI5IiBvZmZzZXQ9IjcyJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBBMkZGIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iLTI1My4xNDA1NDclIiB5MT0iLTIwLjkxNjM5MzklIiB4Mj0iMTA0LjUwODcwNiUiIHkyPSI2Mi43Nzg5MzQ4JSIgaWQ9ImxpbmVhckdyYWRpZW50LTkiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDA3MUZGIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMERERkYiIHN0b3Atb3BhY2l0eT0iMC43NSIgb2Zmc2V0PSIyMSUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwNkNGRiIgc3RvcC1vcGFjaXR5PSIwLjkyIiBvZmZzZXQ9IjQ2JSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBFQUI5IiBvZmZzZXQ9IjcyJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBBMkZGIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMzYuMDY1MTAxNSUiIHkxPSI0Ny4wMTg4NzglIiB4Mj0iNDk1Ljk5MjY2OSUiIHkyPSIxNDUuOTYyMjU1JSIgaWQ9ImxpbmVhckdyYWRpZW50LTEwIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwNzFGRiIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBEREZGIiBzdG9wLW9wYWNpdHk9IjAuNzUiIG9mZnNldD0iMjElIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMDZDRkYiIHN0b3Atb3BhY2l0eT0iMC45MiIgb2Zmc2V0PSI0NiUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwRkNBNyIgb2Zmc2V0PSI3MiUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwQTJGRiIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IummlumhtSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEzOC4wMDAwMDAsIC0yNi4wMDAwMDApIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTE0Ij4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzOC4wMDAwMDAsIDI2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02Ljc1LDE2IEM2Ljg3MjcyOTk0LDE2IDYuOTc0ODA0MTksMTYuMDg4NDM3NiA2Ljk5NTk3MjE3LDE2LjIwNTA2MjIgTDcsMTYuMjUgTDcsMTcuNzUgQzcsMTcuODcyNzI5OSA2LjkxMTU2MjQyLDE3Ljk3NDgwNDIgNi43OTQ5Mzc4MiwxNy45OTU5NzIyIEw2Ljc1LDE4IEwxLjI1LDE4IEMxLjEyNzI3MDA2LDE4IDEuMDI1MTk1ODEsMTcuOTExNTYyNCAxLjAwNDAyNzgzLDE3Ljc5NDkzNzggTDEsMTcuNzUgTDEsMTYuMjUgQzEsMTYuMTI3MjcwMSAxLjA4ODQzNzU4LDE2LjAyNTE5NTggMS4yMDUwNjIxOCwxNi4wMDQwMjc4IEwxLjI1LDE2IEw2Ljc1LDE2IFoiIGlkPSLot6/lvoQiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMSkiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTMuODgzNjAwOCwwLjI3MzAxMjYzMSBMMTQuNTA4NSwxLjQ5OTUgTDE0LjUwODUsMS40OTk1IEwxOC43NSwxLjQ5OTk3MjE3IEMxOC44ODgwNjAzLDEuNTAwMDE1MzcgMTguOTk5OTcyMiwxLjYxMTkzOTY4IDE5LDEuNzUgTDE5LDMuMjUgQzE5LDMuMzg4MDcxMTkgMTguODg4MDcxMiwzLjUgMTguNzUsMy41IEwxMi43MTgsMy41IEwxMi43MTgsMy41IEwxMC43MzMsNy41IEwxNi4yNDc1LDcuNDk5NSBMMTUuMTgwNDk1Niw1LjM2MTY0MjI4IEMxNS4xMTg4MzczLDUuMjM4MTAzMjEgMTUuMTY5MDAxNSw1LjA4Nzk3MTA1IDE1LjI5MjU0MDYsNS4wMjYzMTI3MiBDMTUuMzI3MjEyNSw1LjAwOTAwNzk3IDE1LjM2NTQzMjUsNSAxNS40MDQxODI5LDUgTDE2Ljk0NDk5NTQsNSBDMTcuMTM0NTE4NCw1IDE3LjMwNzc1MDYsNS4xMDcxNTQzOSAxNy4zOTIzNzg5LDUuMjc2NzMzMjkgTDE4Ljc3ODEwNzYsOC4wNTM0NjY1OCBDMTkuMDI0NzIxMiw4LjU0NzYzMjczIDE4LjgyNDA0MDIsOS4xNDgxNTMzNiAxOC4zMjk4NzQsOS4zOTQ3NjY5NiBDMTguMTkxMTk1Nyw5LjQ2Mzk3NDM4IDE4LjAzODMyODgsOS41IDE3Ljg4MzM0MDYsOS41IEwxNi40OTk1LDkuNSBMMTYuNDk5NSw5LjUgTDE2LjUsMTUuNzUgQzE2LjUsMTUuODcyNzI5OSAxNi41ODg0Mzc2LDE1Ljk3NDgwNDIgMTYuNzA1MDYyMiwxNS45OTU5NzIyIEwxNi43NSwxNiBMMTguNzUsMTYgQzE4Ljg3MjcyOTksMTYgMTguOTc0ODA0MiwxNi4wODg0Mzc2IDE4Ljk5NTk3MjIsMTYuMjA1MDYyMiBMMTksMTYuMjUgTDE5LDE3Ljc1IEMxOSwxNy44NzI3Mjk5IDE4LjkxMTU2MjQsMTcuOTc0ODA0MiAxOC43OTQ5Mzc4LDE3Ljk5NTk3MjIgTDE4Ljc1LDE4IEwxNS45MDY5MTcyLDE4IEMxNS4xNjgzNzM2LDE4IDE0LjU0NzU3OTIsMTcuNDMzIDE0LjUwMjYwNzYsMTYuNjk3MDQ0NCBMMTQuNSwxNi42MTEzOTkzIEwxNC40OTk1LDkuNSBMMTIuNDk5NSw5LjUgTDEyLjUsMTQuMzAwMjk5IEMxMi41LDE2LjMwODY2OTggMTAuODc0NzcwMiwxNy45MzUwOTU3IDguODU3MDI1ODIsMTcuOTk4MTA1IEw4LjczNTUsMTggTDguMjUsMTggQzguMTI3MjcwMDYsMTggOC4wMjUxOTU4MSwxNy45MTE1NjI0IDguMDA0MDI3ODMsMTcuNzk0OTM3OCBMOCwxNy43NSBMOCwxNi4yNSBDOCwxNi4xMjcyNzAxIDguMDg4NDM3NTgsMTYuMDI1MTk1OCA4LjIwNTA2MjE4LDE2LjAwNDAyNzggTDguMjUsMTYgTDguNzM1NSwxNiBDOS42ODIzOTIyMiwxNiAxMC40NDc0NTM0LDE1LjI4MzczNSAxMC40OTc0MDUzLDE0LjM5MzAzOTkgTDEwLjUsMTQuMzAwMjk5IEwxMC40OTk1LDkuNSBMOS4xMTIyNTA4Nyw5LjUgQzguNTU5OTY2MTIsOS41IDguMTEyMjUwODcsOS4wNTIyODQ3NSA4LjExMjI1MDg3LDguNSBDOC4xMTIyNTA4Nyw4LjM0NTgzNzY2IDguMTQ3ODkzNyw4LjE5Mzc2MjY5IDguMjE2Mzk0OSw4LjA1NTY1NTQ0IEwxMC40NzYsMy41IEwxMC40NzYsMy41IEw4LjI1LDMuNSBDOC4xMTE5Mjg4MSwzLjUgOCwzLjM4ODA3MTE5IDgsMy4yNSBMOCwxLjc1IEM4LDEuNjExOTI4ODEgOC4xMTE5Mjg4MSwxLjUgOC4yNSwxLjUgTDEyLjI2NCwxLjUgTDEyLjI2NCwxLjUgTDExLjY4NTEyNDIsMC4zNjM0NjM2NDcgQzExLjYyMjQ1OTksMC4yNDA0MzE3NTggMTEuNjcxMzk3NiwwLjA4OTg5NTMwMTUgMTEuNzk0NDI5NCwwLjAyNzIzMTA1OTYgQzExLjgyOTU3MzIsMC4wMDkzMzExNjU4NCAxMS44Njg0NTM0LDYuMjc1NjEwODZlLTE3IDExLjkwNzg5MzEsMCBMMTMuNDM4MDkzNSwwIEMxMy42MjYxMTYyLC0yLjU2NTgzODAxZS0xNiAxMy43OTgyNDMzLDAuMTA1NDgxNzMyIDEzLjg4MzYwMDgsMC4yNzMwMTI2MzEgWiIgaWQ9Iui3r+W+hCIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0yKSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zNC44ODM1ODUsMC4yNzMwNzI3MDYgTDM1LjUwODUsMS41IEwzNS41MDg1LDEuNSBMNDAuMjUsMS41IEM0MC4zNzI3Mjk5LDEuNSA0MC40NzQ4MDQyLDEuNTg4NDM3NTggNDAuNDk1OTcyMiwxLjcwNTA2MjE4IEw0MC41LDEuNzUgTDQwLjUsMy4yNSBDNDAuNSwzLjM3MjcyOTk0IDQwLjQxMTU2MjQsMy40NzQ4MDQxOSA0MC4yOTQ5Mzc4LDMuNDk1OTcyMTcgTDQwLjI1LDMuNSBMMjguNzUsMy41IEMyOC42MjcyNzAxLDMuNSAyOC41MjUxOTU4LDMuNDExNTYyNDIgMjguNTA0MDI3OCwzLjI5NDkzNzgyIEwyOC41LDMuMjUgTDI4LjUsMS43NSBDMjguNSwxLjYyNzI3MDA2IDI4LjU4ODQzNzYsMS41MjUxOTU4MSAyOC43MDUwNjIyLDEuNTA0MDI3ODMgTDI4Ljc1LDEuNSBMMzMuMjY0LDEuNSBMMzIuNjg1MTI0MiwwLjM2MzQ2MzY0NyBDMzIuNjIyNDU5OSwwLjI0MDQzMTc1OCAzMi42NzEzOTc2LDAuMDg5ODk1MzAxNSAzMi43OTQ0Mjk0LDAuMDI3MjMxMDU5NiBDMzIuODI5NTczMiwwLjAwOTMzMTE2NTg0IDMyLjg2ODQ1MzQsLTEuNjAyNTc4NDNlLTE1IDMyLjkwNzg5MzEsLTEuMzMyMjY3NjNlLTE1IEwzNC40MzgwNDcyLC0xLjMzMjI2NzYzZS0xNSBDMzQuNjI2MDk0LC0xLjM2NjgxMTI4ZS0xNSAzNC43OTgyMzkxLDAuMTA1NTA4NjggMzQuODgzNTg1LDAuMjczMDcyNzA2IFoiIGlkPSLot6/lvoQiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMykiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjguNzUsNyBMNDAuMjUsNyBDNDAuMzg4MDcxMiw3IDQwLjUsNi44ODgwNzExOSA0MC41LDYuNzUgTDQwLjUsNS4yNSBDNDAuNSw1LjExMTkyODgxIDQwLjM4ODA3MTIsNSA0MC4yNSw1IEwyOC43NSw1IEMyOC42MTE5Mjg4LDUgMjguNSw1LjExMTkyODgxIDI4LjUsNS4yNSBMMjguNSw2Ljc1IEMyOC41LDYuODg4MDcxMTkgMjguNjExOTI4OCw3IDI4Ljc1LDcgWiIgaWQ9IlN0cm9rZS0xNSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC00KSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yOC43NSwxMCBMNDAuMywxMCBDNDAuNDEwNDU2OSwxMCA0MC41LDkuOTEwNDU2OTUgNDAuNSw5LjggTDQwLjUsOC4yIEM0MC41LDguMDg5NTQzMDUgNDAuNDEwNDU2OSw4IDQwLjMsOCBMMjguNzUsOCBDMjguNjExOTI4OCw4IDI4LjUsOC4xMTE5Mjg4MSAyOC41LDguMjUgTDI4LjUsOS43NSBDMjguNSw5Ljg4ODA3MTE5IDI4LjYxMTkyODgsMTAgMjguNzUsMTAgWiIgaWQ9IlN0cm9rZS0xNyIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC00KSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yOS4yNSwxOCBMMzguNSwxOCBDMzkuNjA0NTY5NSwxOCA0MC41LDE3LjEwNDU2OTUgNDAuNSwxNiBMNDAuNSwxMi4yNSBDNDAuNSwxMS44MzU3ODY0IDQwLjE2NDIxMzYsMTEuNSAzOS43NSwxMS41IEwyOS4yNSwxMS41IEMyOC44MzU3ODY0LDExLjUgMjguNSwxMS44MzU3ODY0IDI4LjUsMTIuMjUgTDI4LjUsMTcuMjUgQzI4LjUsMTcuNjY0MjEzNiAyOC44MzU3ODY0LDE4IDI5LjI1LDE4IFogTTMwLjUsMTYgTDMwLjUsMTMuNSBMMzguNSwxMy41IEwzOC41LDE1LjI1IEMzOC41LDE1LjY2NDIxMzYgMzguMTY0MjEzNiwxNiAzNy43NSwxNiBMMzAuNSwxNiBMMzAuNSwxNiBaIiBpZD0iU3Ryb2tlLTI3IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTUpIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTI4LjM5NjA4OCwwIEMyOC41MzQxNTkyLDEuMzUzMzQyNTVlLTE1IDI4LjY0NjA4OCwwLjExMTkyODgxMyAyOC42NDYwODgsMC4yNSBDMjguNjQ2MDg4LDAuMzAyNTYzNTQgMjguNjI5NTIwMiwwLjM1Mzc4OTg0NCAyOC41OTg3Mzk0LDAuMzk2Mzk4MTQxIEwyNi40OTkwMTQ4LDMuMzAxIEwyNi41LDE3Ljc1IEMyNi41LDE3Ljg2ODM0NjcgMjYuNDE3NzY2NiwxNy45Njc0ODY4IDI2LjMwNzMyMjcsMTcuOTkzMzk3MyBMMjYuMjUsMTggTDI0Ljc1LDE4IEMyNC42MTE5Mjg4LDE4IDI0LjUsMTcuODg4MDcxMiAyNC41LDE3Ljc1IEwyNC41LDE3Ljc1IEwyNC40OTkwMTQ4LDYuMDcgTDIzLjYxNjY4NjgsNy4yOTI3OTYyOCBDMjMuNTIyNjgxNyw3LjQyMjkyMjY4IDIzLjM3MTkxMzksNy41IDIzLjIxMTM4NCw3LjUgTDIxLjQ4OTAxNDgsNy41IEMyMS4zNTA5NDM3LDcuNSAyMS4yMzkwMTQ4LDcuMzg4MDcxMTkgMjEuMjM5MDE0OCw3LjI1IEMyMS4yMzkwMTQ4LDcuMTk3NDM2NDYgMjEuMjU1NTgyNiw3LjE0NjIxMDE2IDIxLjI4NjM2MzUsNy4xMDM2MDE4NiBMMjYuMjY4NDE2MSwwLjIwNzIwMzcxOCBDMjYuMzYyNDIxMiwwLjA3NzA3NzMxNTggMjYuNTEzMTg5LDIuNTE1MzM0NjRlLTE2IDI2LjY3MzcxODgsMCBMMjguMzk2MDg4LDAgWiIgaWQ9IuW9oueKtue7k+WQiCIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC02KSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik00NC41LDIgTDQ0LjUsOC41IEw0NC41LDguNSBDNDQuNSwxMy4xOTQyODQ3IDQ4LjMwNTcxNTMsMTcgNTMsMTcgQzU3LjY5NDI4NDcsMTcgNjEuNSwxMy4xOTQyODQ3IDYxLjUsOC41IEw2MS41LDIgQzYxLjUsMS40NDc3MTUyNSA2MS4wNTIyODQ3LDEgNjAuNSwxIEM1OS45NDc3MTUzLDEgNTkuNSwxLjQ0NzcxNTI1IDU5LjUsMiBMNTkuNSw4LjUgTDU5LjUsOC41IEM1OS41LDEyLjA4OTcxNTMgNTYuNTg5NzE1MywxNSA1MywxNSBDNDkuNDEwMjg0NywxNSA0Ni41LDEyLjA4OTcxNTMgNDYuNSw4LjUgTDQ2LjUsMiBDNDYuNSwxLjQ0NzcxNTI1IDQ2LjA1MjI4NDcsMSA0NS41LDEgQzQ0Ljk0NzcxNTMsMSA0NC41LDEuNDQ3NzE1MjUgNDQuNSwyIFoiIGlkPSLot6/lvoQiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtNykiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNzUuNzk4LDE3IEw3Mi4yMDI1LDE3IEM2OC41MDExNDcsMTcgNjUuNSwxMy45OTkyMTY1IDY1LjUsMTAuMjk4IEw2NS41LDcuNzAyIEM2NS41LDQuMDAwNzgzNDkgNjguNTAxMTQ3LDEgNzIuMjAyNSwxIEw3NS43OTgsMSBDNzkuNDk5Mjg0NywxIDgyLjUsNC4wMDA3MTUyNSA4Mi41LDcuNzAyIEw4Mi41LDEwLjI5OCBDODIuNSwxMy45OTkyODQ3IDc5LjQ5OTI4NDcsMTcgNzUuNzk4LDE3IFogTTc1Ljc5OCwxNSBDNzguMzk0NzE1MywxNSA4MC41LDEyLjg5NDcxNTMgODAuNSwxMC4yOTggTDgwLjUsNy43MDIgQzgwLjUsNS4xMDUyODQ3NSA3OC4zOTQ3MTUzLDMgNzUuNzk4LDMgTDcyLjIwMjUsMyBDNjkuNjA1NjYyMywzIDY3LjUsNS4xMDU0MDcyMiA2Ny41LDcuNzAyIEw2Ny41LDEwLjI5OCBDNjcuNSwxMi44OTQ1OTI4IDY5LjYwNTY2MjMsMTUgNzIuMjAyNSwxNSBMNzUuNzk4LDE1IFoiIGlkPSJTdHJva2UtMjEiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtOCkiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTcsOCBDOTkuNDg1Mjg0Nyw4IDEwMS41LDEwLjAxNDcxNTMgMTAxLjUsMTIuNSBDMTAxLjUsMTQuOTg1Mjg0NyA5OS40ODUyODQ3LDE3IDk3LDE3IEw5NywxNyBMODcuNSwxNyBDODYuOTQ3NzE1MywxNyA4Ni41LDE2LjU1MjI4NDcgODYuNSwxNiBDODYuNSwxNS40NDc3MTUzIDg2Ljk0NzcxNTMsMTUgODcuNSwxNSBMODcuNSwxNSBMOTcsMTUgQzk4LjM4MDcxNTMsMTUgOTkuNSwxMy44ODA3MTUzIDk5LjUsMTIuNSBDOTkuNSwxMS4xMTkyODQ3IDk4LjM4MDcxNTMsMTAgOTcsMTAgTDk3LDEwIEw5MCwxMCBDODcuNTE0NzE1MywxMCA4NS41LDcuOTg1Mjg0NzUgODUuNSw1LjUgQzg1LjUsMy4wMTQ3MTUyNSA4Ny41MTQ3MTUzLDEgOTAsMSBMOTAsMSBMOTkuNSwxIEMxMDAuMDUyMjg1LDEgMTAwLjUsMS40NDc3MTUyNSAxMDAuNSwyIEMxMDAuNSwyLjU1MjI4NDc1IDEwMC4wNTIyODUsMyA5OS41LDMgTDk5LjUsMyBMOTAsMyBDODguNjE5Mjg0NywzIDg3LjUsNC4xMTkyODQ3NSA4Ny41LDUuNSBDODcuNSw2Ljg4MDcxNTI1IDg4LjYxOTI4NDcsOCA5MCw4IEw5MCw4IFoiIGlkPSLlvaLnirbnu5PlkIgiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtOSkiIG9wYWNpdHk9IjAuOTciPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNi4yOTQ5NzI2OSwwLjM3MDkzNzU2NyBMMy40Niw1LjUgTDMuNDYsNS41IEw0LjU3NDUsNS41IEw2LjQxMTk4NTc0LDUuNSBDNi41NTAwNTY5Myw1LjUgNi42NjE5ODU3NCw1LjYxMTkyODgxIDYuNjYxOTg1NzQsNS43NSBDNi42NjE5ODU3NCw1Ljc4OTQ2MjA3IDYuNjUyNjQ0LDUuODI4MzYzNjQgNi42MzQ3MjQ2NSw1Ljg2MzUyMjYgTDMuNzYyLDExLjUgTDMuNzYyLDExLjUgTDYuNzUsMTEuNSBDNi44ODgwNzExOSwxMS41IDcsMTEuNjExOTI4OCA3LDExLjc1IEw3LDEzLjI1IEM3LDEzLjM4ODA3MTIgNi44ODgwNzExOSwxMy41IDYuNzUsMTMuNSBMMi41LDEzLjUgTDIuNSwxMy41IEwxLjcyMzY3OTI3LDEzLjUgQzEuMzA5NDY1NzEsMTMuNSAwLjk3MzY3OTI3NCwxMy4xNjQyMTM2IDAuOTczNjc5Mjc0LDEyLjc1IEMwLjk3MzY3OTI3NCwxMi42MzE2ODA5IDEuMDAxNjcyNzcsMTIuNTE1MDQwNCAxLjA1NTM3MjQ1LDEyLjQwOTYwOTEgTDMuNTU2LDcuNSBMMy41NTYsNy41IEwxLjUyNTY4ODA5LDcuNSBDMS4wMjg2MzE4MSw3LjUgMC42MjU2ODgwODgsNy4wOTcwNTYyNyAwLjYyNTY4ODA4OCw2LjYgQzAuNjI1Njg4MDg4LDYuNDQ3NzI2NTYgMC42NjQzMjM3MTgsNi4yOTc5NDI2OCAwLjczNzk3ODcxOSw2LjE2NDY2OCBMNC4wMDIyNDk2MywwLjI1ODE0ODg4OSBDNC4wOTAyNzQxNywwLjA5ODg3MzMxNTQgNC4yNTc4ODUxLDMuNjY0OTYyNDZlLTE2IDQuNDM5ODY1OTUsMCBMNi4wNzYxNzExNywwIEM2LjIxNDI0MjM2LC05LjEzNTQxNjg1ZS0xNiA2LjMyNjE3MTE3LDAuMTExOTI4ODEzIDYuMzI2MTcxMTcsMC4yNSBDNi4zMjYxNzExNywwLjI5MjMwMjgyNiA2LjMxNTQzNjY5LDAuMzMzOTEzODc2IDYuMjk0OTcyNjksMC4zNzA5Mzc1NjcgWiIgaWQ9Iui3r+W+hCIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0xMCkiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';

class TopBarComponent {
    constructor(sanitizer, nzIcon) {
        this.sanitizer = sanitizer;
        this.logoSrc = ''; // logo区域展示图片文件路径
        this.logoHref = ''; // 点击logo区域所跳转的路径 若无此参数，则logo区域不可点击
        this.topMenus = []; // 菜单项列表
        this.topFast = []; // 快捷按钮列表
        this.search = false; // 是否存在搜索框（默认不存在）
        this.searchPlaceholder = '搜索'; // 输入框内提示文本内容 （默认为："搜索"）
        this.searchInput = new EventEmitter();
        this.searchEvent = new EventEmitter();
        this.user = true; // 用户头像是否存在  默认存在
        this.userAvatar = ''; // 用户头像图片路径
        this.userText = ''; // 用户头像区域显示的文本内容
        this.userActions = []; // 用户区域下拉选项列表
        this.userEvent = new EventEmitter();
        this.logoBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(logobase64);
        this.searchContorl = new FormControl();
        nzIcon.addIcon(DownOutline, UserOutline);
    }
    get searchRight() {
        if (this.search) {
            if (this.searchPosition === 'right') {
                return true;
            }
            if (this.searchPosition === 'left') {
                return false;
            }
            if (this.topMenus && this.topMenus.length > 0) {
                return true;
            }
        }
        return false;
    }
    get searchLeft() {
        if (this.search) {
            if (this.searchPosition === 'left') {
                return true;
            }
            if (this.searchPosition === 'right') {
                return false;
            }
            if (!this.topMenus || this.topMenus.length === 0) {
                return true;
            }
        }
        return false;
    }
    ngOnInit() {
        this.searchContorl.valueChanges.pipe(debounceTime(300)).subscribe(value => this.searchInput.emit(value));
    }
}
TopBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-top-bar',
                template: "<div class=\"gk-top-bar-container\">\n    <div class=\"gk-topbar-left-container clearfix\">\n        <div class=\"gk-topbar-logo-container\">\n            <ng-container *ngIf=\"logo_content.childNodes.length == 0\">\n                <div class=\"gk-logo-default\">\n                    <img class=\"gk-logo-img\" [src]=\"logoSrc?logoSrc:logoBase64\" alt=\"\" />\n                    <a class=\"gk-logo-link\" *ngIf=\"logoHref\" [routerLink]=\"[logoHref]\"></a>\n                </div>\n            </ng-container>\n\n            <div #logo_content class=\"gk-topbar-logo-content\">\n                <ng-content select=\"#logo\"></ng-content>\n            </div>\n        </div>\n        <div class=\"gk-topbar-menu-container\" *ngIf='topMenus && topMenus.length'>\n            <div class=\"menu\">\n                <ul class=\"gk-title-stress\">\n                    <ng-container *ngFor=\"let firstMenu of topMenus\">\n                        <li *ngIf=\"$any(firstMenu).children\">\n                            <a nz-dropdown class=\"gk-title\" [nzDropdownMenu]=\"childMenu\">\n                                <gk-icon [type]=\"firstMenu.icon\" style=\"margin-right: 3px;\"></gk-icon>\n                                <span>{{ firstMenu.label }}</span>\n                                <gk-icon type=\"down\"></gk-icon>\n                            </a>\n                            <nz-dropdown-menu #childMenu=\"nzDropdownMenu\">\n                                <ul nz-menu nzSelectable class=\"gk-top-bar-dropdown\">\n                                    <li *ngFor=\"let secondMenu of $any(firstMenu).children\" nz-menu-item>\n                                        <a [routerLink]=\"[secondMenu.path]\" [queryParams]=\"secondMenu.queryParams\"\n                                            class=\"gk-title-minor\">{{ secondMenu.label }}</a>\n                                    </li>\n                                </ul>\n                            </nz-dropdown-menu>\n                        </li>\n                        <li *ngIf=\"!$any(firstMenu).children\">\n                            <a class=\"gk-title\" [routerLink]=\"[$any(firstMenu).path]\"\n                                [queryParams]=\"$any(firstMenu).queryParams\">\n                                <gk-icon [type]=\"firstMenu.icon\" style=\"margin-right: 3px;\"></gk-icon>\n                                <span>{{ firstMenu.label }}</span>\n                            </a>\n                        </li>\n                    </ng-container>\n\n                </ul>\n            </div>\n        </div>\n\n        <gk-top-search *ngIf='searchLeft' [control]='searchContorl' [searchPlaceholder]=\"searchPlaceholder\"\n            (doSearch)='searchEvent.emit(searchContorl.value)'></gk-top-search>\n\n        <div class=\"gk-topbar-left-content\">\n            <ng-content select=\"#left\"></ng-content>\n        </div>\n    </div>\n\n    <div class=\"gk-topbar-right-container clearfix\">\n        <div class=\"gk-topbar-right-content\">\n            <ng-content select=\"#right\"></ng-content>\n        </div>\n\n        <gk-top-search *ngIf='searchRight' [control]='searchContorl' [searchPlaceholder]=\"searchPlaceholder\"\n            (doSearch)='searchEvent.emit(searchContorl.value)'></gk-top-search>\n\n        <div class=\"gk-topbar-fastbtns-container\" *ngIf='topFast?.length'>\n            <div class=\"fastbtns\">\n                <ng-container *ngFor=\"let child of topFast\">\n                    <a class=\"gk-title-minor gk-topbar-fastbtns-item\" [routerLink]='[child.path]'>\n                        <gk-icon [type]=\"child.icon\" style=\"margin-right: 3px;\"></gk-icon>\n                        <span>{{ child.label }}</span>\n                    </a>\n                </ng-container>\n            </div>\n        </div>\n        <div class=\"gk-topbar-user-container\" *ngIf='user'>\n            <ng-container *ngIf='userActions.length'>\n                <div class=\"user\" nz-dropdown [nzDropdownMenu]=\"menu\">\n                    <nz-avatar nzIcon=\"user\" [nzSize]=\"30\" [nzSrc]=\"userAvatar\"\n                        [ngClass]=\"{'without-usericon':!userAvatar}\"></nz-avatar>\n                    <span *ngIf=\"userText\" style=\"margin-left: 3px;\">{{userText}}</span>\n                    <gk-icon *ngIf=\"userActions.length\" type=\"down\" style=\"margin-left: 5px;\"></gk-icon>\n                </div>\n                <nz-dropdown-menu #menu=\"nzDropdownMenu\">\n                    <ul nz-menu>\n                        <li nz-menu-item *ngFor=\"let item of userActions\" (click)=\"userEvent.emit(item)\">\n                            <gk-icon [type]=\"item.icon\" style=\"margin-right: 3px;\"></gk-icon>\n                            <span>{{ item.label }}</span>\n                        </li>\n                    </ul>\n                </nz-dropdown-menu>\n            </ng-container>\n            <ng-container *ngIf='!userActions.length'>\n                <div class=\"user\">\n                    <nz-avatar nzIcon=\"user\" [nzSize]=\"30\" [nzSrc]=\"userAvatar\"\n                        [ngClass]=\"{'without-usericon':!userAvatar}\"></nz-avatar>\n                    <span *ngIf=\"userText\">{{ userText }}</span>\n                </div>\n            </ng-container>\n        </div>\n    </div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled),.gk-top-bar-dropdown a:hover{color:#3266fb}.gk-top-bar-dropdown i{margin-right:4px}.gk-top-bar-dropdown .gk-topbar-no-icon a,.gk-top-bar-dropdown .gk-topbar-no-icon span{margin-left:19px;padding-left:0}.gk-top-bar-container{background:#fff;height:72px;overflow-y:hidden;width:100%}.gk-top-bar-container .clearfix:after{clear:both;content:\"\";display:block;height:0;visibility:hidden}.gk-top-bar-container .cursor-default{cursor:default}.gk-top-bar-container .gk-topbar-search-container{float:left;height:72px;line-height:72px;margin-right:71px}.gk-top-bar-container .gk-topbar-search-container .ant-input-affix-wrapper{background:#f7f8fa;color:#000;outline:none;width:168px}.gk-top-bar-container .gk-topbar-search-container .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-focused){border:1px solid transparent}.gk-top-bar-container .gk-topbar-search-container .ant-input-affix-wrapper input{background:#f7f8fa;color:#000}.gk-top-bar-container .gk-topbar-left-container{float:left}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-logo-container{float:left;height:72px;min-width:208px;position:relative}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-logo-container .gk-logo-default{display:inline-block;height:100%;width:208px}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-logo-container .gk-logo-default .gk-logo-img{border:none;left:50%;max-height:100%;max-width:100%;position:absolute;top:50%;transform:translate(-50%,-50%)}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-logo-container .gk-logo-default .gk-logo-link{height:100%;position:absolute;width:100%}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-menu-container{align-items:center;display:flex;float:left;height:72px;justify-content:center;margin-left:16px}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-menu-container .menu>ul>li{float:left;list-style:none;margin-right:46px}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-menu-container .menu>ul>li .submenu li{list-style:none;width:100%}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-menu-container .menu ul{margin:0;padding:0}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-menu-container .menu ul:after,.gk-top-bar-container .gk-topbar-left-container .gk-topbar-menu-container .menu ul:before{clear:both;content:\"\";display:block}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-menu-container .menu ul li{list-style:none}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-menu-container .menu ul li a{color:#595959}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-menu-container .menu ul li a:hover{color:#3266fb}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-menu-container .menu ul li .anticon-down{font-size:10px;margin-left:4px}.gk-top-bar-container .gk-topbar-left-container .gk-topbar-left-content{float:left;height:100%;overflow:hidden}.gk-top-bar-container .gk-topbar-right-container{float:right;height:72px;line-height:72px;margin-right:28px}.gk-top-bar-container .gk-topbar-right-container .gk-topbar-right-content{float:left;height:100%;line-height:normal;margin-right:28px;overflow:hidden}.gk-top-bar-container .gk-topbar-right-container .gk-topbar-fastbtns-container{color:#333;float:left;margin-right:34px}.gk-top-bar-container .gk-topbar-right-container .gk-topbar-fastbtns-container .gk-topbar-fastbtns-item{margin-left:10px}.gk-top-bar-container .gk-topbar-right-container .gk-topbar-user-container{float:left}.gk-top-bar-container .gk-topbar-right-container .gk-topbar-user-container .without-usericon{background-color:#00a2ae}"]
            },] }
];
TopBarComponent.ctorParameters = () => [
    { type: DomSanitizer },
    { type: NzIconService }
];
TopBarComponent.propDecorators = {
    logoSrc: [{ type: Input }],
    logoHref: [{ type: Input }],
    topMenus: [{ type: Input }],
    topFast: [{ type: Input }],
    search: [{ type: Input }],
    searchPlaceholder: [{ type: Input }],
    searchPosition: [{ type: Input }],
    searchInput: [{ type: Output }],
    searchEvent: [{ type: Output }],
    user: [{ type: Input }],
    userAvatar: [{ type: Input }],
    userText: [{ type: Input }],
    userActions: [{ type: Input }],
    userEvent: [{ type: Output }]
};

// 二级菜单(必然可点击)
class GKSecondMenuLink {
    constructor(label, path, component, config = {}) {
        this.label = label;
        this.path = path;
        this.component = component;
        this.config = config;
        this.type = 'secondMenuLink';
    }
}
// 一级可点击菜单
class GKFirstMenuLink {
    constructor(icon, label, path, component, config = {}) {
        this.icon = icon;
        this.label = label;
        this.path = path;
        this.component = component;
        this.config = config;
        this.type = 'firtsMenuLink';
    }
}
// 一级父菜单
class GKFirstMenuWp {
    constructor(icon, label, children) {
        this.icon = icon;
        this.label = label;
        this.children = children;
        this.type = 'firtsMenuWp';
    }
}
// 菜单组
class GKMenuGroup {
    constructor(title, menus) {
        this.title = title;
        this.menus = menus;
        this.type = 'menuGroup';
    }
}
/**
 * 侧边栏菜单配置类
 */
class GKAsideMenus {
    constructor(list, fastMenus = []) {
        this.fastMenus = fastMenus;
        this.menuGroups = [];
        this.firstMenus = [];
        this.routes = [];
        this.createMenus(list);
        this.createRoutes();
    }
    createMenus(list) {
        for (const item of list) {
            if (item.type === 'menuGroup') {
                this.menuGroups.push(item);
                this.firstMenus.push(...item.menus);
            }
            else {
                this.menuGroups.push(new GKMenuGroup('', [item]));
                this.firstMenus.push(item);
            }
        }
    }
    createRoutes() {
        for (const firstMenu of this.firstMenus) {
            if (firstMenu.type === 'firtsMenuWp') {
                for (const secondMenu of firstMenu.children) {
                    this.addRouteByMenu(secondMenu);
                }
            }
            else {
                this.addRouteByMenu(firstMenu);
            }
        }
    }
    addRouteByMenu(menu) {
        const menuRoute = menu.config.route ? menu.config.route : {};
        if (!menuRoute.path && menu.path) {
            menuRoute.path = menu.path;
        }
        if (!menuRoute.component && menu.component) {
            menuRoute.component = menu.component;
        }
        if (menuRoute.component) {
            if (menu.config.breadCrumbs !== undefined) {
                if (!menuRoute.data) {
                    menuRoute.data = {};
                }
                menuRoute.data.breadCrumbs = menu.config.breadCrumbs;
            }
            this.routes.push(menuRoute);
        }
    }
    pushRoute(routes) {
        this.routes.push(...routes);
    }
}

class GKBreadCrumbsService {
    constructor() {
        this.enable = false;
        this.prefix = [];
        this.list = [];
    }
    get() {
        return this.list.length > 0 ? [...this.prefix, ...this.list] : [];
    }
    set(newVal) {
        this.list = newVal;
    }
}
GKBreadCrumbsService.ɵprov = ɵɵdefineInjectable({ factory: function GKBreadCrumbsService_Factory() { return new GKBreadCrumbsService(); }, token: GKBreadCrumbsService, providedIn: "root" });
GKBreadCrumbsService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
GKBreadCrumbsService.ctorParameters = () => [];

class HomeComponent {
    constructor(bcs) {
        this.bcs = bcs;
        this.searchPlaceholder = '搜索'; // 搜索框内提示文字
        this.searchInput = new EventEmitter(); // 搜索框输入事件
        this.searchEvent = new EventEmitter(); // 点击搜索事件
        this.userConf = { user: true, userActions: [] }; // 用户区配置项
        this.userEvent = new EventEmitter(); // 点击用户区下拉列表事件
    }
    get asideMenus() { return this._asideMenus; }
    set asideMenus(newVal) {
        this._asideMenus = newVal;
        if (newVal instanceof GKAsideMenus) {
            this.asideMenusClass = newVal;
        }
        else {
            this.asideMenusClass = new GKAsideMenus(newVal);
        }
    }
    ngOnInit() {
    }
    get showBcs() {
        return this.bcs.enable && this.bcs.get().length > 0;
    }
}
HomeComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-home',
                template: "<div class=\"gk-home-container\">\n    <div class=\"gk-top\">\n        <gk-top-bar [logoSrc]=\"logoSrc\" [logoHref]=\"logoHref\" [topMenus]=\"topMenus\" [topFast]=\"topFast\"\n            [user]=\"userConf.user !== false\" [userText]=\"userConf.userText\" [userActions]=\"userConf.userActions\"\n            [search]=\"search\" [searchPlaceholder]=\"searchPlaceholder\" [searchPosition]=\"searchPosition\"\n            (searchEvent)=\"searchEvent.emit($event)\" (userEvent)=\"userEvent.emit($event)\"\n            (searchInput)=\"searchInput.emit($event)\">\n            <ng-content id=\"logo\" select=\"#logo\"></ng-content>\n            <ng-content id=\"left\" select=\"#left\"></ng-content>\n            <ng-content id='right' select=\"#right\"></ng-content>\n        </gk-top-bar>\n    </div>\n    <main class=\"gk-content\">\n        <div class=\"gk-aside\">\n            <gk-aside-menu [asideMenus]=\"asideMenusClass\"></gk-aside-menu>\n        </div>\n        <div class=\"gk-inner-page\" [ngClass]=\"{ 'has-bread-crumbs': showBcs }\">\n            <gk-bread-crumbs *ngIf=\"bcs.enable\" [asideMenus]=\"asideMenusClass\" class=\"gk-bread-crumbs\">\n            </gk-bread-crumbs>\n            <div class=\"gk-inner-body\">\n                <ng-content select=\"#inner-page\"> </ng-content>\n                <router-outlet></router-outlet>\n            </div>\n        </div>\n    </main>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}body,html{height:100%}.gk-home-container{box-sizing:border-box;height:100%;padding-top:72px;position:relative}.gk-home-container .gk-top{box-shadow:0 3px 10px rgba(0,0,0,.05);height:72px;left:0;position:fixed;top:0;width:100%;z-index:900}.gk-home-container .gk-content{box-sizing:border-box;height:100%;padding-left:208px;position:relative}.gk-home-container .gk-content .gk-aside{bottom:0;box-shadow:0 0 2px rgba(0,0,0,.05);left:0;overflow:hidden;position:fixed;top:72px;width:208px;z-index:899}.gk-home-container .gk-content .gk-inner-page{box-sizing:border-box;height:100%;padding-top:24px;position:relative}.gk-home-container .gk-content .gk-inner-page.has-bread-crumbs{padding-top:70px}.gk-home-container .gk-content .gk-inner-page .gk-inner-body{box-sizing:border-box;padding:0 24px 24px}.gk-home-container .gk-content .gk-inner-page .gk-bread-crumbs{height:22px;line-height:22px;padding-left:24px;padding-right:24px;position:absolute;top:24px}"]
            },] }
];
HomeComponent.ctorParameters = () => [
    { type: GKBreadCrumbsService }
];
HomeComponent.propDecorators = {
    logoSrc: [{ type: Input }],
    logoHref: [{ type: Input }],
    topMenus: [{ type: Input }],
    topFast: [{ type: Input }],
    search: [{ type: Input }],
    searchPlaceholder: [{ type: Input }],
    searchPosition: [{ type: Input }],
    searchInput: [{ type: Output }],
    searchEvent: [{ type: Output }],
    userConf: [{ type: Input }],
    userEvent: [{ type: Output }],
    asideMenus: [{ type: Input }]
};

class BreadCrumbsComponent {
    constructor(router, activatedRoute, bcs) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.bcs = bcs;
        this.router$ = this.router.events.pipe(filter((evt) => evt instanceof NavigationEnd), tap(() => {
            this.getBreadCrumbs();
        }));
    }
    getBreadCrumbs() {
        const routerTree = this.activatedRoute.snapshot;
        const urls = [];
        const dataList = [];
        let routerNow = routerTree;
        while (true) {
            urls.push(routerNow.url);
            dataList.push(routerNow.data);
            if (routerNow.children.length === 0) {
                break;
            }
            else {
                routerNow = routerNow.children[0];
            }
        }
        for (let i = dataList.length - 1; i >= 0; i--) {
            const breadCrumbs = dataList[i].breadCrumbs;
            if (breadCrumbs !== undefined) {
                this.bcs.set(typeof breadCrumbs === 'boolean' ? [] : breadCrumbs);
                return;
            }
        }
        const menuBreadCrumbs = this.getBreadCrumbsByMenu(urls.join('/'));
        this.bcs.set(menuBreadCrumbs);
    }
    getBreadCrumbsByMenu(path) {
        for (const firstMenu of this.asideMenus.firstMenus) {
            if (firstMenu.type === 'firtsMenuWp') {
                for (const secondMenu of firstMenu.children) {
                    if (path === `/${secondMenu.path}`) {
                        return [{ label: firstMenu.label }, { label: secondMenu.label, path }];
                    }
                }
            }
            else {
                if (path === `/${firstMenu.path}`) {
                    return [{ label: firstMenu.label, path }];
                }
            }
        }
        return [];
    }
    ngOnInit() {
        setTimeout(() => {
            this.getBreadCrumbs();
        }, 0);
    }
}
BreadCrumbsComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-bread-crumbs',
                template: "<nz-breadcrumb class=\"gk-bread-crumbs-container\">\n    <nz-breadcrumb-item *ngFor=\"let nav of bcs.get()\">\n        <a *ngIf=\"!!nav.path\" [routerLink]=\"[nav.path]\" class=\"gk-nav\">{{ nav.label }}</a>\n        <ng-container *ngIf=\"!nav.path\">{{ nav.label }}</ng-container>\n    </nz-breadcrumb-item>\n</nz-breadcrumb>\n\n<ng-container *ngIf=\"router$ | async\"></ng-container>\n",
                styles: ["::ng-deep .ant-breadcrumb-separator{margin:0 6px}"]
            },] }
];
BreadCrumbsComponent.ctorParameters = () => [
    { type: Router },
    { type: ActivatedRoute },
    { type: GKBreadCrumbsService }
];
BreadCrumbsComponent.propDecorators = {
    asideMenus: [{ type: Input }]
};

class TopSearchComponent {
    constructor(nzIcon) {
        this.nzIcon = nzIcon;
        this.doSearch = new EventEmitter();
        this.nzIcon.addIcon(SearchOutline);
    }
    ngOnInit() {
    }
    keyup({ code }) {
        if (code === 'Enter') {
            this.doSearch.emit();
        }
    }
}
TopSearchComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-top-search',
                template: "<div class=\"gk-topbar-search-container\">\n    <nz-input-group [nzSuffix]=\"suffixIconSearch\">\n        <input type=\"text\" [formControl]='control' nz-input [placeholder]=\"searchPlaceholder\" (keyup)=\"keyup($event)\" />\n    </nz-input-group>\n    <ng-template #suffixIconSearch>\n        <gk-icon type=\"search\" (click)=\"doSearch.emit()\"></gk-icon>\n    </ng-template>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}.gk-topbar-search-container .ant-input-suffix{cursor:pointer}.gk-topbar-search-container .ant-input-suffix:hover{color:#3266fb}"]
            },] }
];
TopSearchComponent.ctorParameters = () => [
    { type: NzIconService }
];
TopSearchComponent.propDecorators = {
    searchPlaceholder: [{ type: Input }],
    doSearch: [{ type: Output }],
    control: [{ type: Input }]
};

class IconComponent {
    constructor() { }
    get mode() {
        if (!this.type) {
            return '';
        }
        if (this.type.startsWith('icon-')) {
            return 'nzIconfont';
        }
        if (this.type.startsWith('iconfont-')) {
            return 'nzIconfont';
        }
        return 'nzType';
    }
    get isHide() { return !this.mode; }
    get nzType() {
        if (!this.type) {
            return '';
        }
        return this.type.replace(/-(outline|fill|twotone)$/, '');
    }
    get nzTheme() {
        if (!this.type) {
            return 'outline';
        }
        if (this.type.endsWith('-outline')) {
            return 'outline';
        }
        if (this.type.endsWith('-fill')) {
            return 'fill';
        }
        if (this.type.endsWith('-twotone')) {
            return 'twotone';
        }
        return 'outline';
    }
    ngOnInit() {
    }
}
IconComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-icon',
                template: "<i nz-icon *ngIf=\"mode === 'nzType'\" [nzType]=\"nzType\" [nzTheme]=\"nzTheme\" class=\"gk-icon-container\"></i>\n<i nz-icon *ngIf=\"mode === 'nzIconfont'\" [nzIconfont]=\"type || ''\" class=\"gk-icon-container\"></i>\n",
                styles: [":host{display:inline-block;line-height:0}:host.gk-icon-is-hide{display:none}"]
            },] }
];
IconComponent.ctorParameters = () => [];
IconComponent.propDecorators = {
    type: [{ type: Input }],
    isHide: [{ type: HostBinding, args: ['class.gk-icon-is-hide',] }]
};

class GKIconModule {
}
GKIconModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    IconComponent,
                ],
                imports: [
                    CommonModule,
                    NzIconModule,
                ],
                exports: [
                    IconComponent,
                ],
            },] }
];

class GKHomeModule {
}
GKHomeModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    AsideMenuComponent,
                    TopBarComponent,
                    HomeComponent,
                    BreadCrumbsComponent,
                    TopSearchComponent,
                ],
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    RouterModule,
                    NzBreadCrumbModule,
                    NzDropDownModule,
                    NzInputModule,
                    NzAvatarModule,
                    NzFormModule,
                    NzInputNumberModule,
                    NzDatePickerModule,
                    NzSelectModule,
                    GKIconModule,
                ],
                exports: [
                    AsideMenuComponent,
                    TopBarComponent,
                    HomeComponent,
                ],
            },] }
];

const GK_TABLE_CONF = new InjectionToken('table.conf');
const defaultTableConf = {};

/** 普通表格列 */
class GKTableColumn {
    constructor(label, prop, conf) {
        this.label = label;
        this.prop = prop;
        this.type = 'default';
        if (conf) {
            for (const [k, v] of Object.entries(conf)) {
                if (v !== undefined) {
                    this[k] = v;
                }
            }
        }
    }
}
class GKTableColPoint {
    constructor(text, type) {
        this.text = text;
        this.type = type;
    }
}
class GKTableColImage {
    constructor(url, size) {
        this.url = url;
        this.size = size;
    }
}
class GKTableColSwitch {
    constructor(config) {
        this.config = config;
    }
}
/** 操作列 */
class GKTableOperateColumn {
    constructor(btns = [], conf) {
        this.type = 'operate';
        this.label = '操作';
        if (conf === null || conf === void 0 ? void 0 : conf.fixed) {
            this.fixed = 'right';
        }
        this.btns = btns.map((item) => {
            if (typeof item === 'string') {
                switch (item) {
                    case 'detail':
                    case 'd':
                        return { label: '查看', value: 'detail' };
                    case 'update':
                    case 'u':
                        return {
                            label: '编辑',
                            value: 'update',
                        };
                    case 'remove':
                    case 'r':
                        return {
                            label: '删除',
                            value: 'remove',
                        };
                }
            }
            return item;
        });
        if (conf) {
            for (const [k, v] of Object.entries(conf)) {
                if (v !== undefined) {
                    this[k] = v;
                }
            }
        }
    }
}
/**
 * 操作列点击事件所传递出来的对象
 */
class GKTableOperateEvent {
    constructor(value, data, index) {
        this.value = value;
        this.data = data;
        this.index = index;
    }
}

class BaseService {
    init(instance) {
        this.tableInstance = instance;
    }
}

class CheckService extends BaseService {
    constructor() {
        super(...arguments);
        /**
         * 计算所在行是否应当显示勾选框
         * @param data 当前行的数据
         * @param index 当前行所在索引
         */
        this.showCheck = (data, index) => {
            let show = true;
            if (this.tableInstance.conf && this.tableInstance.conf.checkFilter) {
                show = this.tableInstance.conf.checkFilter(data, index);
            }
            return show;
        };
        /**
         * 单条数据选中状态切换
         * @param item 切换选中项时，当前行的数据
         * @param event 选中状态
         */
        this.onItemChecked = (item, event) => {
            const idxs = this.tableInstance.checks.findIndex((it) => it === item);
            const newCheck = [...this.tableInstance.checks];
            if (event && idxs < 0) {
                // event值为选中，而且当前元素不在选中列表当中
                newCheck.push(item);
                this.tableInstance.checks = newCheck;
            }
            else if (!event && idxs >= 0) {
                // event值为取消选中，而且当前元素存在于选中列表当中
                newCheck.splice(idxs, 1);
                this.tableInstance.checks = newCheck;
            }
        };
        /** 传入数据，返回当前数据选中状态 */
        this.isCheck = (item) => !!this.tableInstance.checks.find((it) => it === item);
    }
}
CheckService.ɵprov = ɵɵdefineInjectable({ factory: function CheckService_Factory() { return new CheckService(); }, token: CheckService, providedIn: "root" });
CheckService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];

class SortService extends BaseService {
    constructor() {
        super(...arguments);
        /** 排序状态初始化 */
        this.sortInit = () => {
            this.tableInstance.columns.map((col) => {
                if (col.sort) {
                    this.tableInstance.sortColumn = this.getSortKey(col);
                    this.tableInstance.sortState = col.sort === true ? null : col.sort;
                }
            });
        };
        /**
         * 排序数据发生变化时
         * @param event 排序状态
         * @param col 排序状态发生变化的列
         */
        this.sortChange = (event, col) => {
            this.tableInstance.sortColumn = this.getSortKey(col);
            this.tableInstance.sortState = event;
            this.tableInstance.getData(1);
        };
        /**
         * 根据列数据和表格实例的相关信息返回当前列的排序状态（升序，降序，不做排序）
         * @param col 当前列
         */
        this.getSortState = (col) => {
            let target = null;
            if (!!col.sort) {
                const sortKey = this.getSortKey(col);
                if (this.tableInstance.sortColumn === sortKey) {
                    target = this.tableInstance.sortState;
                }
            }
            return target;
        };
    }
    /**
     * 根据当前列配置返回排序查询时应当使用的key名
     * @param col 当前列配置项
     */
    getSortKey(col) {
        let target;
        if (col.sortKey) {
            target = col.sortKey;
        }
        else if (typeof col.prop === 'string' && col.prop !== '') {
            target = col.prop;
        }
        else {
            throw new Error('在未设置当前列prop值，且使用了排序功能时，必须指定sortKey值');
        }
        return target;
    }
}
SortService.ɵprov = ɵɵdefineInjectable({ factory: function SortService_Factory() { return new SortService(); }, token: SortService, providedIn: "root" });
SortService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];

class TableService {
    constructor(cs) {
        this.cs = cs;
        /**
         * 根据表格组件的配置项，传入的按钮列表，当前数据值等进行计算 并最终展示应当返回的按钮列表
         * @param btns 原始按钮列表
         * @param data 当前行所对于的数据值
         * @param index 当前行所在索引
         */
        this.btnFilter = (btns, data, index) => {
            let targetBtns = btns;
            if (this.tableInstance.conf && this.tableInstance.conf.operateFileter) {
                targetBtns = this.tableInstance.conf.operateFileter(btns, data, index);
            }
            return targetBtns.map((t) => {
                const target = Object.assign({}, t);
                target.filter = t.filter ? t.filter(data, index) : true;
                target.disabled = t.disabled && t.disabled(data, index);
                target.type = this.getType(target.type, data, index);
                return target;
            });
        };
        /**
         * 传入string或function类型的type值 返回纯string的type值
         * @param type 原始type值
         * @param item 当前按钮所在行的数据
         * @param index 当前按钮所在行索引
         */
        this.getType = (type, item, index) => {
            if (typeof type === 'function') {
                return type(item, index);
            }
            return type;
        };
    }
    init(instance) {
        this.tableInstance = instance;
        this.cs.init(this.tableInstance);
    }
    /**
     * 根据当前表格配置和操作列配置数据，返回相应的scroll值
     */
    getScroll() {
        const someColFixed = this.tableInstance.columns.some((col) => col.fixed);
        return someColFixed ? { x: this.tableInstance.scrollX } : undefined;
    }
    /**
     * 获取表格配置当中指定属性的值
     * @param keyName 属性名
     * @param defaultValue 默认值，当表格配置中没有该值时，返回的默认值
     */
    showFactory(keyName, defaultValue = true) {
        let target = defaultValue;
        if (this.tableInstance.globalConf[keyName] !== undefined) {
            target = this.tableInstance.globalConf[keyName];
        }
        if (this.tableInstance.conf && this.tableInstance.conf[keyName] !== undefined) {
            target = this.tableInstance.conf[keyName];
        }
        return target;
    }
    tableLayout() {
        const someColFixed = this.tableInstance.columns.some((col) => col.fixed);
        return (someColFixed || this.tableInstance.ellipsis) ? 'fixed' : 'auto';
    }
    /**
     * 判断某个值是否能被当做自定义宽度使用
     * @param width 需要被判断的值
     */
    customizeWidth(width) {
        if (typeof width === 'string') {
            return true;
        }
        return false;
    }
}
TableService.ɵprov = ɵɵdefineInjectable({ factory: function TableService_Factory() { return new TableService(ɵɵinject(CheckService)); }, token: TableService, providedIn: "root" });
TableService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
TableService.ctorParameters = () => [
    { type: CheckService }
];

class TableComponent {
    constructor(globalConf, tbs, cks, sts, message, gkReq) {
        this.globalConf = globalConf;
        this.tbs = tbs;
        this.cks = cks;
        this.sts = sts;
        this.message = message;
        this.gkReq = gkReq;
        /** 表格数据 */
        this.data = [];
        /** 点击操作列按钮时发送的事件 */
        this.opera = new EventEmitter();
        // 分页
        /** 当前页码数 */
        this._pageIndex = 1;
        this.pageIndexChange = new EventEmitter();
        /** 当前每页条数 */
        this._pageSize = 10;
        this.pageSizeChange = new EventEmitter();
        /** 符合数据的总条数 */
        this.total = 0;
        /** 排序状态 */
        this.sortState = null;
        this._checks = [];
        this.checksChange = new EventEmitter();
        /* 表格状态 */
        this.loading = false; // 加载状态
    }
    get scroll() { return this.tbs.getScroll(); }
    /** 是否显示分页器 */
    get showPagination() {
        return this.tbs.showFactory('showPagination');
    }
    /** 是否开启多选功能 */
    get hasCheck() {
        return this.tbs.showFactory('hasCheck');
    }
    /** 是否开启快速跳转 */
    get hasQuickJumper() {
        return this.tbs.showFactory('quickJumper', false);
    }
    /** 是否开启每页条数控制器 */
    get showPageSizeChange() {
        return this.tbs.showFactory('pageSizeChanger', false);
    }
    /** 是否显示总条数 */
    get showTotal() {
        return this.tbs.showFactory('showTotal', false);
    }
    /** 开启固定列时，可滚动区域的宽度 */
    get scrollX() {
        return this.tbs.showFactory('scrollX', '100%');
    }
    get pageSizeOptions() {
        return this.tbs.showFactory('pageSizeOptions', undefined);
    }
    /** 单元格是否超出隐藏 */
    get ellipsis() {
        return this.tbs.showFactory('tdEllipsis', true);
    }
    get pageIndex() {
        return this._pageIndex;
    }
    set pageIndex(index) {
        if (index > 0 && this._pageIndex !== index) {
            this._pageIndex = index;
            this.pageIndexChange.emit(index);
        }
    }
    get pageSize() {
        return this._pageSize;
    }
    set pageSize(size) {
        if (size > 0 && this._pageSize !== size) {
            this._pageSize = size;
            this.pageSizeChange.emit(size);
        }
    }
    get sortParam() {
        let target = null;
        if (this.sortColumn && this.sortState) {
            let param;
            switch (this.sortState) {
                case 'ascend':
                    param = 'asc';
                    break;
                default:
                    param = 'desc';
                    break;
            }
            target = `${this.sortColumn}-${param}`;
        }
        return target;
    }
    /** 全选状态 */
    set checkAll(value) {
        if (value) {
            this.checks = [...this.data];
        }
        else {
            this.checks = [];
        }
    }
    /** 全选状态 */
    get checkAll() {
        return this.data.length !== 0 && this.data.length === this.checks.length;
    }
    get checks() {
        return this._checks;
    }
    set checks(list) {
        if (this._checks !== list) {
            this._checks = list;
            this.checksChange.emit(list);
        }
    }
    get indeterminate() {
        if (this.checks.length !== this.data.length && this.checks.length !== 0) {
            return true;
        }
        return false;
    }
    ngOnInit() {
        /** 向表格服务注入当前表格实例 */
        this.tbs.init(this);
        this.cks.init(this);
        this.sts.init(this);
        /** 向表格服务注入当前表格实例 */
        this.sts.sortInit();
        if (this.source) {
            this.getData();
        }
    }
    /** 请求数据 */
    getData(pageIndex = this.pageIndex, pageSize = this.pageSize, requestData) {
        let data = {};
        if (this.requestData) {
            data = this.requestData;
        }
        if (requestData) {
            data = Object.assign(Object.assign({}, data), requestData);
        }
        if (this.sortParam) {
            data = Object.assign(Object.assign({}, data), { pageSort: this.sortParam });
        }
        if (pageIndex !== this.pageIndex) {
            this.pageIndex = pageIndex;
        }
        if (pageSize !== this.pageSize) {
            this.pageSize = pageSize;
        }
        this.loading = true;
        if (!this.source) {
            return;
        }
        this.source(Object.assign({ pageIndex, pageSize }, data)).subscribe(({ list, pagination: { total } }) => {
            this.loading = false;
            this.data = list;
            this.total = total;
            this.checks = [];
        });
    }
    /** 判断单元格内部是什么类型的数据展示 */
    getUnitInfo(col, data, i) {
        if (col.type === 'operate') {
            return { mode: 'operate' };
        }
        if (col.render) {
            return { mode: 'render' };
        }
        if (typeof col.prop === 'function') {
            const result = col.prop(data, i);
            if (result instanceof GKTableColPoint) {
                return {
                    mode: 'point',
                    text: result.text,
                    type: result.type,
                };
            }
            if (result instanceof GKTableColImage) {
                const style = typeof result.size === 'number' ? {
                    'height.px': result.size, 'width.px': result.size,
                } : {
                    'height.px': result.size.height, 'width.px': result.size.width,
                };
                return {
                    mode: 'image',
                    url: result.url,
                    style,
                };
            }
            if (result instanceof GKTableColSwitch) {
                return {
                    mode: 'switch',
                    config: result.config,
                };
            }
            return {
                mode: 'format',
                text: result,
            };
        }
        return { mode: 'default' };
    }
    /** 点击操作列按钮 */
    doOpera(value, data, index) {
        this.opera.emit(new GKTableOperateEvent(value, data, index));
    }
    changeIndex(index) {
        this.pageIndex = index;
        this.getData();
    }
    changeSize(size) {
        this.pageIndex = 1;
        this.pageSize = size;
        this.getData();
    }
    /* 点击开关操作事件 */
    onSwitchChange(config, data, index) {
        if (config.api) {
            const apiData = {
                id: data.id,
                [config.prop]: data[config.prop],
            };
            this.gkReq.request(config.api, apiData).subscribe(({ code, message }) => {
                if (code === 0) {
                    this.message.success('操作成功！');
                }
                else {
                    this.message.warning(message);
                }
                this.getData();
                if (config.onSwitch) {
                    config.onSwitch(data, index);
                }
            });
            return;
        }
        else {
            if (config.onSwitch) {
                config.onSwitch(data, index);
            }
        }
    }
}
TableComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-table',
                template: "<nz-table #table class=\"gk-table-container\" [nzData]=\"data\" (nzPageIndexChange)=\"changeIndex($event)\"\n    (nzPageSizeChange)=\"changeSize($event)\" [nzPageIndex]=\"pageIndex\" [nzPageSize]=\"pageSize\" [nzLoading]=\"loading\"\n    [nzShowSizeChanger]=\"showPageSizeChange\" [nzTotal]=\"total\" [nzFrontPagination]=\"false\"\n    [nzShowQuickJumper]=\"hasQuickJumper\" [nzShowTotal]=\"totalTemplate\" [nzShowPagination]=\"showPagination\"\n    [nzScroll]='scroll' [nzPageSizeOptions]='pageSizeOptions' [nzTableLayout]='tbs.tableLayout()'>\n    <thead>\n        <tr>\n            <th *ngIf=\"hasCheck\" [(nzChecked)]=\"checkAll\" [nzIndeterminate]=\"indeterminate\" nzWidth=\"90px\"></th>\n            <ng-container *ngFor=\"let col of columns\">\n                <th *ngIf=\"!col.type || col.type === 'default'\" [nzShowSort]='!!col.sort'\n                    [nzSortDirections]=\"['ascend', 'descend', null]\" [nzSortOrder]='sts.getSortState(col)'\n                    (nzSortOrderChange)='sts.sortChange($event,col)' [nzWidth]=\"$any(col).width\"\n                    [nzLeft]=\"col.fixed === 'left'\" [nzRight]=\"col.fixed === 'right'\">{{ col.label }}\n                </th>\n\n                <th *ngIf=\"col.type === 'operate'\" [nzWidth]=\"$any(col).width\" [nzLeft]=\"col.fixed === 'left'\"\n                    [nzRight]=\"col.fixed === 'right'\">{{ col.label\n                    }}</th>\n            </ng-container>\n        </tr>\n    </thead>\n    <tbody>\n        <tr *ngFor=\"let data of table.data; let i = index\">\n            <td *ngIf=\"hasCheck\" [nzChecked]=\"cks.isCheck(data)\" [nzDisabled]=\"data.disabled\"\n                [nzShowCheckbox]=\"cks.showCheck(data,i)\" (nzCheckedChange)=\"cks.onItemChecked(data, $event)\"></td>\n            <ng-container *ngFor=\"let col of columns\">\n                <td *ngIf=\"getUnitInfo(col, data, i).mode === 'operate'\" [nzEllipsis]=\"ellipsis\"\n                    [nzLeft]=\"col.fixed === 'left'\" [nzRight]=\"col.fixed === 'right'\" class=\"opera-col\">\n                    <ng-container *ngFor=\"let item of tbs.btnFilter($any(col).btns, data, i) \">\n                        <gk-button [disabled]='item.disabled' *ngIf=\"item.filter\" (click)=\"doOpera(item.value, data, i)\"\n                            mode=\"text\" [type]=\"item.type || 'primary'\" [icon]=\"item.icon\" [class]=\"item.type\">\n                            <span>{{ item.label }}</span>\n                        </gk-button>\n                    </ng-container>\n                </td>\n                <td *ngIf=\"getUnitInfo(col, data, i).mode === 'render'\" [nzEllipsis]=\"ellipsis\"\n                    [nzLeft]=\"col.fixed === 'left'\" [nzRight]=\"col.fixed === 'right'\">\n                    <ng-container [ngTemplateOutlet]=\"$any(col).render\"\n                        [ngTemplateOutletContext]=\"{ data: data, rowIndex: i }\">\n                    </ng-container>\n                </td>\n                <td *ngIf=\"getUnitInfo(col, data, i).mode === 'point'\" [nzEllipsis]=\"ellipsis\"\n                    [nzLeft]=\"col.fixed === 'left'\" [nzRight]=\"col.fixed === 'right'\">\n                    <span class=\"state-point\" style=\"width: 8px; height: 8px;\" [class]=\"getUnitInfo(col, data, i).type\">\n                    </span>\n                    {{ getUnitInfo(col, data, i).text }}\n                </td>\n                <td *ngIf=\"getUnitInfo(col, data, i).mode === 'image'\" [nzEllipsis]=\"ellipsis\"\n                    [nzLeft]=\"col.fixed === 'left'\" [nzRight]=\"col.fixed === 'right'\"\n                    style=\"padding: 0; text-align: center;\">\n                    <img [src]=\"getUnitInfo(col, data, i).url\" [ngStyle]=\"getUnitInfo(col, data, i).style || null\" />\n                </td>\n                <td *ngIf=\"getUnitInfo(col, data, i).mode === 'switch'\" [nzEllipsis]=\"ellipsis\"\n                    [nzLeft]=\"col.fixed === 'left'\" [nzRight]=\"col.fixed === 'right'\">\n                    <nz-switch [ngModel]=\"getUnitInfo(col, data, i).config?.value\"\n                        [nzCheckedChildren]=\"getUnitInfo(col, data, i).config?.checkedText || null\"\n                        [nzUnCheckedChildren]=\"getUnitInfo(col, data, i).config?.unCheckedText || null\"\n                        [nzDisabled]=\"getUnitInfo(col, data, i).config?.disabled\"\n                        (click)=\"onSwitchChange(getUnitInfo(col, data, i).config, data, i)\" [nzControl]=\"true\">\n                    </nz-switch>\n                </td>\n                <td *ngIf=\"getUnitInfo(col, data, i).mode === 'format'\" [nzEllipsis]=\"ellipsis\"\n                    [nzLeft]=\"col.fixed === 'left'\" [nzRight]=\"col.fixed === 'right'\"\n                    [title]=\"ellipsis ? getUnitInfo(col, data, i).text : undefined\">\n                    {{ getUnitInfo(col, data, i).text }}\n                </td>\n                <td *ngIf=\"getUnitInfo(col, data, i).mode === 'default'\" [nzEllipsis]=\"ellipsis\"\n                    [nzLeft]=\"col.fixed === 'left'\" [nzRight]=\"col.fixed === 'right'\"\n                    [title]=\"ellipsis ? data[$any(col).prop] : undefined\">\n                    {{ data[$any(col).prop] }}\n                </td>\n            </ng-container>\n        </tr>\n    </tbody>\n</nz-table>\n\n<ng-template #totalTemplate let-total>\n    <ng-container *ngIf=\"showTotal\"> \u5171 {{ total }} \u6761 </ng-container>\n</ng-template>\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}.gk-table-container .ant-table,.gk-table-container .ant-table table{border-radius:0}.gk-table-container .ant-table .state-point,.gk-table-container .ant-table table .state-point{border-radius:50%;display:inline-block;margin:0 5px 3px 0;vertical-align:middle}.gk-table-container .ant-table .state-point.primary,.gk-table-container .ant-table table .state-point.primary{background-color:#3266fb}.gk-table-container .ant-table .state-point.success,.gk-table-container .ant-table table .state-point.success{background-color:#52c41a}.gk-table-container .ant-table .state-point.warning,.gk-table-container .ant-table table .state-point.warning{background-color:#faad14}.gk-table-container .ant-table .state-point.danger,.gk-table-container .ant-table table .state-point.danger{background-color:#ff4d4f}.gk-table-container .ant-table-container table>thead>tr:first-child th:first-child,.gk-table-container .ant-table-container table>thead>tr:first-child th:last-child{border-top-left-radius:0;border-top-right-radius:0}.gk-table-container .opera-col .ant-btn-link.warning{color:#faad14}.gk-table-container .opera-col .ant-btn-link.danger{color:#ff4d4f}"]
            },] }
];
TableComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [GK_TABLE_CONF,] }] },
    { type: TableService },
    { type: CheckService },
    { type: SortService },
    { type: NzMessageService },
    { type: GKRequestService }
];
TableComponent.propDecorators = {
    data: [{ type: Input }],
    columns: [{ type: Input }],
    source: [{ type: Input }],
    requestData: [{ type: Input }],
    conf: [{ type: Input }],
    opera: [{ type: Output }],
    pageIndex: [{ type: Input }],
    pageIndexChange: [{ type: Output }],
    pageSize: [{ type: Input }],
    pageSizeChange: [{ type: Output }],
    total: [{ type: Input }],
    checks: [{ type: Input }],
    checksChange: [{ type: Output }],
    loading: [{ type: Input }]
};

class GKDataService {
    constructor(http) {
        this.http = http;
    }
    /**
     * 将目标值进行压实操作，将目标对象当中属性值为null undefined ''(空字符串) 以及NaN的属性移除，并返回新的对象  （具备深层递归功能）
     * @param data 目标对象
     * @param otherExc 额外需要从属性中去除的值类型， 比如 空字符串：‘’ ， 0， 或者是其他自定义的值等
     */
    compaction(data, otherExc) {
        if (this.isEmpty(data) || typeof data !== 'object' || data instanceof Date) {
            return data;
        }
        if (Array.isArray(data)) {
            return data.map((item) => this.compaction(item, otherExc));
        }
        const target = {};
        for (const k in data) {
            const t = this.compaction(data[k], otherExc);
            const isEmpty = this.isEmpty(t, otherExc);
            if (!isEmpty) {
                target[k] = t;
            }
        }
        return target;
    }
    /**
     * 判断一个值是否为空值（无效值），默认设定无效值有 null undefined NaN以及 空字符串（‘‘）
     * @param data 需要被判断的值
     * @param exs 需要拓展的被认定为空置的数组， 比如 0
     */
    isEmpty(data, exs) {
        let target = false;
        if (typeof data === 'number' && isNaN(data)) {
            target = true;
        }
        if (data === null || data === undefined || data === '') {
            target = true;
        }
        if (exs) {
            exs.map(item => {
                if (data === item) {
                    target = true;
                }
            });
        }
        return target;
    }
    /**
     * 递归处理目标数据
     * @param data 需要被处理的数据
     * @param cb 回调函数
     */
    deepHandler(data, cb) {
        if (typeof data !== 'object' || data instanceof Date) {
            return cb(data);
        }
        if (Array.isArray(data)) {
            return data.map((item) => this.deepHandler(item, cb));
        }
        const target = {};
        for (const k in data) {
            target[k] = this.deepHandler(data[k], cb);
        }
        return target;
    }
    /**
     * 将参数当中Date类型的属性转换为时间戳
     * @param query 需要被处理的函数
     */
    dateToRequest(query) {
        return this.deepHandler(query, (item) => {
            if (item instanceof Date) {
                return item.getTime();
            }
            return item;
        });
    }
    /**
     * 判断某个值是否存在列表数组当中
     * @param tValue 目标值
     * @param options 对照数组
     */
    hasOptions(tValue, options) {
        return options.findIndex(({ value }) => tValue === value) > -1;
    }
    /**
     * 阿里云请求配置
     * @param config 阿里云配置
     * @param file 上传的文件
     * @param successCb 请求成功的回调函数
     * @param errorCb 请求失败的回调函数
     */
    ossUpload(config, file, successCb, errorCb) {
        this.http.get(config.ossServerUrl).subscribe({
            next: (resp) => {
                var _a;
                const { host, destFolder } = resp === null || resp === void 0 ? void 0 : resp.data;
                const { ossAccessKeyId, policy, signature, expire, callback } = (_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.accessObj;
                const headers = { enctype: 'multipart/form-data' };
                if (config === null || config === void 0 ? void 0 : config.ossPublic) {
                    headers['x-oss-object-acl'] = 'public-read';
                }
                const formData = new FormData();
                formData.append('name', file.name);
                formData.append('key', (destFolder || '') + '${filename}');
                formData.append('policy', policy);
                formData.append('expire', expire);
                formData.append('ossAccessKeyId', ossAccessKeyId);
                formData.append('success_action_status', '200');
                formData.append('callback', callback);
                formData.append('signature', signature);
                formData.append('file', file);
                this.http.post(host, formData, {
                    headers: new HttpHeaders(headers),
                    observe: 'events',
                    reportProgress: true,
                }).subscribe({
                    next: (event) => {
                        successCb(event);
                    },
                    error: (error) => {
                        errorCb ? errorCb(error) : undefined;
                    },
                });
            },
        });
    }
}
GKDataService.ɵprov = ɵɵdefineInjectable({ factory: function GKDataService_Factory() { return new GKDataService(ɵɵinject(HttpClient)); }, token: GKDataService, providedIn: "root" });
GKDataService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
GKDataService.ctorParameters = () => [
    { type: HttpClient }
];

class UpdateService {
    constructor() { }
    /**
     * 判断是否存在界面配置项，只在编辑和查看数据类型的操作类型上才需要做此判断，无需判断的操作类型直接返回true
     * @param operName 操作类型
     * @param operateConf 操作项配置值
     */
    hasControls(operName, operateConf) {
        if (operName === 'update') { //编辑功能需要编辑的界面配置
            if (!operateConf || !operateConf.updateControls) {
                return false;
            }
        }
        if (operName === 'update-bat') { // 批量编辑功能需要批量编辑的界面配置
            if (!operateConf || !operateConf.updateBatControls) {
                return false;
            }
        }
        if (operName === 'detail') {
            if (!operateConf || !operateConf.detailControls) {
                return false;
            }
        }
        if (operName === 'add') {
            if (!operateConf || !operateConf.addControls) {
                return false;
            }
        }
        return true;
    }
}
UpdateService.ɵprov = ɵɵdefineInjectable({ factory: function UpdateService_Factory() { return new UpdateService(); }, token: UpdateService, providedIn: "root" });
UpdateService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
UpdateService.ctorParameters = () => [];

/**
 * 按钮存在的各种状态，分别为普通， 默认，成功， 警告， 危险
 */
const GKBtnStatusValues = GKStatusValues;
function isGKBtnStatus(x) {
    return GKBtnStatusValues.includes(x);
}
/**
 * 按钮配置类
 */
class GKButton {
    constructor(x, value, type, icon) {
        this.label = '';
        this.mode = undefined;
        this.type = undefined;
        this.size = undefined;
        this.icon = undefined;
        this.disabled = false;
        this.loading = false;
        this.active = false;
        this.value = undefined;
        this.onClick = undefined;
        if (typeof x === 'object') {
            util.merge(this, x);
        }
        else {
            this.label = x;
            this.value = value;
            this.type = type;
            this.icon = icon;
        }
    }
}

class ListComponent {
    constructor(ds, gkReq, modal, message, nzIcon, us) {
        this.ds = ds;
        this.gkReq = gkReq;
        this.modal = modal;
        this.message = message;
        this.nzIcon = nzIcon;
        this.us = us;
        // 多选功能
        this._checks = [];
        this.fastQuery = {};
        /** 操作列被点击后执行的事件 */
        this.opera = new EventEmitter();
        this.operaBat = new EventEmitter();
        /** 是否展示新增弹框 */
        this.addVisible = false;
        /** 是否显示编辑弹框 */
        this.updateVisible = false;
        /** 批量编辑对话框展示 */
        this.updateBatVisible = false;
        /** 是否显示详情弹框 */
        this.detailVisible = false;
        this.detailModalBtns = [
            new GKButton('确认', 'ok', 'primary'),
        ];
        /** 当前正在编辑/展示的数据 */
        this.currentRecord = null;
        this.otherOperate = new EventEmitter();
        /** 点击查询按钮执行 */
        this.doSearch = () => this.tableInstance.getData(1);
        this.tableModal = {
            show: false,
            title: '',
            control: undefined,
            data: undefined,
            formGroup: undefined,
            onOk: undefined,
        };
        this.nzIcon.addIcon(PlusOutline);
    }
    /** 是否加载表格 */
    get hasTable() {
        if (!this.tableConf) {
            return false;
        }
        if (this.tableSource) {
            return true;
        }
        return false;
    }
    /** 表格参数-额外的查询参数 */
    get searchQuery() {
        let target = {};
        if (this.searchForm) {
            target = Object.assign(Object.assign({}, this.searchForm.value), this.fastQuery);
            /** 将空值属性从参数对象中去掉 */
            target = this.ds.compaction(target);
            /** 将值为Date类型的属性值转换为时间戳 */
            target = this.ds.dateToRequest(target);
        }
        return target;
    }
    /** 表格参数-表格列 */
    get columns() {
        const target = [...this.tableConf.columns];
        if (this.hasOperColumn) {
            if (!this.tableOperateColumn) {
                const targetList = [];
                if (this.hasDetail) {
                    targetList.push('detail');
                }
                if (this.hasUpdate) {
                    targetList.push('update');
                }
                if (this.hasRemove) {
                    targetList.push('remove');
                }
                if (this.tableConf && this.tableConf.otherOperates) {
                    targetList.push(...this.tableConf.otherOperates);
                }
                this.tableOperateColumn = new GKTableOperateColumn(targetList, this.tableConf.operateConf);
            }
            target.push(this.tableOperateColumn);
        }
        return target;
    }
    /** 是否存在操作列 */
    get hasOperColumn() {
        if (this.hasRemove || this.hasUpdate || this.hasDetail) {
            return true;
        }
        if (this.tableConf &&
            this.tableConf.otherOperates &&
            this.tableConf.otherOperates.length > 0) {
            return true;
        }
        return false;
    }
    /** 表格组件配置项 */
    get listTableConf() {
        const target = Object.assign({}, this.tableConf.conf);
        target.hasCheck = this.hasCheck();
        return target;
    }
    get checks() {
        return this._checks;
    }
    set checks(value) {
        this._checks = value;
    }
    get otherBats() {
        let target = [];
        if (this.operateConf && this.operateConf.otherBats && this.operateConf.otherBats.length > 0) {
            target = this.operateConf.otherBats;
        }
        return target;
    }
    /** 是否渲染搜索模块 */
    get hasSearch() {
        if (!this.searchConf) {
            return false;
        }
        if (!this.searchForm) {
            return false;
        }
        if (this.searchConf.hasSearch === undefined) {
            return true;
        }
        return this.searchConf.hasSearch;
    }
    get fastValus() {
        const target = [];
        for (const prop in this.fastQuery) {
            const value = this.fastQuery[prop];
            target.push(`${value}<=${prop}`);
        }
        return target;
    }
    get hasFastSearch() {
        if (!this.searchConf || !this.searchConf.fastBtns) {
            return false;
        }
        if (Array.isArray(this.searchConf.fastBtns) && this.searchConf.fastBtns.length < 1) {
            return false;
        }
        return true;
    }
    get fastSearchBtns() {
        if (this.hasFastSearch) {
            const { fastBtns } = this.searchConf;
            if (Array.isArray(fastBtns)) {
                return fastBtns.map(({ value, prop, label }) => ({ label, value: `${value}<=${prop}` }));
            }
            return [{ label: fastBtns === null || fastBtns === void 0 ? void 0 : fastBtns.label, value: `${fastBtns === null || fastBtns === void 0 ? void 0 : fastBtns.value}<=${fastBtns === null || fastBtns === void 0 ? void 0 : fastBtns.prop}` }];
        }
        return [];
    }
    /** 列表请求接口 */
    get tableSource() {
        return this.sourceFactory('list', ({ data }) => data);
    }
    /** 删除请求接口 */
    get removeSource() {
        return this.sourceFactory('remove');
    }
    /** 添加请求接口 */
    get addSource() {
        return this.sourceFactory('add');
    }
    /** 更新请求接口 */
    get updateSource() {
        return this.sourceFactory('update');
    }
    /** 详情请求接口 */
    get detailSource() {
        return this.sourceFactory('detail');
    }
    /** 是否存在删除功能 */
    get hasRemove() {
        return this.hasOper('remove');
    }
    /** 是否展示编辑按钮 */
    get hasUpdate() {
        return this.hasOper('update');
    }
    /** 是否展示详情/查看按钮 */
    get hasDetail() {
        return this.hasOper('detail');
    }
    /** 是否展示新增按钮 */
    get hasAdd() {
        return this.hasOper('add');
    }
    /** 新增按钮文字 */
    get addBtnText() {
        var _a;
        return ((_a = this.operateConf) === null || _a === void 0 ? void 0 : _a.addBtnText) || '新增';
    }
    /** 新增弹框标题文字 */
    get addModelTitle() {
        var _a;
        return ((_a = this.operateConf) === null || _a === void 0 ? void 0 : _a.addModelTitle) || this.addBtnText;
    }
    /** 是否渲染批量删除按钮 */
    get hasRemoveBat() {
        return this.hasOper('remove-bat');
    }
    /** 是否渲染批量编辑按钮 */
    get hasUpdateBat() {
        return this.hasOper('update-bat');
    }
    /** 批量功能是否可用 */
    get showBat() {
        return this.checks.length > 0;
    }
    /** 批量编辑表单控件配置 */
    get addControls() {
        return this.operateConf.addControls;
    }
    /** 批量编辑的表单是否渲染 */
    get hasAddForm() {
        if (!this.operateConf) {
            return false;
        }
        if (!this.addForm) {
            return false;
        }
        return true;
    }
    /** 新增时提交的数据 */
    get addQuery() {
        return this.ds.compaction(this.addForm.value);
    }
    /** 编辑功能所需配置项 */
    get updateControls() {
        return this.operateConf.updateControls;
    }
    /** 是否渲染编辑功能表单组件 */
    get hasUpdateForm() {
        if (!this.operateConf) {
            return false;
        }
        if (!this.updateForm) {
            return false;
        }
        if (!this.currentRecord) {
            return false;
        }
        return true;
    }
    /** 点击编辑时应当发送的参数 */
    get updateQuery() {
        return this.ds.compaction(Object.assign(Object.assign({}, this.currentRecord), this.updateForm.value));
    }
    /** 批量编辑表单控件配置 */
    get updateBatControls() {
        return this.operateConf.updateBatControls;
    }
    /** 批量编辑的表单是否渲染 */
    get hasUpdateBatForm() {
        if (!this.operateConf) {
            return false;
        }
        if (!this.updateBatForm) {
            return false;
        }
        return true;
    }
    /** 批量编辑时提交的数据 */
    get updateBatQuery() {
        const id = this.checks.map(({ id }) => id);
        return this.ds.compaction(Object.assign({ id }, this.updateBatForm.value));
    }
    /** 详情渲染配置项 */
    get detailControls() {
        return this.operateConf.detailControls;
    }
    get hasDetailInfo() {
        if (!this.operateConf) {
            return false;
        }
        if (!this.currentRecord) {
            return false;
        }
        return true;
    }
    /** 初始化search模块 */
    initSearch() {
        if (this.searchConf && this.searchConf.layouts) {
            this.searchForm = this.searchConf.layouts.getFormGroup();
        }
    }
    /**
     * source工厂函数，通过传入需要生成source的类型，返回对应的source函数
     * @param sourceKey 需要生成source的类型
     * @param pipe source的返回值上套接的pipe函数
     */
    sourceFactory(sourceKey, pipe) {
        const apiKey = sourceKey.toUpperCase();
        let targetSource = null;
        if (this.source && this.source[sourceKey]) {
            targetSource = this.source[sourceKey];
            if (pipe) {
                targetSource = (query) => this.source[sourceKey](query).pipe(map(pipe));
            }
        }
        else if (this.api && this.api[apiKey]) {
            targetSource = (query) => this.gkReq.request(this.api[apiKey], query);
            if (pipe) {
                targetSource = (query) => this.gkReq.request(this.api[apiKey], query).pipe(map(pipe));
            }
        }
        return targetSource;
    }
    /**
     * 判断是否存在对应的操作功能
     * @param operName 需要判断的功能
     */
    hasOper(operName) {
        let warnTxt;
        switch (operName) {
            case 'remove':
                warnTxt = '删除';
                break;
            case 'remove-bat':
                warnTxt = '批量删除';
                break;
            case 'update':
                warnTxt = '编辑';
                break;
            case 'update-bat':
                warnTxt = '批量编辑';
                break;
            case 'detail':
                warnTxt = '查看详情';
                break;
            case 'add':
                warnTxt = '添加';
                break;
        }
        const sourceName = operName.split('-')[0];
        const hasControls = this.us.hasControls(operName, this.operateConf);
        if (this.operateConf && this.operateConf[operName] !== undefined) {
            if (this[`${sourceName}Source`] === null) {
                console.warn(`警告:你开启了表格${warnTxt}功能，但未提供相关请求资源！`);
            }
            if (!hasControls) {
                console.warn(`警告:你开启了表格${warnTxt}功能，但未提供相关控件配置！`);
            }
            return this.operateConf[operName];
        }
        else if (this[`${sourceName}Source`] !== null) {
            return hasControls;
        }
        return false;
    }
    /**
     * 判断是否存在多选列
     */
    hasCheck() {
        if (this.hasRemoveBat || this.hasUpdateBat) {
            return true;
        }
        if (this.operateConf &&
            this.operateConf.otherBats &&
            this.operateConf.otherBats.length > 0) {
            return true;
        }
        return false;
    }
    ngOnInit() {
        this.initSearch();
        this.initUpdate();
        this.initUpdateBat();
        this.initAdd();
    }
    /**
     * 自定义批量操作
     * @param value 操作类型
     */
    operateBatHandler(buttonConfig) {
        if (!buttonConfig.control) {
            this.operaBat.emit({ value: buttonConfig.value, datas: [...this.checks] });
        }
        else {
            this.tableModal.show = true;
            this.tableModal.title = buttonConfig.title || buttonConfig.label;
            this.tableModal.control = buttonConfig.control;
            this.tableModal.data = buttonConfig.data;
            this.tableModal.formGroup = buttonConfig.control.getFormGroup();
            this.tableModal.onOk = () => {
                this.gkReq.request(buttonConfig.api, Object.assign({ id: this.checks.map(({ id }) => id) }, this.tableModal.formGroup.value)).subscribe(({ code, message }) => {
                    if (code === 0) {
                        this.message.success('操作成功！');
                        this.tableModal.show = false;
                    }
                    else {
                        this.message.warning(message);
                    }
                });
            };
        }
    }
    /**
     * 删除数据/批量删除数据
     * @param idArg 不传入参数时，则删除所有选中数据，否则删除指定id的数据
     */
    removeRecord(id) {
        let modalTitle, modalContent;
        if (id === undefined) {
            modalTitle = '批量删除';
            modalContent = '确定要批量删除这些数据吗？';
            id = this.checks.map(({ id }) => id);
        }
        else {
            modalTitle = '删除';
            modalContent = '确定要删除这条数据吗？';
        }
        this.modal.confirm({
            nzTitle: `<i>${modalTitle}</i>`,
            nzContent: `<b>${modalContent}</b>`,
            nzOnOk: () => {
                if (this.removeSource) {
                    const params = { id };
                    this.removeSource(params).subscribe(({ code }) => {
                        if (code === 0) {
                            this.message.success('操作成功！');
                            this.update();
                        }
                    });
                }
            },
            nzOkText: '确认',
            nzCancelText: '取消',
        });
    }
    /** 初始化编辑功能 */
    initUpdate() {
        if (this.operateConf && this.operateConf.updateControls && this.updateSource) {
            this.updateForm = this.operateConf.updateControls.getFormGroup();
        }
    }
    /** 重置编辑数据 */
    updateReset() {
        this.currentRecord = null;
        this.updateForm && this.updateForm.reset();
    }
    /** 点击编辑按钮 */
    updateRecord(data) {
        if (this.us.hasControls('update', this.operateConf)) {
            this.updateVisible = true;
            this.currentRecord = Object.assign({}, data);
        }
    }
    /** 进行更新数据操作 */
    updateHandler() {
        if (this.updateSource) {
            for (const i in this.updateForm.controls) {
                this.updateForm.controls[i].markAsDirty();
                this.updateForm.controls[i].updateValueAndValidity();
            }
            if (this.updateForm.valid) {
                this.updateSource(this.updateQuery).subscribe(({ code, message }) => {
                    if (code === 0) {
                        this.message.success('操作成功！');
                        this.update();
                        this.updateVisible = false;
                    }
                    else {
                        this.message.warning(message);
                    }
                });
            }
        }
    }
    /** 初始化批量编辑功能 */
    initUpdateBat() {
        if (this.operateConf && this.operateConf.updateBatControls && this.updateSource) {
            this.updateBatForm = this.operateConf.updateBatControls.getFormGroup();
        }
    }
    /** 点击批量编辑按钮 */
    updateBatRecord() {
        if (this.us.hasControls('update-bat', this.operateConf)) {
            this.updateBatVisible = true;
        }
    }
    /** 重置批量编辑数据 */
    updateBatRest() {
        this.updateBatForm && this.updateBatForm.reset();
    }
    /** 进行批量更新数据操作 */
    updateBatHandler() {
        if (this.updateSource) {
            for (const i in this.updateBatForm.controls) {
                this.updateBatForm.controls[i].markAsDirty();
                this.updateBatForm.controls[i].updateValueAndValidity();
            }
            if (this.updateBatForm.valid) {
                this.updateSource(this.updateBatQuery).subscribe(({ code, message }) => {
                    if (code === 0) {
                        this.message.success('操作成功！');
                        this.update();
                        this.updateBatVisible = false;
                    }
                    else {
                        this.message.warning(message);
                    }
                });
            }
        }
    }
    /** 初始化新增功能 */
    initAdd() {
        if (this.operateConf && this.operateConf.addControls && this.addSource) {
            this.addForm = this.operateConf.addControls.getFormGroup();
        }
    }
    /** 点击新增按钮 */
    addRecord() {
        if (this.us.hasControls('add', this.operateConf)) {
            this.addVisible = true;
        }
    }
    /** 重置新增数据 */
    addReset() {
        this.addForm && this.addForm.reset();
    }
    /** 进行批量更新数据操作 */
    addHandler() {
        if (this.addSource) {
            for (const i in this.addForm.controls) {
                this.addForm.controls[i].markAsDirty();
                this.addForm.controls[i].updateValueAndValidity();
            }
            if (this.addForm.valid) {
                this.addSource(this.addQuery).subscribe(({ code, message }) => {
                    if (code === 0) {
                        this.message.success('操作成功！');
                        this.update();
                        this.addVisible = false;
                    }
                    else {
                        this.message.warning(message);
                    }
                });
            }
        }
    }
    /** 点击详情按钮 */
    detailRecorder(data) {
        if (this.us.hasControls('detail', this.operateConf)) {
            if (this.detailSource) {
                this.detailSource({ id: data.id }).subscribe(({ code, data, message }) => {
                    if (code === 0) {
                        this.detailVisible = true;
                        this.currentRecord = Object.assign({}, data);
                    }
                    else {
                        this.message.warning(message);
                    }
                });
            }
            else {
                this.detailVisible = true;
                this.currentRecord = Object.assign({}, data);
            }
        }
    }
    detailReset() {
        this.currentRecord = null;
    }
    /** 操作按钮列处理函数 */
    operateHandler(operateType) {
        const { value, data, } = operateType;
        switch (value) {
            case 'remove':
                this.removeRecord(data.id);
                break;
            case 'update':
                this.updateRecord(data);
                break;
            case 'detail':
                this.detailRecorder(data);
                break;
            default:
                break;
        }
        this.opera.emit(operateType);
    }
    detailBtnHandler(event) {
        switch (event) {
            case 'ok':
                this.detailVisible = false;
                break;
            default:
                break;
        }
    }
    update() {
        this.tableInstance.getData();
    }
    fastHandler(event) {
        const [value, prop] = event.split('<=');
        const target = this.fastQuery[prop];
        const newQuery = {};
        for (const k in this.fastQuery) {
            const origin = this.fastQuery[k];
            if (k !== prop) {
                newQuery[k] = origin;
            }
        }
        if (target === undefined || target !== value) {
            newQuery[prop] = value;
        }
        this.fastQuery = newQuery;
        setTimeout(() => {
            this.tableInstance.getData(1);
        }, 0);
    }
}
ListComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-list',
                template: "<gk-panel *ngIf='hasSearch' [title]='searchConf?.title'>\n    <gk-search (searchEvent)='doSearch()' [searchs]='searchConf?.layouts'>\n    </gk-search>\n</gk-panel>\n<div class=\"gk-m-t\">\n    <gk-panel *ngIf='hasTable' [title]='tableConf?.title' [action]='fastValus' [leftBtns]='fastSearchBtns'\n        (btnsEvent)=\"fastHandler($event)\">\n        <div id='title-right' class=\"gk-operate-box\">\n            <gk-button *ngIf='hasAdd' (click)='addRecord()' type='primary'>\n                <gk-icon type=\"plus\"></gk-icon>\n                <span>{{ addBtnText }}</span>\n            </gk-button>\n            <gk-button *ngIf='hasUpdateBat && showBat' (click)=\"updateBatRecord()\">\u6279\u91CF\u7F16\u8F91</gk-button>\n            <gk-button *ngIf='hasRemoveBat && showBat' (click)='removeRecord()'>\u6279\u91CF\u5220\u9664</gk-button>\n            <ng-container *ngFor='let batItem of otherBats'>\n                <gk-button *ngIf='showBat' (click)='operateBatHandler(batItem)'>{{batItem.label}}</gk-button>\n            </ng-container>\n            <ng-container *ngIf='operateConf && operateConf.otherRightBtns'>\n                <gk-button *ngFor='let btn of operateConf.otherRightBtns' [type]=\"btn.type\" [icon]='btn.icon'\n                    (click)=\"otherOperate.emit(btn.value)\">{{btn.label}}</gk-button>\n            </ng-container>\n        </div>\n        <div id='title-left'>\n            <ng-container *ngIf='operateConf && operateConf.otherLeftBtns'>\n                <gk-button *ngFor='let btn of operateConf.otherLeftBtns' [type]=\"btn.type\" [icon]='btn.icon'\n                    (click)=\"otherOperate.emit(btn.value)\">{{btn.label}}</gk-button>\n            </ng-container>\n        </div>\n        <gk-table #table [source]='tableSource' [columns]='columns' (opera)='operateHandler($event)' [(checks)]='checks'\n            [conf]='listTableConf' [requestData]='searchQuery'></gk-table>\n    </gk-panel>\n</div>\n<gk-modal [(isVisible)]='updateVisible' titleText='\u7F16\u8F91' (afterClose)='updateReset()' (ok)='updateHandler()'>\n    <ng-container *ngIf='hasUpdateForm'>\n        <gk-form [data]=\"currentRecord\" [controls]='updateControls'></gk-form>\n    </ng-container>\n</gk-modal>\n<gk-modal [(isVisible)]='updateBatVisible' titleText='\u6279\u91CF\u7F16\u8F91' (afterClose)='updateReset()' (ok)='updateBatHandler()'>\n    <ng-container *ngIf='hasUpdateBatForm'>\n        <gk-form [controls]='updateBatControls'></gk-form>\n    </ng-container>\n</gk-modal>\n<gk-modal [(isVisible)]='addVisible' [titleText]='addModelTitle' (afterClose)='addReset()' (ok)='addHandler()'>\n    <ng-container *ngIf='hasAddForm'>\n        <gk-form [controls]='addControls'></gk-form>\n    </ng-container>\n</gk-modal>\n<gk-modal [(isVisible)]='detailVisible' titleText='\u8BE6\u60C5' (afterClose)='detailReset()'\n    (btnAction)='detailBtnHandler($event)' [btns]='detailModalBtns'>\n    <ng-container *ngIf='hasDetailInfo'>\n        <gk-info [data]='currentRecord' [structure]='detailControls'></gk-info>\n    </ng-container>\n</gk-modal>\n\n<gk-modal [(isVisible)]=\"tableModal.show\" [titleText]=\"tableModal.title\" (ok)='tableModal.onOk && tableModal.onOk()'>\n    <ng-container *ngIf=\"tableModal.show\">\n        <gk-io [control]=\"tableModal.control\"></gk-io>\n    </ng-container>\n</gk-modal>\n",
                encapsulation: ViewEncapsulation.None,
                styles: [""]
            },] }
];
ListComponent.ctorParameters = () => [
    { type: GKDataService },
    { type: GKRequestService },
    { type: NzModalService },
    { type: NzMessageService },
    { type: NzIconService },
    { type: UpdateService }
];
ListComponent.propDecorators = {
    tableInstance: [{ type: ViewChild, args: ['table',] }],
    tableConf: [{ type: Input }],
    searchConf: [{ type: Input }],
    api: [{ type: Input }],
    source: [{ type: Input }],
    operateConf: [{ type: Input }],
    opera: [{ type: Output }],
    operaBat: [{ type: Output }],
    otherOperate: [{ type: Output }]
};

class ButtonComponent {
    constructor() {
        this.valueClick = new EventEmitter();
    }
    get props() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        let buttonProps = { label: '' };
        if (this.button instanceof GKButton) {
            buttonProps = this.button;
        }
        else {
            buttonProps = new GKButton(this.button);
        }
        return {
            label: (_a = this.label) !== null && _a !== void 0 ? _a : buttonProps.label,
            mode: ((_b = this.mode) !== null && _b !== void 0 ? _b : buttonProps.mode) || 'fill',
            type: ((_c = this.type) !== null && _c !== void 0 ? _c : buttonProps.type) || 'default',
            icon: (_d = this.icon) !== null && _d !== void 0 ? _d : buttonProps.icon,
            size: (_e = this.size) !== null && _e !== void 0 ? _e : buttonProps.size,
            disabled: (_f = this.disabled) !== null && _f !== void 0 ? _f : buttonProps.disabled,
            loading: (_g = this.loading) !== null && _g !== void 0 ? _g : buttonProps.loading,
            active: (_h = this.active) !== null && _h !== void 0 ? _h : buttonProps.active,
            value: (_j = this.value) !== null && _j !== void 0 ? _j : buttonProps.value,
            onClick: (_k = this.onClick) !== null && _k !== void 0 ? _k : buttonProps.onClick,
        };
    }
    get nzType() {
        if (this.props.mode === 'fill' && this.props.type === 'default') {
            return 'default';
        }
        return {
            fill: 'primary',
            outline: 'default',
            dashed: 'dashed',
            text: 'text',
        }[this.props.mode];
    }
    get isLoadingClass() {
        return this.props.loading;
    }
    get isActiveClass() {
        return this.props.mode === 'fill' &&
            this.props.type === 'default' &&
            this.props.active;
    }
    handlerClick() {
        if (this.props.onClick) {
            this.props.onClick();
        }
        if (this.props.value !== undefined) {
            this.valueClick.emit(this.props.value);
        }
    }
    ngOnInit() {
    }
}
ButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-button',
                template: "<button nz-button [nzType]=\"$any(nzType)\" [nzSize]=\"props.size\" [nzLoading]=\"props.loading\" [disabled]=\"props.disabled\"\n    [nzDanger]=\"props.type === 'danger'\" class=\"gk-button-container\" [class.gk-button-disable]=\"props.disabled\"\n    [ngClass]=\"['gk-button-mode-' + props.mode, 'gk-button-status-' + props.type ]\" (click)=\"handlerClick()\">\n    <gk-icon [type]=\"props.icon\" style=\"margin-right: 3px;\"></gk-icon>\n    <span *ngIf=\"props.label\">{{ props.label }}</span>\n    <ng-content *ngIf=\"!props.label\"></ng-content>\n</button>\n",
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}:host{display:inline-block}:host.is-loading{pointer-events:none}:host.is-active ::ng-deep .ant-btn{border-color:#3266fb;color:#3266fb}.gk-button-container ::ng-deep .anticon-loading{float:right;margin:4px 0 4px 6px}.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-primary{background:#3266fb;border-color:#3266fb}.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-primary:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-primary:hover{background:#658cfc;border-color:#658cfc}.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-primary:active{background:#4c73e1;border-color:#4c73e1}.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-success{background:#52c41a;border-color:#52c41a}.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-success:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-success:hover{background:#7dd353;border-color:#7dd353}.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-success:active{background:#5ba836;border-color:#5ba836}.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-warning{background:#faad14;border-color:#faad14}.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-warning:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-warning:hover{background:#fbc24f;border-color:#fbc24f}.gk-button-container:not(.gk-button-disable).gk-button-mode-fill.gk-button-status-warning:active{background:#dca332;border-color:#dca332}.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-primary,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-primary,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-primary{border-color:#3266fb;color:#3266fb}.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-primary:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-primary:hover,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-primary:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-primary:hover,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-primary:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-primary:hover{border-color:#658cfc;color:#658cfc}.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-primary:active,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-primary:active,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-primary:active{border-color:#4c73e1;color:#4c73e1}.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-success,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-success,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-success{border-color:#52c41a;color:#52c41a}.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-success:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-success:hover,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-success:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-success:hover,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-success:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-success:hover{border-color:#5ba836;color:#7dd353}.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-success:active,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-success:active,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-success:active{border-color:#5ba836;color:#5ba836}.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-warning,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-warning,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-warning{border-color:#faad14;color:#faad14}.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-warning:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-warning:hover,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-warning:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-warning:hover,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-warning:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-warning:hover{border-color:#dca332;color:#fbc24f}.gk-button-container:not(.gk-button-disable).gk-button-mode-dashed.gk-button-status-warning:active,.gk-button-container:not(.gk-button-disable).gk-button-mode-outline.gk-button-status-warning:active,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-warning:active{border-color:#dca332;color:#dca332}.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-primary,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-primary:active,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-primary:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-primary:hover,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-success,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-success:active,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-success:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-success:hover,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-warning,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-warning:active,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-warning:focus,.gk-button-container:not(.gk-button-disable).gk-button-mode-text.gk-button-status-warning:hover{border-color:transparent}"]
            },] }
];
ButtonComponent.ctorParameters = () => [];
ButtonComponent.propDecorators = {
    label: [{ type: Input }],
    mode: [{ type: Input }],
    type: [{ type: Input }],
    icon: [{ type: Input }],
    size: [{ type: Input }],
    disabled: [{ type: Input }],
    loading: [{ type: Input }],
    active: [{ type: Input }],
    value: [{ type: Input }],
    onClick: [{ type: Input }],
    button: [{ type: Input }],
    isLoadingClass: [{ type: HostBinding, args: ['class.is-loading',] }],
    isActiveClass: [{ type: HostBinding, args: ['class.is-active',] }],
    valueClick: [{ type: Output }]
};

class GKButtonModule {
}
GKButtonModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ButtonComponent,
                ],
                imports: [
                    CommonModule,
                    NzButtonModule,
                    GKIconModule,
                ],
                exports: [
                    ButtonComponent,
                ],
            },] }
];

class GKModalService {
    constructor() {
        this.center = false;
    }
}
GKModalService.ɵprov = ɵɵdefineInjectable({ factory: function GKModalService_Factory() { return new GKModalService(); }, token: GKModalService, providedIn: "root" });
GKModalService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
GKModalService.ctorParameters = () => [];

class ModalComponent {
    constructor(modalService) {
        this.modalService = modalService;
        this._isVisible = true;
        this.isVisibleChange = new EventEmitter();
        this.closable = true;
        this.cancel = new EventEmitter();
        this.ok = new EventEmitter();
        this.afterClose = new EventEmitter();
        this.size = 'default';
        this.conf = {};
        this.btnAction = new EventEmitter();
        this.handleCancel = () => {
            this.isVisible = false;
            this.cancel.emit();
        };
        this.handleOk = () => {
            this.ok.emit();
        };
        this.showBtns = [];
    }
    get isVisible() { return this._isVisible; }
    set isVisible(value) {
        if (this._isVisible !== value) {
            this._isVisible = value;
            this.isVisibleChange.emit(value);
        }
    }
    get modalWidth() {
        if (this.size === 'small') {
            return 480;
        }
        if (typeof this.size === 'number') {
            return this.size;
        }
        return 716;
    }
    createShowBtns() {
        if (this.btns) {
            this.showBtns = util.array(this.btns).map((btn) => btn instanceof GKButton ? btn : new GKButton(btn));
        }
        else {
            this.showBtns = [
                new GKButton({
                    label: this.conf.cancelText || '取消',
                    type: this.conf.cancelType || 'default',
                    onClick: this.handleCancel,
                }),
                new GKButton({
                    label: this.conf.okText || '确认',
                    type: this.conf.okType || 'primary',
                    onClick: this.handleOk,
                }),
            ];
        }
    }
    ngOnInit() {
        this.createShowBtns();
    }
    ngOnChanges(changes) {
        if (changes.btns && !changes.btns.firstChange) {
            this.createShowBtns();
        }
    }
}
ModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-modal',
                template: "<nz-modal [(nzVisible)]=\"isVisible\" [nzTitle]=\"titleText\" [nzWidth]=\"modalWidth\" [nzClosable]=\"closable\"\n    [nzCentered]=\"modalService.center\" (nzOnCancel)=\"handleCancel()\" (nzOnOk)=\"handleOk()\"\n    (nzAfterClose)=\"afterClose.emit()\" class=\"gk-modal-container\" [nzMaskClosable]=\"false\" [nzKeyboard]=\"false\"\n    [nzAutofocus]=\"null\">\n    <ng-container *nzModalContent>\n        <ng-content></ng-content>\n    </ng-container>\n    <div *nzModalFooter class=\"gk-modal-bottom\">\n        <div #modalFooterSlot>\n            <ng-content select=\"#modal-footer\"></ng-content>\n        </div>\n        <ng-container *ngIf=\"modalFooterSlot.childNodes.length === 0\">\n            <ng-container *ngFor=\"let btn of showBtns\">\n                <gk-button [button]=\"btn\" (valueClick)=\"btnAction.emit($event)\" class=\"gk-btn\"></gk-button>\n            </ng-container>\n        </ng-container>\n    </div>\n</nz-modal>\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}.ant-modal-footer{border-top:0;padding:8px 24px 32px}.ant-modal-body{padding:16px 24px 0}.gk-modal-bottom .gk-btn{margin-left:8px}.gk-modal-bottom .gk-btn:first-child{margin-left:0}"]
            },] }
];
ModalComponent.ctorParameters = () => [
    { type: GKModalService }
];
ModalComponent.propDecorators = {
    isVisible: [{ type: Input }],
    isVisibleChange: [{ type: Output }],
    closable: [{ type: Input }],
    cancel: [{ type: Output }],
    ok: [{ type: Output }],
    afterClose: [{ type: Output }],
    size: [{ type: Input }],
    titleText: [{ type: Input }],
    conf: [{ type: Input }],
    btns: [{ type: Input }],
    btnAction: [{ type: Output }]
};

class GKModalModule {
}
GKModalModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ModalComponent,
                ],
                imports: [
                    CommonModule,
                    NzModalModule,
                    GKButtonModule,
                ],
                exports: [
                    ModalComponent,
                ],
            },] }
];

class GKTabs {
    constructor(list) {
        this.list = list;
        this.action = '';
    }
}

class TabComponent {
    constructor() {
        this.show = false;
    }
    ngOnInit() {
    }
}
TabComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-tab',
                template: "<div [ngStyle]=\"{ display: show ? 'block' : 'none' }\">\n    <ng-content></ng-content>\n</div>\n",
                styles: [""]
            },] }
];
TabComponent.ctorParameters = () => [];
TabComponent.propDecorators = {
    value: [{ type: Input }]
};

class PanelComponent {
    constructor() {
        this.tabs = new GKTabs([]);
        this.tabChange = new EventEmitter();
        this.leftButtons = [];
        this.rightButtons = [];
        this.btnsEvent = new EventEmitter();
    }
    get isShowTitleBar() {
        var _a, _b, _c;
        return !!this.title || ((_a = this.tabs.list) === null || _a === void 0 ? void 0 : _a.length) > 0 || ((_b = this.leftBtns) === null || _b === void 0 ? void 0 : _b.length) > 0 || ((_c = this.rightBtns) === null || _c === void 0 ? void 0 : _c.length) > 0;
    }
    setTabsStatus() {
        for (const tab of this.tabComponentList) {
            tab.show = this.tabs.action === tab.value;
        }
    }
    ngAfterContentInit() {
        if (this.tabs.list.length > 0 && this.tabs.list.every((item) => item.value !== this.tabs.action)) {
            this.tabs.action = this.tabs.list[0].value;
            this.tabChange.emit(this.tabs.action);
        }
        this.setTabsStatus();
    }
    onTabClick(tab) {
        if (this.tabs.action !== tab.value) {
            this.tabs.action = tab.value;
            this.tabChange.emit(this.tabs.action);
            this.setTabsStatus();
        }
    }
    createLeftButtons() {
        this.leftButtons = (this.leftBtns || []).map((btn) => btn instanceof GKButton ? btn : new GKButton(btn));
    }
    createRightButtons() {
        this.rightButtons = (this.rightBtns || []).map((btn) => btn instanceof GKButton ? btn : new GKButton(btn));
    }
    isActive(value) {
        return Array.isArray(this.action) ? this.action.includes(value) : value === this.action;
    }
    ngOnInit() {
        this.createLeftButtons();
        this.createRightButtons();
    }
    ngOnChanges(changes) {
        if (changes.leftBtns && !changes.leftBtns.firstChange) {
            this.createLeftButtons();
        }
        if (changes.rightBtns && !changes.rightBtns.firstChange) {
            this.createRightButtons();
        }
    }
}
PanelComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-panel',
                template: "<div class=\"gk-panel-container\">\n    <div *ngIf=\"isShowTitleBar\" class=\"gk-panel-title gk-clr\">\n        <h3 *ngIf=\"title\" class=\"gk-title gk-flt\">{{ title }}</h3>\n\n        <div *ngIf=\"tabs.list.length > 0\" class=\"gk-panel-tabs-wp gk-flt\" [ngClass]=\"{ 'title-none': !title }\">\n            <span *ngFor=\"let tab of tabs.list\" class=\"gk-tab-item\" [class]=\"{ action: tab.value === tabs.action }\"\n                (click)=\"onTabClick(tab)\">{{ tab.label }}</span>\n        </div>\n\n        <div class=\"gk-panel-title-left-bntns gk-flt\">\n            <ng-container *ngFor=\"let btn of leftButtons\">\n                <gk-button [button]=\"btn\" [active]=\"isActive(btn.value)\" (valueClick)=\"btnsEvent.emit(btn)\"></gk-button>\n            </ng-container>\n\n            <ng-content select=\"#title-left\"></ng-content>\n        </div>\n\n        <div class=\"gk-panel-title-right-bntns gk-frt\">\n            <ng-content select=\"#title-right\"></ng-content>\n\n            <ng-container *ngFor=\"let btn of rightButtons\">\n                <gk-button [button]=\"btn\" [active]=\"isActive(btn.value)\" (valueClick)=\"btnsEvent.emit(btn)\"></gk-button>\n            </ng-container>\n        </div>\n    </div>\n\n    <div class=\"gk-panel-content-container\">\n        <ng-content></ng-content>\n    </div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}.gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}.gk-panel-container{background-color:#fff;border-radius:8px}.gk-panel-title{border-bottom:1px solid #d9d9d9;padding:14px 16px}.gk-panel-title .gk-title{height:32px;line-height:34px;margin:0 8px}.gk-panel-title .gk-panel-tabs-wp{display:inline-block;height:46px;margin:0 12px -14px}.gk-panel-title .gk-panel-tabs-wp.title-none{margin-left:-8px}.gk-panel-title .gk-panel-tabs-wp .gk-tab-item{border-bottom:2px solid transparent;color:rgba(0,0,0,.65);cursor:pointer;display:inline-block;font-size:14px;font-weight:400;height:100%;line-height:22px;margin:0 16px;padding:4px 2px 10px}.gk-panel-title .gk-panel-tabs-wp .gk-tab-item.action{border-bottom-color:#3266fb;color:#3266fb;font-weight:500}.gk-panel-title .ant-btn{margin:0 0 0 8px}.gk-panel-title .ant-btn:last-child{margin-right:8px}.gk-panel-content-container{background-color:#fff;border-radius:8px;padding:24px}"]
            },] }
];
PanelComponent.ctorParameters = () => [];
PanelComponent.propDecorators = {
    title: [{ type: Input }],
    tabs: [{ type: Input }],
    tabChange: [{ type: Output }],
    tabComponentList: [{ type: ContentChildren, args: [TabComponent, { descendants: true },] }],
    leftBtns: [{ type: Input }],
    rightBtns: [{ type: Input }],
    action: [{ type: Input }],
    btnsEvent: [{ type: Output }]
};

class GKPanelModule {
}
GKPanelModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    PanelComponent,
                    TabComponent,
                ],
                imports: [
                    CommonModule,
                    GKButtonModule,
                ],
                exports: [
                    PanelComponent,
                    TabComponent,
                ],
            },] }
];

const GK_EDITOR_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EditorComponent),
    multi: true,
};
const PreviewMenuKey = 'previewMenuKey';
class EditorComponent {
    constructor(ds, message) {
        this.ds = ds;
        this.message = message;
        this._viewMode = false;
        this.showPreview = false;
        this.showNativeBar = true;
    }
    get viewMode() { return this._viewMode; }
    set viewMode(newVal) {
        this._viewMode = newVal;
        setTimeout(() => {
            this.setModeStatus();
        }, 0);
    }
    setModeStatus() {
        if (this._viewMode) {
            this.showPreview = false;
            this.showNativeBar = false;
            this.gkEditor.disable();
        }
        else {
            this.gkEditor.enable();
            this.showPreview = false;
            this.showNativeBar = true;
        }
    }
    writeValue(value) {
        var _a;
        this.data = value;
        (_a = this.gkEditor) === null || _a === void 0 ? void 0 : _a.txt.html(this.data);
    }
    registerOnChange(fn) {
        this.updateValue = fn;
    }
    registerOnTouched(fn) { }
    ngOnInit() {
        this.edit.message = this.message;
        const getEditorDom = this.editor.nativeElement;
        const getToolbarDom = this.toolbar.nativeElement;
        // 注册预览
        this.gkEditor = new Wangeditor(getToolbarDom, getEditorDom);
        this.registerPreviewMenu(this.gkEditor);
        util.merge(this.gkEditor.config, this.edit.config);
        this.gkEditor.config.menus = this.edit.config.menus;
        this.gkEditor.config.menus = [...this.gkEditor.config.menus, PreviewMenuKey];
        this.gkEditor.config.customUploadImg = (files, insert) => {
            this.ossUpload(files[0], insert);
        };
        this.gkEditor.config.onchange = (htmlStr) => {
            this.updateValue(htmlStr);
        };
        this.gkEditor.create();
        this.gkEditor.txt.html(this.data);
        this.setModeStatus();
    }
    registerPreviewMenu(editor) {
        const self = this;
        class PreviewMenu extends Wangeditor.BtnMenu {
            constructor(e) {
                const $elem = Wangeditor.$(`<div class="w-e-menu" data-title="预览">
                        <i class="w-e-icon-eye eye-svg"></i>
                    </div>`);
                super($elem, e);
            }
            // 菜单点击事件
            clickHandler() {
                self.showPreview = true;
                self.showNativeBar = false;
                self.gkEditor.disable();
            }
            tryChangeActive() {
            }
        }
        editor.menus.extend(PreviewMenuKey, PreviewMenu);
    }
    cancelPreview() {
        this.showPreview = false;
        this.showNativeBar = true;
        this.gkEditor.enable();
    }
    ossUpload(file, insert) {
        return __awaiter(this, void 0, void 0, function* () {
            const cb = (event) => {
                if (event instanceof HttpResponse) {
                    if (event.status !== 200) {
                        this.message.warning('OSS上传失败');
                        return;
                    }
                    insert(event.body.data.key);
                }
            };
            const ossOptions = util.pick(this.edit.options, ['ossServerUrl', 'ossPublic']);
            this.ds.ossUpload(ossOptions, file, cb);
        });
    }
}
EditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-editor',
                template: "<div class=\"gk-editor-container\">\n    <div #toolbar [hidden]=\"!showNativeBar\" class=\"tool-bar\"></div>\n    <div [hidden]=\"!showPreview\" class=\"w-e-toolbar tool-bar preview-bar\">\n        <div nzTooltipTitle=\"\u53D6\u6D88\u9884\u89C8\" nzTooltipPlacement=\"top\" nz-tooltip class=\"w-e-menu\" (click)=\"cancelPreview()\">\n            <i class=\"w-e-icon-invisible eye-invisible\"></i>\n        </div>\n    </div>\n    <div #editor class=\"editor-box\" [class.view-box]=\"viewMode\"\n        [ngStyle]=\"{ 'height.px': viewMode?'auto':gkEditor.config.height }\">\n    </div>\n</div>\n",
                providers: [GK_EDITOR_VALUE_ACCESSOR],
                styles: [".gk-editor-container{position:relative;z-index:0}.tool-bar{background-color:#fff;border:1px solid #c9d8db;border-bottom-color:#eee;height:42px;padding:0 12px;z-index:1}.preview-bar{padding:0 18px}.editor-box{border:1px solid #c9d8db;border-top:none;overflow-y:auto;width:100%}.view-box{border:transparent}::ng-deep .eye-svg{background-image:url(\"data:image/svg+xml,%3C%3Fxml version%3D%221.0%22 standalone%3D%22no%22%3F%3E%3C!DOCTYPE svg PUBLIC %22-%2F%2FW3C%2F%2FDTD SVG 1.1%2F%2FEN%22 %22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%3Csvg class%3D%22icon%22 width%3D%2218px%22 height%3D%2218.00px%22 viewBox%3D%220 0 1024 1024%22 version%3D%221.1%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath fill%3D%22%23999999%22 d%3D%22M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3-7.7 16.2-7.7 35.2 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zM508 336c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176z m0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z%22 %2F%3E%3C%2Fsvg%3E\");color:#999;height:18px;width:18px}.eye-invisible{background-image:url(\"data:image/svg+xml,%3C%3Fxml version%3D%221.0%22 standalone%3D%22no%22%3F%3E%3C!DOCTYPE svg PUBLIC %22-%2F%2FW3C%2F%2FDTD SVG 1.1%2F%2FEN%22 %22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%3Csvg class%3D%22icon%22 width%3D%2218px%22 height%3D%2218.00px%22 viewBox%3D%220 0 1024 1024%22 version%3D%221.1%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath fill%3D%22%23999999%22 d%3D%22M933.12 505.429333l-0.213333-0.213333c-35.626667-75.093333-78.293333-135.722667-127.914667-182.016L755.370667 372.906667c42.794667 39.338667 79.786667 91.733333 111.658666 157.44-81.493333 168.661333-197.12 248.704-355.029333 248.704-50.218667 0-96.213333-8.106667-138.197333-24.576l-53.504 53.546666c57.216 27.562667 121.045333 41.472 191.701333 41.472 188.074667 0 328.234667-98.346667 420.992-293.888a58.88 58.88 0 0 0 0.085333-50.176z m-62.634667-325.12l-41.514666-41.472a7.850667 7.850667 0 0 0-11.093334 0L703.658667 253.013333c-57.173333-27.690667-120.96-41.6-191.616-41.6-188.117333 0-328.234667 98.389333-421.034667 293.888v0.128a59.008 59.008 0 0 0 0 50.346667c35.626667 75.093333 78.293333 135.765333 127.914667 182.186667L120.32 836.266667a7.850667 7.850667 0 0 0 0 11.050666l41.514667 41.472a7.850667 7.850667 0 0 0 11.093333 0l697.557333-697.6a7.722667 7.722667 0 0 0 0-10.922666z m-469.162666 375.04A109.568 109.568 0 0 1 532.906667 423.68l-131.626667 131.584z m180.522666-180.565333a172.373333 172.373333 0 0 0-229.461333 229.461333l-83.797333 83.797334c-42.752-39.338667-79.744-91.733333-111.658667-157.44C238.549333 361.898667 354.133333 281.813333 512 281.813333c50.218667 0 96.213333 8.149333 138.197333 24.618667l-68.352 68.266667zM508.074667 640.085333c-6.272 0-12.416-0.512-18.389334-1.578666l-50.005333 50.005333a172.245333 172.245333 0 0 0 226.56-226.56L616.234667 512a109.696 109.696 0 0 1-108.16 128.085333z%22 %2F%3E%3C%2Fsvg%3E\");color:#999;height:18px;width:18px}"]
            },] }
];
EditorComponent.ctorParameters = () => [
    { type: GKDataService },
    { type: NzMessageService }
];
EditorComponent.propDecorators = {
    editor: [{ type: ViewChild, args: ['editor', { static: true },] }],
    toolbar: [{ type: ViewChild, args: ['toolbar', { static: true },] }],
    edit: [{ type: Input }],
    viewMode: [{ type: Input }]
};

class GKEditorModule {
}
GKEditorModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    EditorComponent,
                ],
                imports: [
                    CommonModule,
                    NzToolTipModule,
                ],
                exports: [
                    EditorComponent,
                ],
            },] }
];

class IOService {
    constructor(req, ds) {
        this.req = req;
        this.ds = ds;
    }
    // 工具函数: 判断 value 是否是 TemplateRef
    isTemplateRef(value) {
        return value instanceof TemplateRef;
    }
    // 获取 formText formNumber 附加内容
    getAddOn(value) {
        if (typeof value === 'string') {
            return value;
        }
        if (this.isTemplateRef(value)) {
            return value;
        }
        return undefined;
    }
    // 判断 formText formNumber 是否附加内容
    hasAddOn(formControl) {
        return !!this.getAddOn(formControl.config.addOnBefore) || !!this.getAddOn(formControl.config.addOnAfter);
    }
    optionHandler(selfProp, control, formGroup) {
        if (!control.config.optionSource) {
            return;
        }
        control.source = this.getSource(control.config.optionSource);
        if (!control.config.link) {
            control.loading = true;
            control.source()
                .pipe(tap(() => control.loading = false))
                .subscribe(({ code, data }) => {
                if (code === 0) {
                    control.list = data;
                }
            });
        }
        else {
            const linkProps = this.getLinkProps(control.config.link);
            this.propSource(selfProp, linkProps, control, formGroup);
            this.propsHandler(selfProp, linkProps, control, formGroup);
        }
    }
    getSource(source) {
        if (source instanceof GKApi) {
            return (query) => this.req.request(source, query);
        }
        return source;
    }
    getLinkProps(links) {
        if (!Array.isArray(links)) {
            links = [links];
        }
        return links.map((link) => {
            if (typeof link === 'string') {
                return {
                    linkProp: link,
                    sendProp: link,
                };
            }
            if (!link.sendProp) {
                link.sendProp = link.linkProp;
            }
            return link;
        });
    }
    propSource(selfProp, linkProps, control, formGroup) {
        let query = this.getQuery(linkProps, formGroup);
        query = this.ds.compaction(query);
        control.loading = true;
        control.source(query)
            .pipe(tap(() => control.loading = false))
            .subscribe(({ code, data }) => {
            if (code === 0) {
                control.list = data;
                const isEmpty = !this.ds.hasOptions(formGroup.get(selfProp).value, data);
                if (isEmpty) {
                    formGroup.get(selfProp).reset();
                }
            }
        });
    }
    propsHandler(selfProp, linkProps, control, formGroup) {
        for (const prop of linkProps) {
            const { linkProp, sendProp } = prop;
            const targetControl = formGroup.get(linkProp);
            if (targetControl) {
                targetControl.valueChanges.pipe(debounceTime(300)).subscribe(() => {
                    this.propSource(selfProp, linkProps, control, formGroup);
                });
            }
        }
    }
    getQuery(props, formGroup) {
        const query = {};
        for (const prop of props) {
            const { linkProp, sendProp } = prop;
            query[sendProp] = formGroup.get(linkProp).value;
        }
        return query;
    }
}
IOService.ɵprov = ɵɵdefineInjectable({ factory: function IOService_Factory() { return new IOService(ɵɵinject(GKRequestService), ɵɵinject(GKDataService)); }, token: IOService, providedIn: "root" });
IOService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
IOService.ctorParameters = () => [
    { type: GKRequestService },
    { type: GKDataService }
];

class IOComponent {
    constructor(nzIcon, message, service) {
        this.nzIcon = nzIcon;
        this.message = message;
        this.service = service;
        this.formGroup = new FormGroup({});
        this._data = {};
        this.nzIcon.addIcon(EyeOutline, EyeInvisibleOutline, UploadOutline, PlusOutline, DeleteOutline, FileExclamationOutline, PictureTwoTone, DownloadOutline, FileTwoTone);
    }
    get control() { return this._control; }
    set control(newVal) {
        this._control = newVal;
        this.formGroup = this.control.getFormGroup();
        // control 初始化操作, 现包括 获取 render 及 select option绑定
        for (const propItem of Object.values(this.control.propMetas)) {
            const infoControl = propItem.infoControl;
            if (infoControl.controlType === 'infoCustom') {
                this.getTemplateRef(infoControl.config, 'render');
            }
            const formControl = propItem.formControl;
            if ((formControl === null || formControl === void 0 ? void 0 : formControl.controlType) === 'formText') {
                this.getTemplateRef(formControl.config, 'addOnBefore');
                this.getTemplateRef(formControl.config, 'addOnAfter');
            }
            if ((formControl === null || formControl === void 0 ? void 0 : formControl.controlType) === 'formNumber') {
                this.getTemplateRef(formControl.config, 'addOnBefore');
                this.getTemplateRef(formControl.config, 'addOnAfter');
            }
            if ((formControl === null || formControl === void 0 ? void 0 : formControl.controlType) === 'formSelect') {
                this.service.optionHandler(propItem.prop, formControl, this.formGroup);
            }
        }
        // control 初始化时, 将 data 值传入表单中
        if (this.data) {
            this.formGroup.patchValue(this.data);
        }
    }
    get data() { return this._data; }
    set data(newVal) {
        this._data = newVal;
        // 每次 data 变化时, 将 data 值传入表单中
        this.data ? this.formGroup.patchValue(this.data) : this.formGroup.reset();
    }
    ngOnInit() { }
    // 工具函数: 用于将 函数返回 TemplateRef 转成 TemplateRef
    getTemplateRef(obj, key) {
        const render = obj[key];
        if (typeof render === 'function') {
            setTimeout(() => {
                obj[key] = render();
            }, 0);
        }
    }
    // 判断表单块是否显示
    showBlockLabel(labelBlock) {
        if (labelBlock.options.filter) {
            // 第一种情况: 表单块的 filter函数 返回 false 则显示
            return !labelBlock.options.filter(this.formGroup, this.data);
        }
        // 第二种情况: 表单块里的任一表单项显示则显示
        return labelBlock.propItems.some((item) => this.showPropItem(item));
    }
    // 获取表单块的 label 宽度
    getBlockWidth(labelBlock) {
        if (this.control.options.labelWidth.slice(-1) === '%') {
            const width = Number(this.control.options.labelWidth.slice(0, -1)) / labelBlock.options.grid / 100;
            return {
                label: `calc(((100% + 24px) * ${width})`,
                control: `calc(100% - ((100% + 24px) * ${width})`,
            };
        }
        else {
            return {
                label: this.control.options.labelWidth,
                control: `calc(100% - ${this.control.options.labelWidth})`,
            };
        }
    }
    // 判断表单项是否显示
    showPropItem(item) {
        if (item.options.filter) {
            return !item.options.filter(this.formGroup, this.data);
        }
        return true;
    }
    // 获取表单项显示模式
    getItemMode(item) {
        if (item.onlyInfo) {
            return 'info';
        }
        return this.control.mode;
    }
    /* info 相关 */
    isPropItem(item) {
        return item;
    }
    // 通过 info 的 通用配置 format 得到组件接受值
    getInfoValue(item) {
        const format = item.infoControl.config.format;
        return format ? format(this.data, item.prop) : this.data[item.prop];
    }
    // 点击复制按钮的逻辑处理 传入字符串
    onCopyClick(str) {
        const aux = document.createElement('input');
        aux.setAttribute('value', str);
        document.body.appendChild(aux);
        aux.select();
        if (document.execCommand('Copy')) {
            document.execCommand('Copy');
            document.body.removeChild(aux);
            this.message.success('已复制到剪切板！');
        }
        else {
            this.message.warning('当前浏览器不支持该功能，请将浏览器更新到最新版本或切换其他浏览器！');
        }
    }
    // 获取 infoText 显示内容
    getTextContent(item) {
        const result = {
            statusMode: false,
            plainText: '',
            statusTexts: [],
            tips: '',
        };
        const infoControl = item.infoControl;
        const format = infoControl.config.format;
        if (!format) {
            result.plainText = this.data[item.prop];
        }
        else {
            const value = format(this.data, item.prop);
            if (typeof value === 'string') {
                result.plainText = value;
            }
            else {
                result.statusMode = true;
                result.plainText = value.map((i) => typeof i === 'string' ? i : i.text).join('');
                result.statusTexts = value;
            }
        }
        if (infoControl.config.tips) {
            result.tips = result.plainText;
        }
        return result;
    }
    // 获取 infoText 字体颜色
    getTextColor(item) {
        const color = item.infoControl.config.color;
        let target = '';
        if (typeof color === 'string') {
            target = color;
        }
        else if (typeof color === 'function') {
            target = color(this.data, item.prop);
        }
        return {
            success: '#52c41a',
            warning: '#fa8c16',
            error: '#f5222d',
        }[target] || target;
    }
    // 获取 infoTags 的 每个标签颜色
    getTagColor(item, index) {
        const tagType = item.infoControl.config.tagType;
        let target = '';
        if (typeof tagType === 'string') {
            target = tagType;
        }
        else if (typeof tagType === 'function') {
            target = tagType(this.data, item.prop, index);
        }
        return target;
    }
    // 获取 infoLink 的链接地址
    getLinkHref(item) {
        const href = item.infoControl.config.href;
        return href ? href(this.data, item.prop) : this.getInfoValue(item);
    }
    // 获取 infoImg 的显示图片队列
    getImgList(value) {
        return typeof value === 'string' ? [value] : value;
    }
    /* form 相关 */
    // 判断表单块是否显示 必填红星
    showBlockRequired(items) {
        const formBlocks = items.filter((item) => this.getItemMode(item) === 'form');
        return formBlocks.length > 0 && formBlocks.every((item) => !!item.formControl.config.required);
    }
    // 获取表单项 校验错误文本
    getErrorTip(item) {
        if (this.getItemMode(item) !== 'form') {
            return null;
        }
        const erros = this.formGroup.get(item.prop).errors || {};
        return Object.keys(erros).map((key) => {
            return {
                required: '必填项!',
                email: 'email格式不正确',
                maxlength: '超过最大长度',
                minlength: '小于最小长度',
            }[key] || erros[key];
        }).join(' ') || null;
    }
    // 获取 formAgree 协议禁用状态
    getAgreeDisabled(item) {
        const disabled = item.formControl.config.disabled || false;
        if (typeof disabled === 'boolean') {
            return disabled;
        }
        const flag = disabled(this.formGroup, item.prop);
        if (flag) {
            this.formGroup.patchValue({
                [item.prop]: false,
            });
        }
        return flag;
    }
}
IOComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-io',
                template: "<form nz-form [formGroup]=\"formGroup\" class=\"gk-io-container\">\n    <div nz-row [nzGutter]=\"24\" class=\"row\">\n        <ng-container *ngFor=\"let labelBlock of control.labelBlocks\">\n            <div *ngIf=\"showBlockLabel(labelBlock)\" nz-col\n                [nzSpan]=\"labelBlock.options.grid / control.options.gridCount * 24\">\n                <nz-form-item class=\"gk-block-label\"\n                    [class.gk-block-label-first-info]=\"getItemMode(labelBlock.propItems[0]) === 'info'\">\n                    <nz-form-label [nzRequired]=\"true\" [class.gk-text-minor]=\"control.mode === 'info'\"\n                        [class.hide-required]=\"!showBlockRequired(labelBlock.propItems)\"\n                        [style.width]=\"getBlockWidth(labelBlock).label\">{{ labelBlock.label }}</nz-form-label>\n                </nz-form-item>\n\n                <ng-container *ngFor=\"let item of labelBlock.propItems; let index = index\">\n                    <nz-form-item *ngIf=\"showPropItem(item)\">\n                        <nz-form-label style=\"visibility: hidden; height: 1px;\"\n                            [style.width]=\"getBlockWidth(labelBlock).label\">\n                        </nz-form-label>\n\n                        <nz-form-control *ngIf=\"getItemMode(item) === 'info' && item.infoControl\"\n                            class=\"gk-info-item-control\" [class]=\"item.infoControl.controlType\"\n                            [style.width]=\"getBlockWidth(labelBlock).control\">\n                            <div class=\"gk-info-item-control-content\">\n                                <ng-container *ngTemplateOutlet=\"infoContent; context: { $implicit: item }\">\n                                </ng-container>\n                            </div>\n                        </nz-form-control>\n\n                        <nz-form-control *ngIf=\"getItemMode(item) === 'form' && item.formControl\"\n                            [nzErrorTip]=\"getErrorTip(item)\" class=\"gk-form-item-control\"\n                            [class]=\"item.formControl.controlType\" [style.width]=\"getBlockWidth(labelBlock).control\">\n                            <div class=\"gk-form-item-control-content\">\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formText'\">\n                                    <ng-container *ngIf=\"!service.hasAddOn(item.formControl)\">\n                                        <input nz-input [formControlName]=\"item.prop\"\n                                            [placeholder]=\"item.formControl.config.placeholder\" />\n                                    </ng-container>\n                                    <nz-input-group *ngIf=\"service.hasAddOn(item.formControl)\"\n                                        [nzAddOnBefore]=\"service.getAddOn(item.formControl.config.addOnBefore)\"\n                                        [nzAddOnAfter]=\"service.getAddOn(item.formControl.config.addOnAfter)\">\n                                        <input nz-input [formControlName]=\"item.prop\"\n                                            [placeholder]=\"item.formControl.config.placeholder\" />\n                                    </nz-input-group>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formTextarea'\">\n                                    <ng-container *ngIf=\"!item.formControl.config.maxCharacterCount\">\n                                        <textarea nz-input [formControlName]=\"item.prop\"\n                                            [rows]=\"item.formControl.config.rows\"\n                                            [class.resize]=\"item.formControl.config.noResize\"\n                                            [nzAutosize]=\"item.formControl.config.autoSize\"\n                                            [placeholder]=\"item.formControl.config.placeholder\"></textarea>\n                                    </ng-container>\n                                    <nz-textarea-count *ngIf=\"item.formControl.config.maxCharacterCount\"\n                                        [nzMaxCharacterCount]=\"item.formControl.config.maxCharacterCount\">\n                                        <textarea nz-input [formControlName]=\"item.prop\"\n                                            [rows]=\"item.formControl.config.rows\"\n                                            [class.resize]=\"item.formControl.config.noResize\"\n                                            [nzAutosize]=\"item.formControl.config.autoSize\"\n                                            [placeholder]=\"item.formControl.config.placeholder\"></textarea>\n                                    </nz-textarea-count>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formNumber'\">\n                                    <gk-number [formControlName]=\"item.prop\" [xFormControl]=\"item.formControl\">\n                                    </gk-number>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formPassword'\">\n                                    <nz-input-group [nzSuffix]=\"suffixTemplate\">\n                                        <input nz-input [formControlName]=\"item.prop\"\n                                            [type]=\"item.formControl.showPassword ? 'text' : 'password'\"\n                                            [placeholder]=\"item.formControl.config.placeholder\" />\n                                    </nz-input-group>\n                                    <ng-template #suffixTemplate>\n                                        <gk-icon [type]=\"item.formControl.showPassword ? 'eye-invisible' : 'eye'\"\n                                            style=\"cursor: pointer;\"\n                                            (click)=\"item.formControl.showPassword = !item.formControl.showPassword\">\n                                        </gk-icon>\n                                    </ng-template>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formSwitch'\">\n                                    <nz-switch [formControlName]=\"item.prop\"\n                                        [nzDisabled]=\"item.formControl.config.disabled\"></nz-switch>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formRadio'\">\n                                    <nz-radio-group [formControlName]=\"item.prop\">\n                                        <label *ngFor=\"let option of item.formControl.config.options\" nz-radio\n                                            [nzValue]=\"option.value\" [nzDisabled]=\"\n                                            option.disabled\">{{ option.label }}</label>\n                                    </nz-radio-group>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formCheckbox'\">\n                                    <gk-checkbox [formControlName]=\"item.prop\"\n                                        [options]=\"item.formControl.config.options\"></gk-checkbox>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formSelect'\">\n                                    <nz-select [formControlName]=\"item.prop\" [nzMode]=\"item.formControl.config.mode\"\n                                        [nzDisabled]=\"item.formControl.config.disabled\"\n                                        [nzShowSearch]=\"item.formControl.config.search\"\n                                        [nzLoading]=\"item.formControl.loading\" nzAllowClear\n                                        [nzPlaceHolder]=\"item.formControl.config.placeholder || '\u8BF7\u9009\u62E9'\">\n                                        <nz-option *ngFor=\"let option of item.formControl.list\" [nzLabel]=\"option.label\"\n                                            [nzValue]=\"option.value\">\n                                        </nz-option>\n                                    </nz-select>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formRate'\">\n                                    <nz-rate [formControlName]=\"item.prop\"\n                                        [nzAllowHalf]=\"item.formControl.config.allowHalf\"\n                                        [nzTooltips]=\"item.formControl.config.tooltips\"></nz-rate>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formDate'\">\n                                    <gk-time-picker [formControlName]=\"item.prop\" [xFormControl]=\"item.formControl\">\n                                    </gk-time-picker>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formDateRange'\">\n                                    <gk-time-picker [formControlName]=\"item.prop\" [xFormControl]=\"item.formControl\">\n                                    </gk-time-picker>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formAgree'\">\n                                    <label nz-checkbox [formControlName]=\"item.prop\"\n                                        [nzDisabled]=\"getAgreeDisabled(item)\" style=\"margin-right: 8px;\"></label>\n                                    <span>\n                                        <ng-container *ngFor=\"let node of item.formControl.config.content\">\n                                            <span *ngIf=\"!$any(node).text\">{{ node }}</span>\n                                            <a *ngIf=\"$any(node).text\" [href]=\"$any(node).href\" target=\"_blank\"\n                                                rel=\"noopener norefferrer\" style=\"margin: 0 2px;\">{{ $any(node).text\n                                                }}</a>\n                                        </ng-container>\n                                    </span>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formUpload'\">\n                                    <gk-upload [formControlName]=\"item.prop\" [xFormControl]=\"item.formControl\">\n                                    </gk-upload>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.formControl.controlType === 'formEditor'\">\n                                    <gk-editor [formControlName]=\"item.prop\" [edit]=\"item.formControl.edit\">\n                                    </gk-editor>\n                                </ng-container>\n                            </div>\n                        </nz-form-control>\n\n                    </nz-form-item>\n                </ng-container>\n            </div>\n        </ng-container>\n    </div>\n</form>\n\n\n\n<ng-template #infoContent let-item=\"$implicit\">\n    <ng-template [ngIf]=\"isPropItem(item)\" let-item=\"ngIf\">\n\n        <ng-container *ngIf=\"item.infoControl.controlType === 'infoText'\">\n            <ng-container *ngTemplateOutlet=\"infoTextContent; context: { $implicit: getTextContent(item) }\">\n            </ng-container>\n            <ng-template #infoTextContent let-v=\"$implicit\">\n                <div [ngClass]=\"{ 'gk-text-singel': item.infoControl.config.textType === 'singel'}\">\n                    <span nz-tooltip nzTooltipPlacement=\"topCenter\" [nzTooltipTitle]=\"v.tips\" class=\"gk-text-content\"\n                        [style.color]=\"getTextColor(item)\">\n                        <ng-container *ngIf=\"!v.statusMode\">{{\n                            v.plainText }}</ng-container>\n                        <ng-container *ngIf=\"v.statusMode\">\n                            <span *ngFor=\"let node of v.statusTexts\"\n                                [ngClass]=\"{ 'gk-text-status': !!$any(node).status }\" [class]=\"$any(node).status\">{{\n                                $any(node).text || node }}</span>\n                        </ng-container>\n                    </span>\n\n                    <gk-button *ngIf=\"item.infoControl.config.copyBtn\" size=\"small\" class=\"copy-btn\"\n                        (click)=\"onCopyClick(v.plainText)\">\u590D\u5236</gk-button>\n                </div>\n            </ng-template>\n        </ng-container>\n\n        <ng-container *ngIf=\"item.infoControl.controlType === 'infoRate'\">\n            <nz-rate [ngModel]=\"getInfoValue(item)\" [nzDisabled]=\"true\" [nzTooltips]=\"\n        item.infoControl.config.tooltips\"></nz-rate>\n        </ng-container>\n\n        <ng-container *ngIf=\"item.infoControl.controlType === 'infoTags'\">\n            <nz-tag *ngFor=\"let tag of getInfoValue(item); let index = index\" [nzColor]=\"getTagColor(item, index)\">\n                <span>{{ tag }}</span>\n            </nz-tag>\n        </ng-container>\n\n        <ng-container *ngIf=\"item.infoControl.controlType === 'infoLink'\">\n            <a [href]=\"getLinkHref(item)\" target=\"_blank\">{{ getInfoValue(item) }}</a>\n            <gk-button *ngIf=\"item.infoControl.config.copyBtn\" size=\"small\" class=\"copy-btn\"\n                (click)=\"onCopyClick(getLinkHref(item))\">\u590D\u5236</gk-button>\n        </ng-container>\n\n        <ng-container *ngIf=\"item.infoControl.controlType === 'infoImg'\">\n            <div class=\"gk-clr\">\n                <div class=\"img-wrap\" *ngFor=\"let img of getImgList(getInfoValue(item))\">\n                    <img [src]=\"img\" alt=\"\">\n                </div>\n            </div>\n        </ng-container>\n\n        <ng-container *ngIf=\"item.infoControl.controlType === 'infoEditor'\">\n            <gk-editor [ngModel]=\"getInfoValue(item)\" [edit]=\"item.infoControl.edit\" [viewMode]=\"true\">\n            </gk-editor>\n        </ng-container>\n\n        <ng-container *ngIf=\"item.infoControl.controlType === 'infoCustom'\">\n            <ng-container *ngIf=\"service.isTemplateRef(item.infoControl.config.render)\"\n                [ngTemplateOutlet]=\"item.infoControl.config.render\"\n                [ngTemplateOutletContext]=\"{ data: data, prop: item.prop, value: getInfoValue(item) }\">\n            </ng-container>\n        </ng-container>\n\n    </ng-template>\n</ng-template>\n",
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}.gk-io-container{margin-top:8px}.gk-io-container .gk-block-label{margin-bottom:-32px}.gk-io-container .gk-block-label .ant-form-item-label{text-align:left}.gk-io-container .gk-block-label .ant-form-item-label.hide-required ::ng-deep .ant-form-item-required:before{opacity:0}.gk-io-container .gk-block-label.gk-block-label-first-info{margin-bottom:-20px}.gk-io-container .gk-block-label.gk-block-label-first-info .ant-form-item-label,.gk-io-container .gk-block-label.gk-block-label-first-info .ant-form-item-label ::ng-deep label{height:20px;line-height:20px}.gk-io-container .gk-info-item-control ::ng-deep .ant-form-item-control-input{line-height:20px;min-height:20px}.gk-io-container .gk-info-item-control.infoText .gk-text-content .gk-text-status{margin:0 2px}.gk-io-container .gk-info-item-control.infoText .gk-text-content .gk-text-status.primary{color:#3266fb}.gk-io-container .gk-info-item-control.infoText .gk-text-content .gk-text-status.success{color:#52c41a}.gk-io-container .gk-info-item-control.infoText .gk-text-content .gk-text-status.warning{color:#faad14}.gk-io-container .gk-info-item-control.infoText .gk-text-content .gk-text-status.danger{color:#ff4d4f}.gk-io-container .gk-info-item-control.infoText .gk-text-singel{align-items:center;display:flex}.gk-io-container .gk-info-item-control.infoText .gk-text-singel .gk-text-content{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gk-io-container .gk-info-item-control.infoRate ::ng-deep .ant-form-item-control-input-content{height:20px}.gk-io-container .gk-info-item-control.infoTags ::ng-deep .ant-form-item-control-input-content>.gk-info-item-control-content{margin:-4px 0}.gk-io-container .gk-info-item-control.infoTags ::ng-deep .ant-form-item-control-input-content>.gk-info-item-control-content .ant-tag{margin-bottom:3px;margin-top:3px}.gk-io-container .gk-info-item-control.infoImg .img-wrap{border:1px solid #d9d9d9;border-radius:8px;float:left;height:104px;margin-bottom:8px;margin-right:8px;max-width:100%;overflow:hidden;overflow-x:auto;padding:8px}.gk-io-container .gk-info-item-control.infoImg .img-wrap img{height:100%}.gk-io-container .gk-info-item-control .copy-btn{margin-left:24px}.gk-io-container .gk-form-item-control .ant-input,.gk-io-container .gk-form-item-control .ant-input-number,.gk-io-container .gk-form-item-control .ant-picker{width:100%}.gk-io-container .gk-form-item-control .resize{resize:none}::ng-deep .preview-modal .ant-modal-body{padding:28px 40px}"]
            },] }
];
IOComponent.ctorParameters = () => [
    { type: NzIconService },
    { type: NzMessageService },
    { type: IOService }
];
IOComponent.propDecorators = {
    control: [{ type: Input }],
    data: [{ type: Input }]
};

const UEDITOR_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberComponent),
    multi: true,
};
class NumberComponent {
    constructor(service) {
        this.service = service;
        this.firstUpdateValue = undefined;
    }
    getUpdateValue() {
        var _a;
        const formControl = this.xFormControl;
        const selectionStart = (_a = this.inputNumber) === null || _a === void 0 ? void 0 : _a.nativeElement.selectionStart;
        const initInputText = this.inputValue || '';
        let numberText = this.inputValue || '';
        // 去除非数字符号
        numberText = numberText.trim().replace(/[^\d\.-]/g, '');
        // 判断是否为负数
        const isNegative = formControl.config.negative && numberText[0] === '-';
        numberText = numberText.replace(/-/g, '');
        if (!formControl.config.point) {
            // 整数时 不能有小数点
            numberText = numberText.replace(/\./g, '');
        }
        else {
            // 小数点开头 自动补一个零
            if (numberText[0] === '.') {
                numberText = '0' + numberText;
            }
            // 仅留下第一个小数点
            const index = numberText.indexOf('.');
            if (index > -1) {
                const list = numberText.split('.');
                list.splice(1, 0, '.');
                numberText = list.join('');
            }
        }
        // 是负数时 添加 -
        if (isNegative) {
            numberText = '-' + numberText;
        }
        // 回填文本到输入框
        if (this.inputValue !== numberText) {
            this.inputValue = numberText;
            if (this.inputNumber) {
                this.inputNumber.nativeElement.value = numberText;
                if (initInputText.length === numberText.length + 1) {
                    this.inputNumber.nativeElement.setSelectionRange(selectionStart - 1, selectionStart - 1);
                }
            }
        }
        // 获取需 update 的值
        let setValue;
        if (numberText === '') {
            setValue = null;
        }
        else if (numberText.length === 1 && numberText[0] === '-') {
            setValue = null;
        }
        else if (numberText[numberText.length - 1] === '.') {
            setValue = Number(numberText.slice(0, -1));
        }
        else {
            setValue = Number(numberText);
        }
        return setValue;
    }
    onModelChange() {
        const updateValue = this.getUpdateValue();
        this.updateValue(updateValue);
    }
    onBlur() {
        this.inputNumber.nativeElement.value = this.formValue === null ? '' : String(this.formValue);
    }
    writeValue(value) {
        this.formValue = value;
        if (value === null) {
            this.inputValue = '';
        }
        else {
            this.inputValue = String(value);
        }
        // 检查是否需要修改传入的表单值
        const updateValue = this.getUpdateValue();
        if (!util.isEqual(value, updateValue)) {
            if (!this.updateValue) {
                this.firstUpdateValue = updateValue;
            }
            else {
                this.updateValue(updateValue);
            }
        }
    }
    registerOnChange(fn) {
        this.updateValue = (newVal) => {
            if (this.formValue !== newVal) {
                this.formValue = newVal;
                fn(newVal);
            }
        };
        if (this.firstUpdateValue !== undefined) {
            this.updateValue(this.firstUpdateValue);
        }
    }
    registerOnTouched(fn) {
    }
    setDisabledState(isDisabled) {
    }
    ngOnInit() {
    }
}
NumberComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-number',
                template: "<ng-container *ngIf=\"!service.hasAddOn(xFormControl)\">\n    <input nz-input [(ngModel)]=\"inputValue\" #inputNumber [placeholder]=\"xFormControl.config.placeholder\"\n        (ngModelChange)=\"onModelChange( )\" (blur)=\"onBlur( )\" />\n</ng-container>\n<nz-input-group *ngIf=\"service.hasAddOn(xFormControl)\"\n    [nzAddOnBefore]=\"service.getAddOn(xFormControl.config.addOnBefore)\"\n    [nzAddOnAfter]=\"service.getAddOn(xFormControl.config.addOnAfter)\">\n    <input nz-input [(ngModel)]=\"inputValue\" #inputNumber [placeholder]=\"xFormControl.config.placeholder\"\n        (ngModelChange)=\"onModelChange( )\" (blur)=\"onBlur( )\" />\n</nz-input-group>\n",
                providers: [UEDITOR_VALUE_ACCESSOR],
                styles: [""]
            },] }
];
NumberComponent.ctorParameters = () => [
    { type: IOService }
];
NumberComponent.propDecorators = {
    xFormControl: [{ type: Input }],
    inputNumber: [{ type: ViewChild, args: ['inputNumber',] }]
};

const UEDITOR_VALUE_ACCESSOR$1 = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
};
class CheckboxComponent {
    constructor() {
        this._options = [];
        this.checkOptions = [];
        this.createCheckOptions = () => {
            this.checkOptions = this.options.map((option) => (Object.assign(Object.assign({}, option), { checked: (this.formValue || []).includes(option.value) })));
        };
        this.firstUpdateValue = undefined;
    }
    get options() { return this._options; }
    set options(newVal) {
        this._options = newVal;
        this.createCheckOptions();
    }
    getUpdateValue() {
        const checkVals = this.checkOptions.filter((option) => option.checked).map((option) => option.value);
        if (checkVals.length === 0 && this.formValue === null) {
            return null;
        }
        return checkVals;
    }
    onModelChange() {
        const updateValue = this.getUpdateValue();
        this.updateValue(updateValue);
    }
    writeValue(value) {
        this.formValue = value;
        this.createCheckOptions();
        // 检查是否需要修改传入的表单值
        const updateValue = this.getUpdateValue();
        if (!util.isEqual(value, updateValue)) {
            if (!this.updateValue) {
                this.firstUpdateValue = updateValue;
            }
            else {
                this.updateValue(updateValue);
            }
        }
    }
    registerOnChange(fn) {
        this.updateValue = (newVal) => {
            this.formValue = newVal;
            fn(newVal);
        };
        if (this.firstUpdateValue !== undefined) {
            this.updateValue(this.firstUpdateValue);
        }
    }
    registerOnTouched(fn) {
    }
    setDisabledState(isDisabled) {
    }
    ngOnInit() {
    }
}
CheckboxComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-checkbox',
                template: "<nz-checkbox-group [(ngModel)]=\"checkOptions\" (ngModelChange)=\"onModelChange()\"></nz-checkbox-group>\n",
                providers: [UEDITOR_VALUE_ACCESSOR$1],
                styles: [""]
            },] }
];
CheckboxComponent.ctorParameters = () => [];
CheckboxComponent.propDecorators = {
    options: [{ type: Input }]
};

const UEDITOR_VALUE_ACCESSOR$2 = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimePickerComponent),
    multi: true,
};
class TimePickerComponent {
    constructor() {
        this.firstUpdateValue = undefined;
    }
    getUpdateValue() {
        // Date 为 null 处理 start
        if (!Array.isArray(this.dateValue)) {
            if (!(this.dateValue instanceof Date)) {
                return null;
            }
        }
        else {
            if (this.dateValue.length === 0) {
                return [];
            }
            if (!(this.dateValue[0] instanceof Date) || !(this.dateValue[1] instanceof Date)) {
                this.dateValue = [null, null];
                return [null, null];
            }
        }
        // Date 为 null 处理 end
        if (!this.xFormControl.config.showTime) {
            this.setTimeHours();
        }
        if (this.xFormControl.controlType === 'formDate') {
            return this.dateValue.getTime();
        }
        else if (this.xFormControl.controlType === 'formDateRange') {
            return [
                this.dateValue[0].getTime(),
                this.dateValue[1].getTime(),
            ];
        }
        return null;
    }
    setTimeHours() {
        if (!Array.isArray(this.dateValue)) {
            this.dateValue.setHours(0, 0, 0, 0);
        }
        else {
            this.dateValue[0].setHours(0, 0, 0, 0);
            this.dateValue[1].setHours(0, 0, 0, 0);
        }
    }
    onModelChange() {
        const updateValue = this.getUpdateValue();
        this.updateValue(updateValue);
    }
    writeValue(value) {
        // 把时间戳转成 Date start
        if (this.xFormControl.controlType === 'formDate') {
            if (typeof value === 'number') {
                this.dateValue = new Date(value);
            }
            else {
                this.dateValue = null;
            }
        }
        else if (this.xFormControl.controlType === 'formDateRange') {
            if (Array.isArray(value)) {
                if (value.length === 0) {
                    this.dateValue = [];
                }
                else {
                    if (typeof value[0] !== 'number' || typeof value[1] !== 'number') {
                        this.dateValue = [null, null];
                    }
                    else {
                        this.dateValue = [new Date(value[0]), new Date(value[1])];
                    }
                }
            }
            else {
                this.dateValue = null;
            }
        }
        // 把时间戳转成 Date end
        // 检查是否需要修改传入的表单值
        const updateValue = this.getUpdateValue();
        if (!util.isEqual(value, updateValue)) {
            if (!this.updateValue) {
                this.firstUpdateValue = updateValue;
            }
            else {
                this.updateValue(updateValue);
            }
        }
    }
    registerOnChange(fn) {
        this.updateValue = fn;
        if (this.firstUpdateValue !== undefined) {
            this.updateValue(this.firstUpdateValue);
        }
    }
    registerOnTouched(fn) {
    }
    setDisabledState(isDisabled) {
    }
    ngOnInit() {
    }
}
TimePickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-time-picker',
                template: "<ng-container *ngIf=\"xFormControl.controlType === 'formDate'\">\n    <nz-date-picker [(ngModel)]=\"dateValue\" (ngModelChange)=\"onModelChange()\" [nzMode]=\"xFormControl.config.mode\"\n        [nzShowTime]=\"xFormControl.config.showTime\" [nzFormat]=\"xFormControl.config.format\"\n        [nzDisabledDate]=\"xFormControl.disabledDateFunc\" [nzShowToday]=\"xFormControl.config.showToday\"\n        [nzPlaceHolder]=\"xFormControl.config.placeholder || '\u8BF7\u9009\u62E9'\" style=\"width: 100%;\">\n    </nz-date-picker>\n</ng-container>\n\n<ng-container *ngIf=\"xFormControl.controlType === 'formDateRange'\">\n    <nz-range-picker [(ngModel)]=\"dateValue\" (ngModelChange)=\"onModelChange()\" [nzMode]=\"xFormControl.config.mode\"\n        [nzShowTime]=\"xFormControl.config.showTime\" [nzFormat]=\"xFormControl.config.format\" #nzRangePicker\n        [nzDisabledDate]=\"xFormControl.disabledAndMaxDateFunc(nzRangePicker)\" [nzRanges]=\"xFormControl.fastRanges\"\n        style=\"width: 100%;\">\n    </nz-range-picker>\n</ng-container>\n",
                providers: [UEDITOR_VALUE_ACCESSOR$2],
                styles: [""]
            },] }
];
TimePickerComponent.ctorParameters = () => [];
TimePickerComponent.propDecorators = {
    xFormControl: [{ type: Input }]
};

const UEDITOR_VALUE_ACCESSOR$3 = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UploadComponent),
    multi: true,
};
class UploadComponent {
    // formUpload  end
    constructor(http, message, ds, modalService) {
        this.http = http;
        this.message = message;
        this.ds = ds;
        this.modalService = modalService;
        // formUpload start
        this.getNzBeforeUpload = (formControl) => {
            return (file) => {
                var _a;
                const config = formControl.config;
                let fileSuffixs = ((_a = config.fileSuffixs) === null || _a === void 0 ? void 0 : _a.map((s) => s.toLowerCase())) || [];
                if (config.fileType === 'image' && fileSuffixs.length === 0) {
                    fileSuffixs = ['png', 'gif', 'jpg', 'jpeg', 'bmp', 'svg'];
                }
                if (fileSuffixs.length > 0) {
                    const fileSuffix = this.getFileSuffix(file.name);
                    if (!fileSuffixs.includes(fileSuffix)) {
                        this.message.warning(`请选择文件后缀为${fileSuffixs.join(',')}`);
                        return false;
                    }
                }
                if (config.size && file.size > config.size) {
                    this.message.warning(`文件大小超出限制`);
                    return false;
                }
                this.handleFile(formControl, config, file);
                return false;
            };
        };
        this.getShwoButton = (control) => {
            if (control.config.type === 'signle') {
                return control.nzFileList.length === 0;
            }
            if (control.config.maxLength) {
                return control.nzFileList.length < control.config.maxLength;
            }
            return true;
        };
        this.getHandlePreview = (formControl) => {
            return (file) => __awaiter(this, void 0, void 0, function* () {
                if (formControl.config.fileType === 'image') {
                    formControl.previewImage = file.url || file.thumbUrl || (yield this.getBase64(file.originFileObj));
                }
            });
        };
        this.getRemove = (formControl) => {
            return (file) => {
                const config = formControl.config;
                if (config.type === 'signle') {
                    this.updateValue(null);
                    formControl.nzFileList = [];
                }
                else {
                    const index = formControl.nzFileList.indexOf(file);
                    const newValue = [...this.formValue];
                    newValue.splice(index, 1);
                    this.updateValue(newValue);
                    formControl.nzFileList.splice(index, 1);
                }
                return false;
            };
        };
    }
    getFileSuffix(fileName) {
        if (!fileName || !fileName.includes('.')) {
            return '';
        }
        const list = fileName.split('.');
        if (list.length === 2 && list[0] === '') {
            return '';
        }
        return list[list.length - 1].toLowerCase();
    }
    handleFile(formControl, config, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (formControl.config.fileVerify) {
                const flag = yield formControl.config.fileVerify(file.originFileObj ? file.originFileObj : file);
                if (!flag) {
                    return;
                }
            }
            let newFile = {};
            if (config.fileType === 'image') {
                newFile = {
                    originFileObj: file,
                    status: 'uploading',
                    uid: new Date().getTime() + '' + Math.round(Math.random() * 10000),
                };
            }
            else {
                file.status = 'uploading';
                newFile = file;
            }
            if (config.type === 'signle') {
                formControl.nzFileList = [newFile];
            }
            else {
                formControl.nzFileList.push(newFile);
            }
            if (config.mode === 'form') {
                if (config.type === 'signle') {
                    this.updateValue(file);
                }
                else {
                    this.updateValue([...(this.formValue || []), file]);
                }
                newFile.status = '';
            }
            else if (config.mode === 'server') {
                const formData = new FormData();
                formData.append(config.serverConfig.fileKey, file);
                this.http.post(config.serverConfig.url, formData, {
                    headers: new HttpHeaders(config.serverConfig.headers || {}),
                    observe: 'events',
                    reportProgress: true,
                }).subscribe({
                    next: (event) => {
                        if (event.type === HttpEventType.UploadProgress) {
                            newFile.percent = (event.loaded / event.total) * 100;
                            newFile.status = 'uploading';
                        }
                        else if (event instanceof HttpResponse) {
                            const { code, message, data } = event.body;
                            if (code !== 0) {
                                this.message.warning(message);
                                newFile.status = 'error';
                                return;
                            }
                            if (config.type === 'signle') {
                                this.updateValue(data.url);
                            }
                            else {
                                this.updateValue([...(this.formValue || []), data.url]);
                            }
                            newFile.status = '';
                        }
                    },
                    error: (error) => {
                        newFile.status = 'error';
                    },
                });
            }
            else if (config.mode === 'aliyunOSS') {
                const successCb = (event) => {
                    var _a, _b, _c, _d;
                    if (event.type === HttpEventType.UploadProgress) {
                        newFile.percent = (event.loaded / event.total) * 100;
                        newFile.status = 'uploading';
                    }
                    else if (event instanceof HttpResponse) {
                        if (event.status !== 200) {
                            this.message.warning('OSS上传失败');
                            newFile.status = 'error';
                            return;
                        }
                        if (config.type === 'signle') {
                            this.updateValue((_b = (_a = event.body) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.key);
                        }
                        else {
                            this.updateValue([...(this.formValue || []), (_d = (_c = event.body) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.key]);
                        }
                        newFile.status = '';
                    }
                };
                const errorCb = (error) => {
                    newFile.status = 'error';
                };
                this.ds.ossUpload(config, file, successCb, errorCb);
            }
        });
    }
    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }
    writeValue(value) {
        this.formValue = value;
    }
    registerOnChange(fn) {
        this.updateValue = (newVal) => {
            this.formValue = newVal;
            fn(newVal);
        };
    }
    registerOnTouched(fn) {
    }
    setDisabledState(isDisabled) {
    }
    ngOnInit() {
    }
}
UploadComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-upload',
                template: "<nz-upload [nzBeforeUpload]=\"getNzBeforeUpload(xFormControl)\" [(nzFileList)]=\"xFormControl.nzFileList\"\n    [nzListType]=\"xFormControl.config.fileType === 'image' ? 'picture-card' : 'text'\"\n    [nzShowButton]=\"getShwoButton(xFormControl)\" [nzPreview]=\"getHandlePreview(xFormControl)\"\n    [nzRemove]=\"getRemove(xFormControl)\">\n    <gk-button *ngIf=\"xFormControl.config.fileType === 'default'\" icon=\"upload\">\u4E0A\u4F20\u6587\u4EF6</gk-button>\n\n    <ng-container *ngIf=\"xFormControl.config.fileType === 'image'\">\n        <div>\n            <gk-icon type=\"plus\"></gk-icon>\n            <div style=\"margin-top: 8px\">\u4E0A\u4F20\u56FE\u7247</div>\n        </div>\n        <nz-modal [nzVisible]=\"!!xFormControl.previewImage\" [nzCentered]=\"modalService.center\"\n            [nzContent]=\"modalContent\" [nzFooter]=\"null\" nzWrapClassName=\"preview-modal\"\n            (nzOnCancel)=\"xFormControl.previewImage = ''\">\n            <ng-template #modalContent>\n                <img [src]=\"xFormControl.previewImage\" style=\"width: 100%;\" />\n            </ng-template>\n        </nz-modal>\n    </ng-container>\n</nz-upload>\n<div *ngIf=\"xFormControl.config.fileTip\">{{ xFormControl.config.fileTip }}</div>\n",
                providers: [UEDITOR_VALUE_ACCESSOR$3],
                styles: [""]
            },] }
];
UploadComponent.ctorParameters = () => [
    { type: HttpClient },
    { type: NzMessageService },
    { type: GKDataService },
    { type: GKModalService }
];
UploadComponent.propDecorators = {
    xFormControl: [{ type: Input }]
};

class GKIOModule {
}
GKIOModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    IOComponent,
                    NumberComponent,
                    CheckboxComponent,
                    TimePickerComponent,
                    UploadComponent,
                ],
                imports: [
                    CommonModule,
                    BrowserModule,
                    FormsModule,
                    ReactiveFormsModule,
                    NzModalModule,
                    NzToolTipModule,
                    NzGridModule,
                    NzFormModule,
                    NzTagModule,
                    NzInputModule,
                    NzInputNumberModule,
                    NzSelectModule,
                    NzRateModule,
                    NzDatePickerModule,
                    NzUploadModule,
                    NzRadioModule,
                    NzCheckboxModule,
                    NzSwitchModule,
                    GKIconModule,
                    GKButtonModule,
                    GKEditorModule,
                ],
                exports: [
                    NumberComponent,
                    TimePickerComponent,
                    IOComponent,
                ],
            },] }
];

class GKEditor {
    constructor(settings = {}) {
        const defaultConfig = {
            height: 300,
            placeholder: '请输入正文',
            menus: ['head', 'bold', 'italic', 'list', 'justify', 'link', 'image', 'foreColor', 'undo'],
            // 以下为修改默认值
            customAlert: (message, type) => {
                switch (type) {
                    case 'success':
                        this.message.success(message);
                        break;
                    case 'info':
                        this.message.info(message);
                        break;
                    case 'warning':
                        this.message.warning(message);
                        break;
                    case 'error':
                        this.message.error(message);
                        break;
                    default:
                        this.message.info(message);
                        break;
                }
            },
            showFullScreen: false,
            showLinkImg: false,
        };
        this.config = util.merge({}, defaultConfig, util.pick(settings, Object.keys(defaultConfig)));
        if (settings.menus) {
            this.config.menus = settings.menus;
        }
        this.options = util.merge({}, util.pick(settings, ['ossServerUrl', 'ossPublic']));
    }
}

class GKInfoStatusText {
    constructor(text, status) {
        this.text = text;
        this.status = status;
    }
}
class GKInfoTextBase {
    constructor(config = {}) {
        this.controlMode = 'info';
        this.controlType = 'infoText';
        this.config = {
            textType: 'singel',
            tips: false,
        };
        util.merge(this.config, config);
        // if (this.config.textType === 'multi') {
        //     this.config.tips = false;
        // }
    }
}
class GKInfoRateBase {
    constructor(config = {}) {
        this.controlMode = 'info';
        this.controlType = 'infoRate';
        this.config = {
            tooltips: [],
        };
        util.merge(this.config, config);
    }
}
class GKInfoTagsBase {
    constructor(config = {}) {
        this.controlMode = 'info';
        this.controlType = 'infoTags';
        this.config = {
            tagType: 'default',
        };
        util.merge(this.config, config);
    }
}
class GKInfoLinkBase {
    constructor(config = {}) {
        this.controlMode = 'info';
        this.controlType = 'infoLink';
        this.config = {};
        util.merge(this.config, config);
    }
}
class GKInfoImgBase {
    constructor(config = {}) {
        this.controlMode = 'info';
        this.controlType = 'infoImg';
        this.config = {};
        util.merge(this.config, config);
    }
}
class GKInfoCustomBase {
    constructor(config) {
        this.controlMode = 'info';
        this.controlType = 'infoCustom';
        this.config = {
            render: undefined,
        };
        util.merge(this.config, config);
    }
}
class GKInfoEditorBase {
    constructor(config = {}) {
        this.controlMode = 'info';
        this.controlType = 'infoEditor';
        this.config = {};
        util.merge(this.config, config);
        // 因为富文本作为展示的话，则不需要任何额外的配置
        this.edit = new GKEditor();
    }
}

class GKFormBaseInter {
}
class GKFormTextBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formText';
        this.config = {
            placeholder: '请输入',
        };
        util.merge(this.config, config);
    }
}
class GKFormTextareaBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formTextarea';
        this.config = {
            placeholder: '请输入',
            noResize: false,
            autoSize: false,
        };
        util.merge(this.config, config);
    }
}
class GKFormNumberBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formNumber';
        this.config = {
            placeholder: '请输入',
            negative: true,
            point: true,
        };
        util.merge(this.config, config);
        if (this.config.max !== undefined) {
            this.config.validas = util.array(this.config.validas);
            this.config.validas.unshift({
                tip: `不能大于${this.config.max}`,
                handler: (control) => {
                    return control.value !== null && control.value > this.config.max;
                },
            });
        }
        if (this.config.min !== undefined) {
            this.config.validas = util.array(this.config.validas);
            this.config.validas.unshift({
                tip: `不能小于${this.config.min}`,
                handler: (control) => {
                    return control.value !== null && control.value < this.config.min;
                },
            });
        }
    }
}
class GKFormPasswordBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formPassword';
        this.showPassword = false;
        this.config = {
            placeholder: '请输入',
        };
        util.merge(this.config, config);
    }
}
class GKFormSwitchBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formSwitch';
        this.config = {
            disabled: false,
        };
        util.merge(this.config, config);
    }
}
class GKFormRadioBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formRadio';
        this.config = {
            options: [],
        };
        util.merge(this.config, config);
    }
}
class GKFormCheckboxBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formCheckbox';
        this.config = {
            options: [],
        };
        util.merge(this.config, config);
    }
}
class GKFormSelectBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formSelect';
        this.list = [];
        this.loading = false;
        this.links = [];
        this.config = {
            mode: 'default',
            search: false,
        };
        util.merge(this.config, config);
        this.list = this.config.options || [];
    }
}
class GKFormRateBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formRate';
        this.config = {
            allowHalf: false,
            tooltips: [],
        };
        util.merge(this.config, config);
    }
}
class GKFormDateBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formDate';
        this.config = {
            mode: 'date',
        };
        util.merge(this.config, config);
        this.disabledDateFunc = getDisabledDateTextFunc(this.config.disabledDate);
    }
}
class GKFormDateRangeBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formDateRange';
        this.config = {
            mode: 'date',
        };
        util.merge(this.config, config);
        this.disabledAndMaxDateFunc = getDisabledAndMaxDateFunc(this.config.disabledDate, this.config.maxRange);
        this.fastRanges = gteFastRanges(this.config.fastRange);
    }
}
class GKFormAgreeBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formAgree';
        this.config = {
            content: [],
        };
        util.merge(this.config, config);
    }
}
class GKFormUploadBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formUpload';
        this.nzFileList = [];
        this.previewImage = '';
        this.config = {
            type: 'signle',
            mode: 'server',
            fileType: 'default',
            showUploadList: true,
            serverConfig: {
                url: '',
                fileKey: 'file',
            },
        };
        util.merge(this.config, config);
    }
}
class GKFormEditorBase {
    constructor(config = {}) {
        this.controlMode = 'form';
        this.controlType = 'formEditor';
        this.config = {};
        util.merge(this.config, config);
        this.edit = new GKEditor(this.config);
    }
}
function getDisabledDateTextFunc(disabledDate) {
    let disabledDateFunc;
    if (disabledDate) {
        if (typeof disabledDate === 'function') {
            disabledDateFunc = disabledDate;
        }
        if (disabledDate === 'history') {
            disabledDateFunc = (date) => dayjs(date).isBefore(dayjs().startOf('day'));
        }
        if (disabledDate === 'history-today') {
            disabledDateFunc = (date) => dayjs(date).isBefore(dayjs().add(1, 'day').startOf('day'));
        }
        if (disabledDate === 'future') {
            disabledDateFunc = (date) => dayjs(date).isAfter(dayjs().endOf('day'));
        }
        if (disabledDate === 'future-today') {
            disabledDateFunc = (date) => dayjs(date).isAfter(dayjs().subtract(1, 'day').endOf('day'));
        }
    }
    return disabledDateFunc;
}
function getDisabledAndMaxDateFunc(disabledDate, maxRange) {
    const disabledDateFunc = getDisabledDateTextFunc(disabledDate);
    if (!maxRange) {
        return () => disabledDateFunc;
    }
    if (!/^\d+(D|W|M|Y)$/.test(maxRange)) {
        throw new Error('maxRange 需配置为 数字+单位 例如 \'10D\' 代表10天');
    }
    const maxNumber = Number(maxRange.slice(0, -1));
    const timeMode = { D: 'd', W: 'w', M: 'M', Y: 'y' }[maxRange.slice(-1)];
    return (nzRangePicker) => {
        const maxRangeFunc = (date) => {
            const datePickerValue = nzRangePicker.datePickerService.value;
            const focusDates = datePickerValue.filter((v) => !!v).map((d) => d.nativeDate);
            if (focusDates.length === 0) {
                return false;
            }
            else if (focusDates.length === 1) {
                const clickDayjs = dayjs(focusDates[0]).startOf('day');
                return Math.abs(dayjs(date).diff(clickDayjs, timeMode)) >= maxNumber;
            }
            else {
                const startDayjs = dayjs(focusDates[0]).startOf('day');
                const endDayjs = dayjs(focusDates[1]).startOf('day');
                return Math.abs(dayjs(date).diff(startDayjs, timeMode)) >= maxNumber ||
                    Math.abs(dayjs(date).diff(endDayjs, timeMode)) >= maxNumber;
            }
        };
        return (date) => (disabledDateFunc ? disabledDateFunc(date) : false) || maxRangeFunc(date);
    };
}
function gteFastRanges(fastRange) {
    if (!fastRange) {
        return undefined;
    }
    const config = {};
    for (const node of fastRange) {
        if (node === 'week-c') {
            config.本周 = [dayjs().startOf('week').toDate(), dayjs().endOf('week').toDate()];
        }
        else if (node === 'week-h') {
            config.过去一周 = [dayjs().subtract(7, 'day').toDate(), dayjs().subtract(1, 'day').toDate()];
        }
        else if (node === 'week-h-c') {
            config['过去一周（包含今天）'] = [dayjs().subtract(6, 'day').toDate(), dayjs().toDate()];
        }
        else if (node === 'week-f') {
            config.未来一周 = [dayjs().add(1, 'day').toDate(), dayjs().add(7, 'day').toDate()];
        }
        else if (node === 'week-f-c') {
            config['未来一周（包含今天)'] = [dayjs().toDate(), dayjs().add(6, 'day').toDate()];
        }
        else if (node === 'month-c') {
            config.本月 = [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()];
        }
        else if (node === 'month-h') {
            config.过去一月 = [dayjs().subtract(30, 'day').toDate(), dayjs().subtract(1, 'day').toDate()];
        }
        else if (node === 'month-h-c') {
            config['过去一月（包含今天)'] = [dayjs().subtract(29, 'day').toDate(), dayjs().toDate()];
        }
        else if (node === 'month-f') {
            config.未来一月 = [dayjs().add(1, 'day').toDate(), dayjs().add(30, 'day').toDate()];
        }
        else if (node === 'month-f-c') {
            config['未来一月（包含今天)'] = [dayjs().toDate(), dayjs().add(29, 'day').toDate()];
        }
        else {
            config[node.label] = node.range;
        }
    }
    return config;
}

function getGKIOItemBase(control) {
    if (typeof control === 'string') {
        return {
            infoText: new GKInfoTextBase(),
            infoRate: new GKInfoRateBase(),
            infoTags: new GKInfoTagsBase(),
            infoLink: new GKInfoLinkBase(),
            infoImg: new GKInfoImgBase(),
            infoEditor: new GKInfoEditorBase(),
            formText: new GKFormTextBase(),
            formTextarea: new GKFormTextareaBase(),
            formNumber: new GKFormNumberBase(),
            formPassword: new GKFormPasswordBase(),
            formSwitch: new GKFormSwitchBase(),
            formRadio: new GKFormRadioBase(),
            formCheckbox: new GKFormCheckboxBase(),
            formSelect: new GKFormSelectBase(),
            formRate: new GKFormRateBase(),
            formDate: new GKFormDateBase(),
            formDateRange: new GKFormDateRangeBase(),
            formAgree: new GKFormAgreeBase(),
            fromUpload: new GKFormUploadBase(),
            formEditor: new GKFormEditorBase(),
        }[control];
    }
    return control;
}
class GKIOPropItem {
    constructor(prop, controls, options = {}) {
        this.prop = prop;
        this.options = options;
        this.onlyInfo = false;
        if (Array.isArray(controls)) {
            for (const control of controls) {
                const controlObj = getGKIOItemBase(control);
                if (controlObj.controlMode === 'info') {
                    this.infoControl = controlObj;
                }
                else if (controlObj.controlMode === 'form') {
                    this.formControl = controlObj;
                }
            }
        }
        else {
            this.infoControl = getGKIOItemBase(controls);
        }
        if (!this.formControl) {
            this.onlyInfo = true;
        }
    }
}
class GKIOLabelBlock {
    constructor(label, propItems, options = {}) {
        this.label = label;
        this.propItems = propItems;
        this.options = {
            grid: 1,
        };
        util.merge(this.options, options);
    }
}
class GKIOItem {
    constructor(label, prop, controls, options = {}) {
        this.itemType = 'item';
        const propItemOptions = util.pick(options, ['filter']);
        const propItems = [new GKIOPropItem(prop, controls, propItemOptions)];
        const labelBlockOptions = util.pick(options, ['grid']);
        this.labelBlock = new GKIOLabelBlock(label, propItems, labelBlockOptions);
    }
}
class GKIOGroupItem {
    constructor(prop, controls, options = {}) {
        this.prop = prop;
        this.controls = controls;
        this.options = options;
    }
}
class GKIOGroup {
    constructor(label, propControls, options = {}) {
        this.label = label;
        this.itemType = 'group';
        const propItems = propControls.map((item) => {
            return new GKIOPropItem(item.prop, item.controls, item.options);
        });
        this.labelBlock = new GKIOLabelBlock(label, propItems, options);
    }
}

class GKIOControl {
    constructor(list, options = {}) {
        this.list = list;
        this.mode = 'info';
        this.propMetas = {};
        this.options = {
            defaultMode: 'info',
            gridCount: 2,
            labelWidth: '85px',
        };
        this.mode = options.defaultMode || 'info';
        this.labelBlocks = list.map((item) => item.labelBlock);
        util.merge(this.options, options);
        this.getFormGroup();
    }
    getFormGroup() {
        var _a;
        if (this.formGroup) {
            return this.formGroup;
        }
        const fb = new FormBuilder();
        this.propMetas = {};
        const group = {};
        for (const labelBlock of this.labelBlocks) {
            for (const propItem of labelBlock.propItems) {
                this.propMetas[propItem.prop] = propItem;
                if (propItem.onlyInfo) {
                    continue;
                }
                const validas = util.array(propItem.formControl.config.validas || [])
                    .map((v, index) => {
                    if (typeof v === 'object') {
                        return (control) => {
                            if (!this.formGroup) {
                                return null;
                            }
                            const isError = v.handler(control, this.formGroup);
                            return isError ? { [`valida-${index}`]: v.tip } : null;
                        };
                    }
                    return v;
                });
                if (propItem.formControl.config.required) {
                    const required = propItem.formControl.config.required;
                    if (typeof required === 'boolean') {
                        if (!validas.includes(Validators.required)) {
                            validas.unshift(Validators.required);
                        }
                    }
                    else if (typeof required === 'string') {
                        validas.unshift((control) => {
                            if (!this.formGroup) {
                                return null;
                            }
                            return (Array.isArray(control.value) && control.value.length === 0) ||
                                [null, undefined, ''].includes(control.value) ? { 'valida-required-custom': required } : null;
                        });
                    }
                }
                const asyncValidas = util.array(((_a = propItem.formControl) === null || _a === void 0 ? void 0 : _a.config.asyncValidas) || [])
                    .map((v, index) => {
                    if (typeof v === 'object') {
                        return (control) => {
                            if (!this.formGroup) {
                                return Promise.resolve(null);
                            }
                            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                let asyncFunc = v.handler(control, this.formGroup);
                                if (asyncFunc instanceof Observable) {
                                    asyncFunc = asyncFunc.toPromise();
                                }
                                const isError = yield asyncFunc;
                                resolve(isError ? { [`valida-async-${index}`]: v.tip } : null);
                            }));
                        };
                    }
                    return v;
                });
                group[propItem.prop] = fb.control(null, validas, asyncValidas);
            }
        }
        this.formGroup = fb.group(group);
        return this.formGroup;
    }
    get(prop) {
        return this.propMetas[prop];
    }
    switchMode() {
        this.mode = this.mode === 'info' ? 'form' : 'info';
    }
}

function formatProp(prop) {
    if (typeof prop === 'string') {
        return {
            prop,
            format: undefined,
        };
    }
    else {
        return {
            prop: 'RandomProp' + String(Math.ceil(Math.random() * 100000000)),
            format: prop,
        };
    }
}
class GKInfoText {
    constructor(label, props, grid = 1, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioItem = new GKIOItem(label, prop, new GKInfoTextBase(Object.assign(Object.assign({}, config), { format })), {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoRate {
    constructor(label, props, grid = 1, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioItem = new GKIOItem(label, prop, new GKInfoRateBase(Object.assign(Object.assign({}, config), { format })), {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoTags {
    constructor(label, props, grid = 1, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioItem = new GKIOItem(label, prop, new GKInfoTagsBase(Object.assign(Object.assign({}, config), { format })), {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoLink {
    constructor(label, props, grid = 1, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioItem = new GKIOItem(label, prop, new GKInfoLinkBase(Object.assign(Object.assign({}, config), { format })), {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoImg {
    constructor(label, props, grid = 1, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioItem = new GKIOItem(label, prop, new GKInfoImgBase(Object.assign(Object.assign({}, config), { format })), {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoCustom {
    constructor(label, props, render, grid = 1, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioItem = new GKIOItem(label, prop, new GKInfoCustomBase(Object.assign(Object.assign({}, config), { format,
            render })), {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoGroupText {
    constructor(props, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioGroupItem = new GKIOGroupItem(prop, new GKInfoTextBase(Object.assign(Object.assign({}, config), { format })), {
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoGroupRate {
    constructor(props, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioGroupItem = new GKIOGroupItem(prop, new GKInfoRateBase(Object.assign(Object.assign({}, config), { format })), {
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoGroupTags {
    constructor(props, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioGroupItem = new GKIOGroupItem(prop, new GKInfoTagsBase(Object.assign(Object.assign({}, config), { format })), {
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoGroupLink {
    constructor(props, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioGroupItem = new GKIOGroupItem(prop, new GKInfoLinkBase(Object.assign(Object.assign({}, config), { format })), {
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoGroupImg {
    constructor(props, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioGroupItem = new GKIOGroupItem(prop, new GKInfoImgBase(Object.assign(Object.assign({}, config), { format })), {
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoGroupCustom {
    constructor(props, render, config = {}, options = {}) {
        const { prop, format } = formatProp(props);
        this.ioGroupItem = new GKIOGroupItem(prop, new GKInfoCustomBase(Object.assign(Object.assign({}, config), { format,
            render })), {
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}
class GKInfoMix {
    constructor(label, group, grid = 1, options = {}) {
        const ioGroupItems = group.map((item) => item.ioGroupItem);
        this.ioGroup = new GKIOGroup(label, ioGroupItems, {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(data) : undefined,
        });
    }
}

class InfoComponent {
    constructor() {
        this.infoFormControl = new GKIOControl([]);
        this.infoFormGroup = new FormGroup({});
        this.data = {};
        this.options = {};
    }
    get structure() { return this._structure; }
    set structure(newVal) {
        this._structure = newVal;
        this.infoFormControl = new GKIOControl(this._structure.map((item) => item instanceof GKInfoMix ? item.ioGroup : item.ioItem), {
            defaultMode: 'info',
            gridCount: this.options.gridCount || 2,
            labelWidth: this.options.labelWidth || '100px',
        });
        this.infoFormGroup = this.infoFormControl.getFormGroup();
    }
    ngOnInit() {
    }
}
InfoComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-info',
                template: "<gk-io [control]=\"infoFormControl\" [data]=\"data\"></gk-io>\n",
                styles: [""]
            },] }
];
InfoComponent.ctorParameters = () => [];
InfoComponent.propDecorators = {
    structure: [{ type: Input }],
    data: [{ type: Input }]
};

class GKInfoModule {
}
GKInfoModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    InfoComponent,
                ],
                imports: [
                    GKIOModule,
                ],
                exports: [
                    InfoComponent,
                ],
            },] }
];

class FormComponent {
    constructor() {
        this.infoFormControl = new GKIOControl([]);
        this.infoFormGroup = new FormGroup({});
        this.data = {};
    }
    get controls() { return this._controls; }
    set controls(newVal) {
        this._controls = newVal;
        this.infoFormControl = this._controls.IOControls;
        this.infoFormGroup = this.infoFormControl.getFormGroup();
    }
    ngOnInit() {
    }
}
FormComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-form',
                template: "<gk-io [control]=\"infoFormControl\" [data]=\"data\"></gk-io>\n",
                styles: [""]
            },] }
];
FormComponent.ctorParameters = () => [];
FormComponent.propDecorators = {
    controls: [{ type: Input }],
    data: [{ type: Input }]
};

class GKFormModule {
}
GKFormModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    FormComponent,
                ],
                imports: [
                    GKIOModule,
                ],
                exports: [
                    FormComponent,
                ],
            },] }
];

class SearchComponent {
    constructor(service) {
        this.service = service;
        this.debounceTime = 0.3 * 1000;
        this.search$$ = new Subject();
        this.search$ = this.search$$.pipe(debounceTime(this.debounceTime), tap((formGroup) => {
            this.searchEvent.emit(formGroup);
        }));
        this.searchEvent = new EventEmitter();
        this.resetEvent = new EventEmitter();
    }
    get searchs() { return this._searchs; }
    set searchs(newVal) {
        this._searchs = newVal;
        this.searchForm = newVal.formGroup;
        for (const item of this.searchs.list) {
            if (item.type === 'select') {
                this.service.optionHandler(item.prop, item.formControl, this.searchForm);
            }
            if (item.type === 'mix') {
                this.service.optionHandler(item.content[0].prop, item.content[0].formControl, this.searchForm);
            }
        }
    }
    onClickSearch() {
        this.search$$.next(this.searchForm.value);
    }
    onClickReset() {
        return __awaiter(this, void 0, void 0, function* () {
            this.searchForm.reset();
            if (this.searchs.initValue) {
                this.searchForm.patchValue(this.searchs.initValue);
            }
            yield util.sleep(0);
            this.resetEvent.emit();
        });
    }
    ngOnInit() {
    }
}
SearchComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-search',
                template: "<div class=\"gk-search-container\">\n    <form nz-form [formGroup]=\"searchForm\" class=\"gk-search-from\">\n        <div nz-row [nzGutter]=\"24\" class=\"row\">\n            <ng-container *ngFor=\"let item of searchs.list\">\n                <div nz-col [nzSpan]=\"item.grid * 8\">\n                    <nz-form-item>\n                        <nz-form-label [style.width]=\"searchs.options.labelWidth\">{{ item.label }}</nz-form-label>\n\n                        <ng-container *ngIf=\"item.type !== 'mix'\">\n                            <nz-form-control>\n                                <ng-container *ngIf=\"item.type === 'text'\">\n                                    <input nz-input [formControlName]=\"item.prop\" [placeholder]=\"item.placeholder\" />\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.type === 'number'\">\n                                    <gk-number [formControlName]=\"item.prop\" [xFormControl]=\"item.formControl\">\n                                    </gk-number>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.type === 'select'\">\n                                    <nz-select [formControlName]=\"item.prop\" [nzMode]=\"item.formControl.config.mode\"\n                                        [nzShowSearch]=\"item.formControl.config.search\"\n                                        [nzLoading]=\"item.formControl.loading\" nzAllowClear\n                                        [nzPlaceHolder]=\"item.formControl.config.placeholder || '\u8BF7\u9009\u62E9'\">\n                                        <nz-option *ngFor=\"let option of item.formControl.list\" [nzLabel]=\"option.label\"\n                                            [nzValue]=\"option.value\">\n                                        </nz-option>\n                                    </nz-select>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.type === 'date'\">\n                                    <gk-time-picker [formControlName]=\"item.prop\" [xFormControl]=\"item.formControl\">\n                                    </gk-time-picker>\n                                </ng-container>\n\n                                <ng-container *ngIf=\"item.type === 'dateRange'\">\n                                    <gk-time-picker [formControlName]=\"item.prop\" [xFormControl]=\"item.formControl\">\n                                    </gk-time-picker>\n                                </ng-container>\n                            </nz-form-control>\n\n                        </ng-container>\n\n                        <ng-container *ngIf=\"item.type === 'mix'\">\n                            <nz-form-control>\n                                <nz-input-group nzCompact>\n                                    <nz-select [formControlName]=\"item.content[0].prop\"\n                                        [nzMode]=\"item.content[0].formControl.config.mode\"\n                                        [nzShowSearch]=\"item.content[0].formControl.config.search\"\n                                        [nzLoading]=\"item.content[0].formControl.loading\" nzAllowClear\n                                        [nzPlaceHolder]=\"item.content[0].formControl.config.placeholder || '\u8BF7\u9009\u62E9'\"\n                                        [style.width]=\"item.config.firstWidth\">\n                                        <nz-option *ngFor=\"let option of item.content[0].formControl.list\"\n                                            [nzLabel]=\"option.label\" [nzValue]=\"option.value\">\n                                        </nz-option>\n                                    </nz-select>\n                                    <input nz-input [formControlName]=\"item.content[1].prop\"\n                                        [placeholder]=\"item.content[1].placeholder\"\n                                        [style.width]=\"'calc(100% - ' + item.config.firstWidth + ')'\" />\n                                </nz-input-group>\n                            </nz-form-control>\n                        </ng-container>\n                    </nz-form-item>\n                </div>\n            </ng-container>\n\n            <div nz-col [nzSpan]=\"8\">\n                <nz-form-item class=\"search-area\">\n                    <nz-form-label style=\"visibility: hidden;\" [style.width]=\"searchs.options.labelWidth\">\n                    </nz-form-label>\n                    <gk-button type=\"primary\" class=\"search-btn\" (click)=\"onClickSearch()\">{{ searchs.options.searchText\n                        }}</gk-button>\n                    <gk-button (click)=\"onClickReset()\">{{ searchs.options.resetText }}</gk-button>\n                </nz-form-item>\n            </div>\n        </div>\n    </form>\n\n    <ng-container *ngIf=\"search$ | async\"></ng-container>\n</div>\n",
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}.gk-search-container{margin-bottom:8px;margin-top:8px}.gk-search-container .gk-search-from{margin-bottom:-16px}.gk-search-container .gk-search-from .ant-form-item{margin-bottom:16px}.gk-search-container .gk-search-from .search-area .search-btn{margin-right:8px}"]
            },] }
];
SearchComponent.ctorParameters = () => [
    { type: IOService }
];
SearchComponent.propDecorators = {
    searchs: [{ type: Input }],
    searchEvent: [{ type: Output }],
    resetEvent: [{ type: Output }]
};

class GKSearchModule {
}
GKSearchModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    SearchComponent,
                ],
                imports: [
                    CommonModule,
                    BrowserModule,
                    FormsModule,
                    ReactiveFormsModule,
                    NzFormModule,
                    NzInputModule,
                    NzSelectModule,
                    GKIOModule,
                    GKButtonModule,
                ],
                exports: [
                    SearchComponent,
                ],
            },] }
];

const ɵ0 = defaultTableConf;
class GKListModule {
}
GKListModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    TableComponent,
                    ListComponent,
                ],
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    NzInputModule,
                    NzTabsModule,
                    NzInputNumberModule,
                    NzDatePickerModule,
                    NzSelectModule,
                    NzTableModule,
                    NzToolTipModule,
                    NzTagModule,
                    NzModalModule,
                    NzRateModule,
                    NzFormModule,
                    NzRateModule,
                    NzGridModule,
                    NzTagModule,
                    NzMessageModule,
                    NzSwitchModule,
                    GKIconModule,
                    GKButtonModule,
                    GKModalModule,
                    GKPanelModule,
                    GKIOModule,
                    GKInfoModule,
                    GKFormModule,
                    GKSearchModule,
                ],
                exports: [
                    TableComponent,
                    ListComponent,
                ],
                providers: [{ provide: GK_TABLE_CONF, useValue: ɵ0 }],
            },] }
];

class EchartLineData {
    constructor(data) {
        this.xAxis = {
            data: [],
        };
        this.yAxis = {
            type: 'value',
        };
        this.series = [];
        this.xAxis.data = data.xAxis;
        this.series = data.series.map(item => {
            return {
                type: 'line',
                name: item.name,
                data: item.value,
                lineStyle: {},
                areaStyle: {},
                emphasis: {
                    itemStyle: {},
                },
            };
        });
    }
}
class EchartLineConfig {
    constructor(config) {
        this.xAxis = {
            axisTick: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: '#E7E7E7',
                },
            },
            axisLabel: {
                color: '#000',
                fontWeight: 400,
            },
        };
        this.yAxis = {
            splitLine: {
                lineStyle: { type: 'dashed' },
            },
            scale: false,
        };
        this.legend = {
            bottom: '0',
            icon: 'rect',
            itemWidth: 16,
            itemHeight: 4,
        };
        this.tooltip = {
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,0.75)',
            textStyle: {
                color: '#fff',
            },
        };
        this.color = ['#4F9AFF', '#FFB257', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
        if (config.yAxisScale) {
            this.yAxis.scale = true;
        }
    }
}
class EchartLineOption {
    constructor(data, config) {
        this.blue = ['#4F9AFF', new graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(84,159,255,0.42)',
                }, {
                    offset: 1,
                    color: 'rgba(79,154,255,0)',
                }])];
        this.orange = ['#FFB257', new graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(254,218,172,0.39)',
                }, {
                    offset: 1,
                    color: 'rgba(255,178,87,0)',
                }])];
        this.colorGroup = [this.blue, this.orange];
        const option = util.merge(data, new EchartLineConfig(config));
        let color;
        if (config && config.color) {
            color = this[config.color];
            option.color = this[config.color][0];
        }
        option.series.forEach((item, index) => {
            if (color) {
                item.lineStyle.color = color[0];
                item.areaStyle.color = color[1];
                item.emphasis.itemStyle.color = color[0];
                item.emphasis.itemStyle.borderColor = color[0];
            }
            else {
                item.areaStyle.color = this.colorGroup[index][1];
                item.emphasis.itemStyle.color = this.colorGroup[index][0];
                item.emphasis.itemStyle.borderColor = this.colorGroup[index][0];
            }
        });
        return option;
    }
}

class EchartPieData {
    constructor(data) {
        this.series = [];
        const obj = {};
        obj.name = data.series[0].group;
        obj.data = data.series.map(item => {
            return {
                name: item.name,
                value: item.value[0],
            };
        });
        this.series = [obj];
    }
}
class EchartPieConfig {
    constructor(config) {
        this.width = 'auto';
        this.height = 'auto';
        this.legend = {
            icon: 'circle',
            align: 'left',
            orient: 'vertical',
            // orient: 'horizontal',
            // topLeft
            // top: 'top',
            // left: 'left',
            // top
            // top: 'top',
            // left: 'center',
            // topRight
            // top: 'top',
            // left: 'right',
            // middleLeft
            // top: 'middle',
            // left: 'left',
            // middle
            // top: 'middle',
            // left: 'center',
            // middleRight
            top: 'middle',
            left: 'right',
        };
        this.tooltip = {
            trigger: 'item',
            borderWidth: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            textStyle: {
                color: '#fff',
            },
        };
        this.color = ['#4F9AFF', '#FFB257', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
        this.series = [{
                type: 'pie',
                radius: ['40%', '60%'],
                center: ['50%', '50%'],
                labelLine: {
                    show: false,
                },
                label: {
                    show: false,
                    position: 'center',
                },
            }];
        this.width = config.width ? config.width : this.width;
        this.height = config.height ? config.height : this.height;
        this.legend.orient = config.orient ? config.orient : this.legend.orient;
        this.color = config.colorGroup ? config.colorGroup : this.color;
        this.series[0].center = config.center ? config.center : this.series[0].center;
    }
}
class EchartPieOption {
    dataGroup(option) {
        const dataMap = {};
        let valueSum = 0;
        let maxName;
        let max = 0;
        let left = 100;
        option.series[0].data.map((item, index) => {
            dataMap[item.name] = { value: item.value };
            if (typeof item.value === 'number') {
                valueSum += item.value;
            }
        });
        // tslint:disable-next-line: forin
        for (const key in dataMap) {
            const item = dataMap[key];
            const itemNumber = Number(((item.value / valueSum) * 100).toFixed(2));
            item.percent = itemNumber;
            left = Number((left - itemNumber).toFixed(2));
            if (item.value > max) {
                max = item.value;
                maxName = key;
            }
        }
        dataMap[maxName].percent = (dataMap[maxName].percent + left).toFixed(2);
        return { dataMap, valueSum };
    }
    constructor(data, config) {
        const option = util.merge(data, new EchartPieConfig(config));
        // 图例 文本formatter函数封装
        const { dataMap, valueSum } = this.dataGroup(option);
        if (config.legendFormatter) {
            option.legend.formatter = (name) => {
                return config.legendFormatter(name, dataMap[name].value, dataMap[name].percent + '%', valueSum);
            };
        }
        return option;
    }
}

// 注册必须的组件
use([TitleComponent$1, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]);
class ChartLineComponent {
    constructor() {
        this.config = {};
        this.resize = util.debounce(() => {
            this.gkChart.resize();
        }, 100);
    }
    get isHaveData() {
        return this.data && this.data.series.length > 0;
    }
    updateChart() {
        if (!this.isHaveData) {
            return;
        }
        this.echartData = new EchartLineData(this.data);
        this.eachartOption = new EchartLineOption(this.echartData, this.config);
        this.gkChart.setOption(this.eachartOption);
    }
    ngOnChanges(changes) {
        if (this.gkChart) {
            this.updateChart();
        }
    }
    ngOnInit() {
        const getDom = this.chart.nativeElement;
        this.gkChart = init(getDom);
        this.updateChart();
        window.addEventListener('resize', this.resize);
    }
    ngOnDestroy() {
        window.removeEventListener('resize', this.resize);
    }
}
ChartLineComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-chart-line',
                template: "<div [hidden]=\"isHaveData\" class=\"empty\">\u6682\u65E0\u6570\u636E</div>\n<div [hidden]=\"!isHaveData\" #chart style=\"width: 100%; height: 100%\"></div>\n",
                styles: [".empty{align-items:center;color:rgba(0,0,0,.25);display:flex;font-size:14px;height:100%;justify-content:center;line-height:1.5715;text-align:center;width:100%}"]
            },] }
];
ChartLineComponent.ctorParameters = () => [];
ChartLineComponent.propDecorators = {
    data: [{ type: Input }],
    chart: [{ type: ViewChild, args: ['chart', { static: true },] }],
    config: [{ type: Input }]
};

// 注册必须的组件
use([TitleComponent$1, TooltipComponent, GridComponent, LegendComponent, PieChart, CanvasRenderer]);
class ChartPieComponent {
    constructor() {
        this.config = {};
        this.resize = util.debounce(() => {
            this.gkChart.resize();
        }, 100);
    }
    get isHaveData() {
        return this.data && this.data.series.length > 0;
    }
    updateChart() {
        if (!this.isHaveData) {
            return;
        }
        this.echartData = new EchartPieData(this.data);
        this.eachartOption = new EchartPieOption(this.echartData, this.config);
        this.gkChart.setOption(this.eachartOption);
    }
    ngOnChanges(changes) {
        if (this.gkChart) {
            this.updateChart();
        }
    }
    ngOnInit() {
        const getDom = this.chart.nativeElement;
        this.gkChart = init(getDom);
        this.updateChart();
        window.addEventListener('resize', this.resize);
    }
    ngOnDestroy() {
        window.removeEventListener('resize', this.resize);
    }
}
ChartPieComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-chart-pie',
                template: "<div [hidden]=\"isHaveData\" class=\"empty\">\u6682\u65E0\u6570\u636E</div>\n<div [hidden]=\"!isHaveData\" #chart style=\"width: 100%; height: 100%\"></div>\n",
                styles: [".empty{align-items:center;color:rgba(0,0,0,.25);display:flex;font-size:14px;height:100%;justify-content:center;line-height:1.5715;text-align:center;width:100%}"]
            },] }
];
ChartPieComponent.ctorParameters = () => [];
ChartPieComponent.propDecorators = {
    data: [{ type: Input }],
    chart: [{ type: ViewChild, args: ['chart', { static: true },] }],
    config: [{ type: Input }]
};

class GKChartModule {
}
GKChartModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ChartLineComponent,
                    ChartPieComponent,
                ],
                imports: [
                    CommonModule,
                ],
                exports: [
                    ChartLineComponent,
                    ChartPieComponent,
                ],
            },] }
];

class TipComponent {
    constructor(nzIcon) {
        this.nzIcon = nzIcon;
        this.trigger = 'hover';
        this.nzIcon.addIcon(QuestionCircleOutline);
    }
    ngOnInit() {
    }
}
TipComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-tip',
                template: "<gk-icon type=\"question-circle\" nz-tooltip [nzTooltipTitle]=\"tip\" [nzTooltipTrigger]=\"trigger\"></gk-icon>\n",
                styles: [""]
            },] }
];
TipComponent.ctorParameters = () => [
    { type: NzIconService }
];
TipComponent.propDecorators = {
    tip: [{ type: Input }],
    trigger: [{ type: Input }]
};

class GKTipModule {
}
GKTipModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    TipComponent,
                ],
                imports: [
                    CommonModule,
                    NzToolTipModule,
                    GKIconModule,
                ],
                exports: [
                    TipComponent,
                ],
            },] }
];

class TitleComponent {
    constructor() {
        this.title = '';
        this.tip = '';
    }
    ngOnInit() {
    }
}
TitleComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-title',
                template: "<div class=\"gk-title-container\">\n    <div class=\"gk-title-top\">\n        <h3 class=\"gk-title-top-text gk-flt\">{{ title }}</h3>\n        <gk-tip *ngIf=\"tip\" [tip]=\"tip\" class=\"gk-title-top-tip gk-flt\"></gk-tip>\n\n        <div class=\"gk-title-top-left gk-flt\">\n            <ng-content select=\"#title-left\"></ng-content>\n        </div>\n\n        <div class=\"gk-title-top-right gk-frt\">\n            <ng-content select=\"#title-right\"></ng-content>\n        </div>\n    </div>\n\n    <div class=\"gk-title-content-container\">\n        <ng-content></ng-content>\n    </div>\n</div>\n",
                styles: [".gk-title-top{height:32px;margin-bottom:10px}.gk-title-top .gk-title-top-text{border-left:2px solid #3266fb;display:inline-block;font-size:14px;font-weight:500;height:16px;line-height:16px;margin:8px 5px 8px 0;padding-left:5px}.gk-title-top .gk-title-top-tip{margin:5px 5px 5px 0}"]
            },] }
];
TitleComponent.ctorParameters = () => [];
TitleComponent.propDecorators = {
    title: [{ type: Input }],
    tip: [{ type: Input }]
};

class GKTitleModule {
}
GKTitleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    TitleComponent,
                ],
                imports: [
                    CommonModule,
                    GKTipModule,
                ],
                exports: [
                    TitleComponent,
                ],
            },] }
];

class GKFormText {
    constructor(label, prop, grid = 1, placeholder = '', config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormTextBase(Object.assign(Object.assign({}, config), { placeholder })),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormTextarea {
    constructor(label, prop, grid = 1, placeholder = '', config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormTextareaBase(Object.assign(Object.assign({}, config), { placeholder })),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormNumber {
    constructor(label, prop, grid = 1, placeholder = '', config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormNumberBase(Object.assign(Object.assign({}, config), { placeholder })),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormPassword {
    constructor(label, prop, grid = 1, placeholder = '', config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormPasswordBase(Object.assign(Object.assign({}, config), { placeholder })),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormSwitch {
    constructor(label, prop, grid = 1, config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormSwitchBase(Object.assign({}, config)),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormRadio {
    constructor(label, prop, grid = 1, config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormRadioBase(Object.assign({}, config)),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormCheckbox {
    constructor(label, prop, grid = 1, config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormCheckboxBase(Object.assign({}, config)),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormSelect {
    constructor(label, prop, grid = 1, placeholder = '', config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormSelectBase(Object.assign(Object.assign({}, config), { placeholder })),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormRate {
    constructor(label, prop, grid = 1, config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormRateBase(Object.assign({}, config)),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormDate {
    constructor(label, prop, grid = 1, placeholder = '', config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormDateBase(Object.assign(Object.assign({}, config), { placeholder })),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormDateRange {
    constructor(label, prop, grid = 1, config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormDateRangeBase(Object.assign({}, config)),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormAgree {
    constructor(label, prop, grid = 1, config, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormAgreeBase(Object.assign({}, config)),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormUpload {
    constructor(label, prop, grid = 1, config, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormUploadBase(Object.assign({}, config)),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormEditor {
    constructor(label, prop, grid = 1, config = {}, options = {}) {
        this.ioItem = new GKIOItem(label, prop, ['infoText', new GKFormEditorBase(Object.assign({}, config)),
        ], {
            grid,
            filter: options.filter ? (formGroup, data) => options.filter(formGroup) : undefined,
        });
    }
}
class GKFormControls {
    constructor(list, options = {}) {
        this.IOControls = new GKIOControl([]);
        this.IOControls = new GKIOControl(list.map((item) => item.ioItem), {
            defaultMode: 'form',
            gridCount: options.gridCount || 2,
            labelWidth: options.labelWidth || '85px',
        });
    }
    getFormGroup() {
        return this.IOControls.getFormGroup();
    }
    get(prop) {
        var _a;
        return (_a = this.IOControls.get(prop)) === null || _a === void 0 ? void 0 : _a.formControl;
    }
}

class GKSearchText {
    constructor(label, prop, grid = 1, placeholder = '请输入') {
        this.label = label;
        this.prop = prop;
        this.grid = grid;
        this.placeholder = placeholder;
        this.type = 'text';
    }
}
class GKSearchNumber {
    constructor(label, prop, grid = 1, placeholder = '请输入', config = {}) {
        this.label = label;
        this.prop = prop;
        this.grid = grid;
        this.placeholder = placeholder;
        this.type = 'number';
        this.formControl = new GKFormNumberBase(Object.assign(Object.assign({}, config), { placeholder }));
    }
}
class GKSearchSelect {
    constructor(label = '', prop, grid = 1, placeholder = '请选择', config = {}) {
        this.label = label;
        this.prop = prop;
        this.grid = grid;
        this.placeholder = placeholder;
        this.type = 'select';
        this.formControl = new GKFormSelectBase(Object.assign(Object.assign({}, config), { placeholder }));
    }
}
class GKSearchDate {
    constructor(label, prop, grid = 1, placeholder = '请选择日期', config = {}) {
        this.label = label;
        this.prop = prop;
        this.grid = grid;
        this.placeholder = placeholder;
        this.type = 'date';
        this.formControl = new GKFormDateBase(Object.assign(Object.assign({}, config), { placeholder }));
    }
}
class GKSearchDateRange {
    constructor(label, prop, grid = 2, config = {}) {
        this.label = label;
        this.prop = prop;
        this.grid = grid;
        this.type = 'dateRange';
        this.formControl = new GKFormDateRangeBase(config);
    }
}
class GKSearchDaterange extends GKSearchDateRange {
    constructor(label, prop, grid = 2, config = {}) {
        super(label, prop, grid, config);
    }
}
class GKSearchMix {
    constructor(label, content, grid = 1, config = {}) {
        this.label = label;
        this.grid = grid;
        this.type = 'mix';
        this.prop = '';
        this.config = {
            firstWidth: '30%',
        };
        const searchTextItem = typeof content[1] === 'string' ? new GKSearchText(undefined, content[1]) : content[1];
        this.content = [content[0], searchTextItem];
        util.merge(this.config, config);
    }
}
class GKSearch {
    constructor(list, options = {}, initValue) {
        this.list = list;
        this.initValue = initValue;
        this.options = {
            labelWidth: '70px',
            searchText: '查询',
            resetText: '重置',
        };
        util.merge(this.options, options);
        this.getFormGroup();
    }
    getFormGroup() {
        if (this.formGroup) {
            return this.formGroup;
        }
        const fb = new FormBuilder();
        const group = {};
        for (const item of this.list) {
            if (item.type !== 'mix') {
                group[item.prop] = fb.control(null);
            }
            else {
                for (const node of item.content) {
                    group[node.prop] = fb.control(null);
                }
            }
        }
        this.formGroup = fb.group(group);
        return this.formGroup;
    }
}

function isGKTable2CustomBtn1(btn) {
    return !!btn.btn;
}
function isGKTable2DeleteBtn(btn) {
    return btn.mode === 'delete';
}
class GKTable2 {
    constructor(config) {
        this.config = config;
        this.init = (that) => {
            this.component = that;
        };
        this.refresh = (init = true) => {
            this.component.ajaxData(init);
        };
    }
}

class Table2Component {
    constructor(gkReq, modalService) {
        this.gkReq = gkReq;
        this.modalService = modalService;
        /** 是否在组件加载时获取数据 */
        this.initLoad = true;
        /* 勾选 Input Output */
        this.checkTrs = [];
        this.checksChange = new EventEmitter(); // 勾选项发生变化
        /** 当前页码数 */
        this.pageIndex = 1;
        this.pageIndexChange = new EventEmitter();
        /** 当前每页条数 */
        this.pageSize = 0;
        this.pageSizeChange = new EventEmitter();
        this.pageSizeChanging = false;
        /* 当前排序状态 */
        this.sortState = null;
        this.expandTrSet = new Set();
        this.loading = false;
        this.total = 0;
        this.allList = [];
        this.sortList = [];
        this.showList = [];
        this.tableAjaxBefore = new EventEmitter();
        this.tableAjaxAfter = new EventEmitter();
    }
    get table() { return this._table; }
    set table(newVal) {
        this._table = newVal;
        const config = this.table.config;
        if (config.tdEllipsis === undefined) {
            config.tdEllipsis = true;
        }
        if (config.pageMode !== 'none') {
            if ((config.pageSizeOptions || []).length === 0) {
                config.pageSizeOptions = [config.defaultPageSize || 10];
            }
            config.defaultPageSize = config.defaultPageSize || config.pageSizeOptions[0];
            if (config.pageSizeOptions.includes(config.defaultPageSize)) {
                this.pageSize = config.defaultPageSize;
            }
            else {
                throw new Error('配置的 defaultPageSize 不在 pageSizeOptions 范围内');
            }
        }
        const ceilTypeList = config.columns.map((col) => {
            return col.type === 'group' ? col.content.map((ceil) => ceil.type) : [col.type];
        }).flat();
        const colCheckNumber = ceilTypeList.filter((type) => type === 'check').length;
        if (colCheckNumber > 1) {
            throw new Error('columns 配置中 check 类型最多配置一个');
        }
        const colExpandNumber = ceilTypeList.filter((type) => type === 'expand').length;
        if (colExpandNumber > 1) {
            throw new Error('columns 配置中 expand 类型最多配置一个');
        }
        for (const col of config.columns) {
            if (col.type === undefined) {
                col.type = 'default';
            }
            if (col.sort) {
                if (!col.sortKey) {
                    if (col.type !== 'group') {
                        if (!col.prop) {
                            throw new Error('表格列配置 使用了sort排序功能时，但未设置prop属性，此时必须指定sortKey值');
                        }
                        else {
                            col.sortKey = col.prop;
                        }
                    }
                    else {
                        throw new Error('group表格列配置 使用了sort排序功能时，需配置sortKey值');
                    }
                }
                if (config.pageMode !== 'server' && !config.sortFunc) {
                    throw new Error('使用了sort排序功能时，需配置sortFunc');
                }
                if (col.sort !== true) {
                    this.sortState = col.sort;
                    this.sortKey = col.sortKey;
                }
            }
            if (col.type === 'check') {
                col.width = col.width || '90px';
            }
            else if (col.type !== 'group') {
                this.handleConfig(col);
            }
            else {
                for (const ceil of col.content) {
                    this.handleConfig(ceil);
                }
            }
        }
    }
    handleConfig(config) {
        if (config.type === 'operate') {
            config.ceilStyle = util.merge({
                'margin-left': '-15px',
                'margin-right': '-15px',
            }, config.ceilStyle || {});
            config.__renderBtns__ = config.btns.map((btn) => {
                if (isGKTable2DeleteBtn(btn)) {
                    return this.createDeleteBtn(btn);
                }
                // GKTable2CustomBtnInter
                if (btn instanceof GKButton) {
                    return {
                        hide: undefined,
                        disabled: undefined,
                        onClick: undefined,
                        btn,
                    };
                }
                else if (isGKTable2CustomBtn1(btn)) {
                    return btn;
                }
                else {
                    const buttonConfig = Object.assign(Object.assign({}, btn), { disabled: undefined, onClick: undefined });
                    return {
                        hide: btn.hide,
                        disabled: btn.disabled,
                        onClick: btn.onClick,
                        btn: new GKButton(buttonConfig),
                    };
                }
            });
        }
        if (config.type === 'expand') {
            setTimeout(() => {
                this.expandRenderOut = config.expandRender();
            }, 0);
        }
        if (config.type === 'render') {
            setTimeout(() => {
                config.__renderOut__ = config.render();
            }, 0);
        }
    }
    get checks() { return this.checkTrs; }
    set checks(newVal) {
        if (this.checkTrs !== newVal) {
            this.checkTrs = newVal;
            this.checksChange.emit(newVal);
        }
    }
    /* 勾选事件及状态 */
    get checkHalf() {
        return this.checks.length > 0 && this.checks.length < this.showList.length;
    }
    get checkAll() {
        return this.checks.length > 0 && this.checks.length === this.showList.length;
    }
    onTrCheckChange(tr, col) {
        const index = this.checks.indexOf(tr);
        if (index > -1) {
            this.checks.splice(index, 1);
        }
        else {
            this.checks.push(tr);
        }
        this.checksChange.emit(this.checks);
        if (col.onTrCheckChange) {
            const afterChecked = index === -1;
            col.onTrCheckChange(afterChecked, tr);
        }
    }
    onPageCheckChange(checked, col) {
        if (checked) {
            this.checks = [...this.showList];
        }
        else {
            this.checks = [];
        }
        this.checksChange.emit(this.checks);
        if (col.onPageCheckChange) {
            col.onPageCheckChange(checked, this.showList);
        }
    }
    setPageIndex(index) {
        if (this.pageIndex !== index) {
            this.pageIndex = index;
            this.pageIndexChange.emit(this.pageIndex);
        }
    }
    onChangeIndex(index) {
        this.setPageIndex(index);
        if (this.pageSizeChanging) {
            return;
        }
        if (this.table.config.pageMode === 'local') {
            this.getLocalShowPage();
        }
        else if (this.table.config.pageMode === 'server') {
            this.ajaxData();
        }
    }
    setPageSize(size) {
        if (this.pageSize !== size) {
            this.pageSize = size;
            this.pageSizeChange.emit(this.pageSize);
        }
    }
    onChangeSize(size) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pageSizeChanging = true;
            this.setPageSize(size);
            yield util.sleep(0);
            this.setPageIndex(1);
            this.pageSizeChanging = false;
            if (this.table.config.pageMode === 'local') {
                this.getLocalShowPage();
            }
            else if (this.table.config.pageMode === 'server') {
                this.ajaxData();
            }
        });
    }
    get hideMorePageLastBtnClass() {
        if (!this.table.config.hideMorePageLastBtn ||
            this.table.config.pageMode !== 'server') {
            return false;
        }
        const maxPageIndex = Math.ceil(this.total / this.pageSize);
        return maxPageIndex >= 10 && maxPageIndex - this.pageIndex > 3;
    }
    onSortOrderChange(sortKey, sortState) {
        this.sortKey = sortKey;
        this.sortState = sortState;
        this.setPageIndex(1);
        if (this.table.config.pageMode === 'server') {
            this.ajaxData();
        }
        else {
            this.sortLocalList();
        }
    }
    get tableLayout() {
        return this.table.config.tdEllipsis ? 'fixed' : 'auto';
    }
    get layoutScroll() {
        const someColumnFixed = this.table.config.columns.some((col) => !!col.fixed);
        return someColumnFixed ? { x: this.table.config.scrollX || '100%' } : undefined;
    }
    ngOnInit() {
        this.table.init(this);
    }
    ngAfterViewInit() {
        if (this.initLoad) {
            setTimeout(() => {
                this.ajaxData();
            }, 0);
        }
    }
    ajaxData(init = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (init) {
                this.setPageIndex(1);
            }
            this.loading = true;
            try {
                this.tableAjaxBefore.emit();
                if (this.table.config.pageMode !== 'server') {
                    const list = yield this.table.config.source();
                    this.total = list.length;
                    this.allList = list;
                    this.sortLocalList();
                }
                else {
                    const pageSort = (this.sortKey && this.sortState) ?
                        `${this.sortKey}-${{ ascend: 'asc', descend: 'desc' }[this.sortState]}` :
                        undefined;
                    const params = { pageIndex: this.pageIndex, pageSize: this.pageSize, pageSort };
                    if (!params.pageSort) {
                        delete params.pageSort;
                    }
                    const resp = yield this.table.config.source(params);
                    const { list, pagination: { total } } = resp;
                    this.total = total;
                    this.showList = list;
                }
                this.checks = [];
                this.tableAjaxAfter.emit(true);
            }
            catch (error) {
                this.tableAjaxAfter.emit(false);
            }
            this.loading = false;
        });
    }
    sortLocalList() {
        this.sortList = [...this.allList];
        if (this.sortKey && this.sortState) {
            const sortFunc = this.table.config.sortFunc;
            this.sortList.sort((a, b) => {
                return sortFunc(this.sortKey, a, b) * { ascend: 1, descend: -1 }[this.sortState];
            });
        }
        if (this.table.config.pageMode === 'none') {
            this.showList = this.sortList;
        }
        else if (this.table.config.pageMode === 'local') {
            this.getLocalShowPage();
        }
    }
    getLocalShowPage() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            this.showList = this.sortList.slice(this.pageSize * (this.pageIndex - 1), this.pageSize * this.pageIndex);
            yield util.sleep(0.4 * 1000);
            this.loading = false;
        });
    }
    initModal() {
        this.modal = {
            show: false,
            width: '',
            title: '',
            type: '',
        };
    }
    // 把删除按钮转换成普通按钮
    createDeleteBtn(btn) {
        const ajaxFunc = (trData) => __awaiter(this, void 0, void 0, function* () {
            const [flag, resp] = yield new Promise((resolve) => {
                this.gkReq.request(btn.api, {
                    [btn.prop]: trData[btn.prop],
                }, true).subscribe({
                    next: (ajaxResp) => {
                        if (ajaxResp.body.code === 0) {
                            this.initModal();
                            resolve([true, ajaxResp]);
                        }
                        else {
                            resolve([false, ajaxResp]);
                        }
                    },
                    error: (error) => {
                        resolve([false, null]);
                    },
                });
            });
            if (flag) {
                const i = this.showList.indexOf(trData);
                this.showList.splice(i, 1);
                if (btn.refresh) {
                    this.table.refresh();
                }
            }
            if (btn.onAfterSubmit) {
                btn.onAfterSubmit(resp);
            }
        });
        const customBtn = {
            hide: btn.hide,
            disabled: btn.disabled,
            onClick: (trData) => {
                if (btn.tip) {
                    this.modal = {
                        show: true,
                        width: btn.width,
                        title: btn.title || btn.label || '删除',
                        type: 'text',
                        text: btn.tip === true ? '你确定要删除吗?' : btn.tip,
                        onCancel: () => {
                            this.initModal();
                        },
                        onOk: () => __awaiter(this, void 0, void 0, function* () {
                            if (btn.onBeforeSubmit) {
                                const flag = yield btn.onBeforeSubmit();
                                if (flag === false) {
                                    return;
                                }
                            }
                            yield ajaxFunc(trData);
                            this.initModal();
                        }),
                    };
                }
                else {
                    ajaxFunc(trData);
                }
            },
            btn: new GKButton({
                label: btn.label || '删除',
                icon: btn.icon,
            }),
        };
        return customBtn;
    }
}
Table2Component.decorators = [
    { type: Component, args: [{
                selector: 'gk-table2',
                template: "<nz-table #nzTable [nzData]=\"showList\" [nzLoading]=\"loading\" [nzFrontPagination]=\"false\" [nzTotal]=\"total\"\n    [nzShowPagination]=\"table.config.pageMode !== 'none'\" [nzPageIndex]=\"pageIndex\" [nzPageSize]=\"pageSize\"\n    (nzPageIndexChange)=\"onChangeIndex($event)\" (nzPageSizeChange)=\"onChangeSize($event)\"\n    [nzShowQuickJumper]=\"table.config.showQuickJumper\" [nzShowSizeChanger]=\"table.config.showSizeChanger\"\n    [nzPageSizeOptions]=\"table.config.pageSizeOptions\" [nzShowTotal]=\"totalTemplate\" [nzTableLayout]=\"tableLayout\"\n    [nzScroll]=\"layoutScroll\" class=\"gk-table-container\"\n    [ngClass]=\"{ 'hide-more-page-last-btn': hideMorePageLastBtnClass }\">\n    <thead>\n        <tr>\n            <ng-container *ngFor=\"let col of table.config.columns\">\n                <ng-container *ngIf=\"table.config.header === false\">\n                    <th [nzWidth]=\"col.width\" class=\"gk-table-hide-header-th\"></th>\n                </ng-container>\n                <ng-container *ngIf=\"table.config.header !== false\">\n                    <th *ngIf=\"col.type === 'check'\" [nzShowCheckbox]=\"true\" [nzIndeterminate]=\"checkHalf\"\n                        [nzChecked]=\"checkAll\" (nzCheckedChange)=\"onPageCheckChange($event, col)\" [nzWidth]=\"col.width\"\n                        [nzLeft]=\"col.fixed === 'left'\" [nzRight]=\"col.fixed === 'right'\"></th>\n                    <th *ngIf=\"col.type !== 'check'\" [nzWidth]=\"col.width\" [nzLeft]=\"col.fixed === 'left'\"\n                        [nzRight]=\"col.fixed === 'right'\" [nzShowSort]=\"!!col.sort\"\n                        [nzSortDirections]=\"['ascend', 'descend', null]\"\n                        [nzSortOrder]=\"sortKey === col.sortKey ? sortState : null\"\n                        (nzSortOrderChange)=\"onSortOrderChange(col.sortKey , $any($event))\">{{ col.title }}</th>\n                </ng-container>\n            </ng-container>\n        </tr>\n    </thead>\n\n    <tbody>\n        <ng-container *ngFor=\"let tr of nzTable.data; let index = index\">\n            <tr>\n                <ng-container *ngFor=\"let col of table.config.columns\">\n\n                    <td *ngIf=\"col.type === 'check'\" [nzEllipsis]=\"table.config.tdEllipsis\"\n                        [nzLeft]=\"col.fixed === 'left'\" [nzRight]=\"col.fixed === 'right'\" [ngStyle]=\"col.tdStyle\"\n                        [nzShowCheckbox]=\"!col.hide || !col.hide(tr, index)\"\n                        [nzDisabled]=\"col.disabled && !col.disabled(tr, index)\" [nzChecked]=\"checkTrs.includes(tr)\"\n                        (nzCheckedChange)=\"onTrCheckChange(tr, col)\">\n                    </td>\n\n                    <td *ngIf=\"col.type !== 'check'\" [nzEllipsis]=\"table.config.tdEllipsis\"\n                        [nzLeft]=\"col.fixed === 'left'\" [nzRight]=\"col.fixed === 'right'\" [ngStyle]=\"col.tdStyle\">\n\n                        <ng-container *ngIf=\"col.type !== 'group'\">\n                            <gk-ceil-type [config]=\"col\" [tr]=\"tr\" [index]=\"index\" [pageIndex]=\"pageIndex\"\n                                [pageSize]=\"pageSize\" [expandTrSet]=\"expandTrSet\"></gk-ceil-type>\n                        </ng-container>\n                        <ng-container *ngIf=\"col.type === 'group'\">\n                            <ng-container *ngFor=\"let config of col.content\">\n                                <gk-ceil-type [config]=\"config\" [tr]=\"tr\" [index]=\"index\" [pageIndex]=\"pageIndex\"\n                                    [pageSize]=\"pageSize\" [expandTrSet]=\"expandTrSet\"></gk-ceil-type>\n                            </ng-container>\n                        </ng-container>\n\n                    </td>\n\n                </ng-container>\n            </tr>\n            <tr *ngIf=\"expandRenderOut\" [nzExpand]=\"expandTrSet.has(tr)\">\n                <ng-container [ngTemplateOutlet]=\"expandRenderOut\"\n                    [ngTemplateOutletContext]=\"{ data: tr, rowIndex: index }\">\n                </ng-container>\n            </tr>\n        </ng-container>\n    </tbody>\n</nz-table>\n\n\n<ng-template #totalTemplate let-total>\n    <ng-container> \u5171 {{ total }} \u6761 </ng-container>\n</ng-template>\n\n<nz-modal *ngIf=\"modal\" [(nzVisible)]=\"modal.show\" [nzTitle]=\"modal.title\" [nzWidth]=\"modal.width || '500px'\"\n    [nzCentered]=\"modalService.center\" (nzOnCancel)=\"initModal()\" [nzMaskClosable]=\"false\" [nzKeyboard]=\"false\"\n    [nzAutofocus]=\"null\">\n    <ng-container *nzModalContent>\n        <ng-container *ngIf=\"modal.type === 'text'\">\n            {{ modal.text }}\n        </ng-container>\n        <ng-container *ngIf=\"modal.type === 'io'\">\n            <gk-io [control]=\"modal.ioControl\" [data]=\"modal.data\"></gk-io>\n        </ng-container>\n    </ng-container>\n    <div class=\"gk-modal-bottom\" *nzModalFooter>\n        <gk-button *ngIf=\"modal.onCancel\" [type]=\"'default'\" (click)=\"modal.onCancel()\" class=\"gk-btn\">{{ '\u53D6\u6D88'\n            }}</gk-button>\n        <gk-button *ngIf=\"modal.onOk\" [type]=\"'primary'\" [loading]=\"modal.ioControl?.formGroup.pending\"\n            (click)=\"modal.onOk()\" class=\"gk-btn\">{{ '\u786E\u5B9A'\n            }}</gk-button>\n    </div>\n</nz-modal>\n",
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}.ant-modal-footer{border-top:0;padding:8px 24px 32px}.ant-modal-body{padding:16px 24px 0}.gk-modal-bottom .gk-btn{margin-left:8px}.gk-modal-bottom .gk-btn:first-child{margin-left:0}.gk-table-container .ant-table,.gk-table-container .ant-table table{border-radius:0}.gk-table-container .gk-table-hide-header-th{height:1px;padding-bottom:0;padding-top:0}.gk-table-container .ant-table-container table>thead>tr:first-child th:first-child,.gk-table-container .ant-table-container table>thead>tr:first-child th:last-child{border-top-left-radius:0;border-top-right-radius:0}::ng-deep .ant-table-pagination.ant-pagination{margin:24px 0 0}::ng-deep .hide-more-page-last-btn .ant-table-pagination>li.ant-pagination-item:nth-last-of-type(2){display:none}"]
            },] }
];
Table2Component.ctorParameters = () => [
    { type: GKRequestService },
    { type: GKModalService }
];
Table2Component.propDecorators = {
    table: [{ type: Input }],
    initLoad: [{ type: Input }],
    checks: [{ type: Input }],
    checksChange: [{ type: Output }],
    pageIndexChange: [{ type: Output }],
    pageSizeChange: [{ type: Output }],
    tableAjaxBefore: [{ type: Output }],
    tableAjaxAfter: [{ type: Output }]
};

class CeilTypeComponent {
    constructor(nzIcon) {
        this.nzIcon = nzIcon;
        // tip end
        // switch start
        this.switchLoading = {};
        // image end
        // status start
        this.getStatusV = (config, tr, index) => {
            let icon = '';
            let pointColor = '';
            let pointSize = 8;
            let textColor = '';
            if (config.status) {
                const result = config.status(tr, config.prop, index);
                icon = result.icon || '';
                pointColor = result.pointColor || '';
                pointSize = result.pointSize || 8;
                textColor = result.textColor || '';
            }
            else if (config.point) {
                if (typeof config.point === 'function') {
                    pointColor = config.point(tr, config.prop, index);
                }
                else if (typeof config.point === 'object') {
                    pointColor = config.point.color(tr, config.prop, index);
                    if (config.point.size) {
                        pointSize = typeof config.point.size === 'number' ? config.point.size : config.point.size(tr, config.prop, index);
                    }
                }
            }
            return {
                icon,
                point: pointColor && {
                    style: {
                        'background-color': isGKStatus(pointColor) ? undefined : pointColor,
                        'width.px': pointSize || 8,
                        'height.px': pointSize || 8,
                    },
                    class: isGKStatus(pointColor) ? pointColor : '',
                },
                textStyle: {
                    color: textColor,
                },
            };
        };
        this.nzIcon.addIcon(MinusSquareOutline, PlusSquareOutline);
    }
    ngOnInit() {
    }
    getVal(prop, format, tr, index) {
        return format ? format(tr, prop, index, this.pageIndex, this.pageSize) : tr[prop || ''];
    }
    // expand start
    onExpandClick(config) {
        if (config.disabled && config.disabled(this.tr, config.prop, this.index)) {
            return;
        }
        if (this.expandTrSet.has(this.tr)) {
            this.expandTrSet.delete(this.tr);
        }
        else {
            this.expandTrSet.add(this.tr);
        }
    }
    // expand end
    // tip start
    getTipContent(tip, prop, tr, index) {
        return typeof tip === 'function' ? tip(tr, prop, index) : tip;
    }
    onClickSwitch(config, tr, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config.disabled && config.disabled(tr, config.prop, index)) {
                return;
            }
            const key = `${config.prop}-${index}`;
            this.switchLoading[key] = true;
            const flag = yield config.onSwitch(tr, config.prop, index);
            delete this.switchLoading[key];
        });
    }
    // switch end
    // image start
    getImageStyle(config) {
        var _a;
        let width;
        let height;
        const image = config.image;
        if (image) {
            if (image.width === undefined && image.height === undefined) {
                height = 40;
            }
            else {
                width = image.width;
                height = image.height;
            }
        }
        // const fill = image.fill !== undefined ? image.fill : (image.width !== undefined && image.height !== undefined ? true : false)
        const fill = (_a = image.fill) !== null && _a !== void 0 ? _a : false;
        return {
            [fill ? 'width.px' : 'max-width.px']: width,
            [fill ? 'height.px' : 'max-height.px']: height,
        };
    }
    isImagePreview(config) {
        return !config.image || config.image.preview !== false;
    }
}
CeilTypeComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-ceil-type',
                template: "<span *ngIf=\"!config.hide || !config.hide(tr, config.prop, index)\"\n    [ngClass]=\"['table-ceil', 'table-ceil-' + config.type]\" [ngStyle]=\"config.ceilStyle\" nz-tooltip\n    [nzTooltipTitle]=\"getTipContent(config.ceilTip, config.prop, tr, index) || ''\">\n\n    <ng-container *ngIf=\"config.type === 'default'\">{{ getVal(config.prop, config.format, tr, index) }}</ng-container>\n\n    <ng-container *ngIf=\"config.type === 'operate'\">\n        <ng-container *ngFor=\"let item of config.__renderBtns__\">\n            <gk-button *ngIf=\"!item.hide || !item.hide(tr, index)\" [button]=\"item.btn\" [mode]=\"item.btn.mode || 'text'\"\n                [type]=\"item.btn.type || 'primary'\" [disabled]=\"item.disabled && item.disabled(tr, index)\"\n                (click)=\"item.onClick && item.onClick(tr, index)\"></gk-button>\n        </ng-container>\n    </ng-container>\n\n    <ng-container *ngIf=\"config.type === 'expand'\">\n        <i class=\"expand-button\" [class.disabled]=\"config.disabled && config.disabled(tr, config.prop, index)\"\n            [class.expand-open]=\"expandTrSet.has(tr)\" (click)=\"onExpandClick(config)\"></i>\n    </ng-container>\n\n    <ng-container *ngIf=\"config.type === 'render'\">\n        <ng-container *ngIf=\"config.__renderOut__\" [ngTemplateOutlet]=\"config.__renderOut__\"\n            [ngTemplateOutletContext]=\"{ data: tr, rowIndex: index }\">\n        </ng-container>\n    </ng-container>\n\n    <ng-container *ngIf=\"config.type === 'switch'\">\n        <nz-switch [ngModel]=\"getVal(config.prop, config.format, tr, index)\"\n            [nzDisabled]=\"config.disabled && config.disabled(tr, config.prop, index)\" [nzControl]=\"true\"\n            [nzCheckedChildren]=\"config.checkedText\" [nzUnCheckedChildren]=\"config.unCheckedText\"\n            [nzLoading]=\"switchLoading[config.prop + '-' + index]\" (click)=\"onClickSwitch(config, tr, index)\"\n            [ngClass]=\"['switch-' + config.color]\">\n        </nz-switch>\n    </ng-container>\n\n    <ng-container *ngIf=\"config.type === 'image'\">\n        <img nz-image [nzSrc]=\"getVal(config.prop, config.format, tr, index)\" [ngStyle]=\"getImageStyle(config)\"\n            [ngClass]=\"{ 'image-circle': !!config.image?.circle, 'image-preview': isImagePreview(config) }\"\n            [nzDisablePreview]=\"!isImagePreview(config)\" />\n    </ng-container>\n\n    <ng-container *ngIf=\"config.type === 'status'\">\n        <ng-container *ngTemplateOutlet=\"statusCeil; context: { $implicit: getStatusV(config, tr, index) }\">\n        </ng-container>\n        <ng-template #statusCeil let-v=\"$implicit\">\n            <gk-icon *ngIf=\"v.icon\" [type]=\"v.icon\" class=\"status-icon\"></gk-icon>\n            <span *ngIf=\"v.point\" class=\"status-point\" [ngStyle]=\"v.point.style\" [class]=\"v.point.class\">\n            </span>\n            <span [ngStyle]=\"v.textStyle\">{{ getVal(config.prop, config.format, tr, index) }}</span>\n        </ng-template>\n    </ng-container>\n\n    <ng-container *ngIf=\"config.type === 'tip'\">\n        <gk-tip [tip]=\"getTipContent(config.tip, config.prop, tr, index)\" [trigger]=\"config.trigger || 'hover'\">\n        </gk-tip>\n    </ng-container>\n\n</span>\n",
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}.table-ceil-expand .expand-button{display:inline-block;height:16px;vertical-align:middle;width:16px}.table-ceil-expand .expand-button.disabled{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA1ElEQVQ4jbWTMYuFQAyEx+wJFgsrdqls/P+/SISt7JYsBBQku9cevvc8xLspEybzBZKm1lr3fce6rlBVlFJwJSKC9x7MjK7r0GzbVud5Rt/3CCHAOXc5wMyQc4aIYJomNMuy1LZtMQzDpfGslBKO4wCpKkIIt8wAEEKAqoJKKR+xY4yIMb7tOedQSgHdjj7p8YCvc+Ensoi8GMZx/GeCc8Kn2p8RPF+BiGBmb2/hCt3MQEQg7z1yzreTc87w3oOYGSKClBLM7FejmSGlBBEBM6N5+s7flB9vhhOjUUwAAAAASUVORK5CYII=)}.table-ceil-expand .expand-button:not(.disabled){background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAvElEQVQ4T9VTOwqEMBB9SUDQQojYWtik8Do5p9cR1CKF2ImChUFBZ1HYRUTcIs3ulDPM+wzzGBHRsizoug7TNGHbNjwV5xxBECCOY3ieBzbPMzVNgyiKEIYhhBCPAOu6YhxH9H2PJEnA2rYl3/chpXxcvA6HYYC1Fqyua0rT9CvzFWBXYowBK8uSlFK37HmeH32t9e28qqpfBHjL3jUXRXFIz7LsY+Fs59aCM8D5Wn9yROdHcn5l5zC5xvkFxFq4qeN9LzYAAAAASUVORK5CYII=);cursor:pointer}.table-ceil-expand .expand-button:not(.disabled).expand-open{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtklEQVQ4T2P8/////4cv/zNMXv+P4dT1/wxffzDgBdwcDAxmmowMuYFMDPLijAyMD178+5/S/ZchxpWJIdCWiYGPC78Bn74xMKw//I9hye5/DHNKmRkYi6f/+a+ryMgQ786EXyea7MKd/xgu3//PwGib9/v/lnYWgjajmw5yiU/lHwZGo7Tf/8/OZCHJdphi4/RBacDMzf/weifdFxHYWL1AsQGkhOYgCUSKExLFSZnizERpdgYA+HaPd2IkVJIAAAAASUVORK5CYII=)}.table-ceil-switch ::ng-deep .switch-green>.ant-switch-checked{background-color:#48bc19}.table-ceil-image ::ng-deep .image-circle{border-radius:50%}.table-ceil-image ::ng-deep .image-preview{cursor:pointer}.table-ceil-status ::ng-deep .status-icon{margin-right:3px}.table-ceil-status ::ng-deep .status-point{border-radius:50%;display:inline-block;margin:2px 5px 2px 2px;vertical-align:middle}.table-ceil-status ::ng-deep .status-point.default{background-color:#999}.table-ceil-status ::ng-deep .status-point.primary{background-color:#3266fb}.table-ceil-status ::ng-deep .status-point.success{background-color:#52c41a}.table-ceil-status ::ng-deep .status-point.warning{background-color:#faad14}.table-ceil-status ::ng-deep .status-point.danger{background-color:#ff4d4f}"]
            },] }
];
CeilTypeComponent.ctorParameters = () => [
    { type: NzIconService }
];
CeilTypeComponent.propDecorators = {
    config: [{ type: Input }],
    tr: [{ type: Input }],
    index: [{ type: Input }],
    pageIndex: [{ type: Input }],
    pageSize: [{ type: Input }],
    expandTrSet: [{ type: Input }]
};

class GKTable2Module {
}
GKTable2Module.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Table2Component,
                    CeilTypeComponent,
                ],
                imports: [
                    BrowserModule,
                    FormsModule,
                    ReactiveFormsModule,
                    NzTableModule,
                    NzSwitchModule,
                    NzModalModule,
                    NzToolTipModule,
                    NzImageModule,
                    GKIconModule,
                    GKTipModule,
                    GKButtonModule,
                    GKIOModule,
                ],
                exports: [
                    Table2Component,
                ],
            },] }
];

class TreeComponent {
    constructor(nzIcon) {
        this.nzIcon = nzIcon;
        this.gkClick = new EventEmitter();
        this.gkCheckBoxChange = new EventEmitter();
        this.gkExpandChange = new EventEmitter();
        this.gkSearchValueChange = new EventEmitter();
        this.gkDrop = new EventEmitter();
        this.nzIcon.addIcon(CaretRightOutline, CaretDownFill, PlusSquareOutline, MinusSquareOutline);
    }
    get gkTree() { return this._gkTree; }
    set gkTree(newVal) {
        if (newVal) {
            this._gkTree = newVal;
            this.config = this.gkTree.treeConfig;
            this.nodes = this.gkTree.treeData;
            setTimeout(() => {
                this.gkTree.getTreeNodes = () => this.nzTreeComponent.getTreeNodes();
                this.gkTree.getTreeNodeByKey = (key) => this.nzTreeComponent.getTreeNodeByKey(key);
                this.gkTree.getCheckedNodeList = () => this.nzTreeComponent.getCheckedNodeList();
                this.gkTree.getSelectedNodeList = () => this.nzTreeComponent.getSelectedNodeList();
                this.gkTree.getHalfCheckedNodeList = () => this.nzTreeComponent.getHalfCheckedNodeList();
                this.gkTree.getExpandedNodeList = () => this.nzTreeComponent.getExpandedNodeList();
                this.gkTree.getMatchedNodeList = () => this.nzTreeComponent.getMatchedNodeList();
            }, 0);
        }
    }
    treeClick(event) {
        this.gkClick.emit(event);
    }
    checkBoxChange(event) {
        this.gkCheckBoxChange.emit(event);
    }
    expandChange(event) {
        this.gkExpandChange.emit(event);
    }
    searchValueChange(event) {
        this.gkSearchValueChange.emit(event);
    }
    drop(event) {
        this.gkDrop.emit(event);
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        // 使用 ViewChild 时，Tree 方法需要在 ngAfterViewInit 中调用。
    }
}
TreeComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-tree',
                template: "<nz-tree\n    #nzTreeComponent\n    nzShowIcon\n    [nzData]=\"nodes\"\n    [nzExpandedIcon]=\"multiExpandedIconTpl\"\n    [nzCheckable]=\"config?.checkbox\"\n    [nzShowLine]=\"config?.showLine\"\n    [nzAsyncData]=\"config?.asyncData\"\n    [nzDraggable]=\"config?.draggable\"\n    [nzMultiple]=\"config?.multiple\"\n    [nzCheckStrictly]=\"config?.checkStrictly\"\n    [nzExpandAll]=\"config?.expandAll\"\n    [nzExpandedKeys]=\"config?.expandedKeys\"\n    [nzCheckedKeys]=\"config?.checkedKeys\"\n    [nzSelectedKeys]=\"config?.selectedKeys\"\n    [nzSearchValue]=\"searchValue\"\n    [nzSearchFunc]=\"config?.searchFunc\"\n    [nzVirtualHeight]=\"config?.virtual ? config.virtualHeight : undefined\"\n    (nzClick)=\"treeClick($event)\"\n    (nzCheckBoxChange)=\"checkBoxChange($event)\"\n    (nzExpandChange)=\"expandChange($event)\"\n    (nzSearchValueChange)=\"searchValueChange($event)\"\n    (nzOnDrop)=\"drop($event)\"\n>\n    <ng-template #multiExpandedIconTpl let-node let-origin=\"origin\">\n        <gk-icon\n            *ngIf=\"!origin.isLeaf\"\n            [type]=\"node.isExpanded ? config.openIcon : config.closeIcon\"\n            class=\"ant-tree-switcher-line-icon\"\n        ></gk-icon>\n    </ng-template>\n</nz-tree>\n",
                styles: [""]
            },] }
];
TreeComponent.ctorParameters = () => [
    { type: NzIconService }
];
TreeComponent.propDecorators = {
    nzTreeComponent: [{ type: ViewChild, args: ['nzTreeComponent', { static: false },] }],
    gkTree: [{ type: Input }],
    searchValue: [{ type: Input }],
    gkClick: [{ type: Output }],
    gkCheckBoxChange: [{ type: Output }],
    gkExpandChange: [{ type: Output }],
    gkSearchValueChange: [{ type: Output }],
    gkDrop: [{ type: Output }]
};

class GKTreeModule {
}
GKTreeModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    TreeComponent,
                ],
                imports: [
                    CommonModule,
                    NzIconModule,
                    NzTreeModule,
                    GKIconModule,
                ],
                exports: [
                    TreeComponent,
                ],
            },] }
];

class GKTree {
    constructor(data, config) {
        this.treeConfig = {
            multiple: false,
            openIcon: 'caret-down',
            closeIcon: 'caret-right',
            expandedKeys: [],
            checkedKeys: [],
            selectedKeys: [],
            virtual: false,
            virtualHeight: '300px',
        };
        util.merge(this.treeConfig, config);
        // 字段替换
        const isReplace = this.treeConfig.replaceKeyName ? true : false;
        const func = (arr) => {
            arr.map(item => {
                if (isReplace) {
                    for (const [treeKey, dateKey] of Object.entries(this.treeConfig.replaceKeyName)) {
                        item[treeKey] = item[dateKey];
                    }
                }
                const children = item.children;
                if (children && children.length > 0) {
                    item.isLeaf = false;
                    func(children);
                }
                else {
                    item.isLeaf = true;
                }
            });
            return arr;
        };
        this.treeData = func(data);
    }
}

class AlertComponent {
    constructor() {
        this.status = '500';
        this.hideButton = false;
        this.homeHref = '/';
    }
    get statusText() {
        return {
            401: '无访问权限',
            404: '抱歉，你访问的页面走丢了',
            500: '抱歉，你访问的页面走丢了',
            refresh: '系统错误，请刷新',
        }[this.status];
    }
    ngOnInit() {
    }
}
AlertComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-alert',
                template: "<div class=\"gk-alert-container\">\n    <div class=\"gk-alert-image\" [ngClass]=\"['status-' + status]\"></div>\n    <div class=\"gk-alert-text\">{{ statusText }}</div>\n    <a *ngIf=\"!hideButton\" class=\"gk-alert-button\" [routerLink]=\"[homeHref]\">\u56DE\u5230\u9996\u9875</a>\n</div>\n",
                styles: [".gk-alert-container{display:inline-block;text-align:center;width:560px}.gk-alert-container .gk-alert-image{display:inline-block;height:200px;vertical-align:top;width:326px}.gk-alert-container .gk-alert-image.status-401{background-image:url(\"data:image/svg+xml,%3C%3Fxml version%3D%221.0%22 encoding%3D%22UTF-8%22%3F%3E%3Csvg width%3D%22326px%22 height%3D%22200px%22 viewBox%3D%220 0 326 200%22 version%3D%221.1%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E    %3Ctitle%3E%E7%BC%96%E7%BB%84 18%3C%2Ftitle%3E    %3Cg id%3D%22Components%22 stroke%3D%22none%22 stroke-width%3D%221%22 fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E        %3Cg id%3D%225.%E5%8F%8D%E9%A6%88%2F7.Result%E7%BB%93%E6%9E%9C%2F%E6%97%A0%E6%9D%83%E9%99%90%22 transform%3D%22translate(-117.000000%2C 0.000000)%22%3E            %3Cg id%3D%22%E7%BC%96%E7%BB%84-18%22 transform%3D%22translate(117.000000%2C 0.000000)%22%3E                %3Crect id%3D%22%E7%9F%A9%E5%BD%A2%22 x%3D%220%22 y%3D%220%22 width%3D%22326%22 height%3D%22200%22%3E%3C%2Frect%3E                %3Cg id%3D%22%E7%BC%96%E7%BB%84-17%22 transform%3D%22translate(30.000000%2C 1.000000)%22%3E                    %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%22 fill%3D%22%23F3F3F3%22 cx%3D%22133%22 cy%3D%22183%22 rx%3D%2298%22 ry%3D%2212%22%3E%3C%2Fellipse%3E                    %3Cg id%3D%22%E7%BC%96%E7%BB%84-19%22 transform%3D%22translate(57.000000%2C 65.000000)%22%3E                        %3Crect id%3D%22%E7%9F%A9%E5%BD%A2%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23FFFFFF%22 x%3D%220.5%22 y%3D%22-1.5%22 width%3D%22151%22 height%3D%22118%22 rx%3D%228%22%3E%3C%2Frect%3E                        %3Cpath d%3D%22M10%2C0 L142%2C0 C146.418278%2C-8.11624501e-16 150%2C3.581722 150%2C8 L150%2C23 L150%2C23 L2%2C23 L2%2C8 C2%2C3.581722 5.581722%2C8.11624501e-16 10%2C0 Z%22 id%3D%22%E7%9F%A9%E5%BD%A2%22 fill%3D%22%23E5E5E5%22%3E%3C%2Fpath%3E                        %3Cline x1%3D%220.447058824%22 y1%3D%2222.5%22 x2%3D%22151.552941%22 y2%3D%2222.5%22 id%3D%22%E7%9B%B4%E7%BA%BF-2%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 stroke-linecap%3D%22square%22%3E%3C%2Fline%3E                        %3Cline x1%3D%22119%22 y1%3D%227%22 x2%3D%22125%22 y2%3D%2214%22 id%3D%22%E8%B7%AF%E5%BE%84-11%22 stroke%3D%22%23979797%22 stroke-width%3D%222%22%3E%3C%2Fline%3E                        %3Ccircle id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%22 stroke%3D%22%23979797%22 stroke-width%3D%222%22 cx%3D%22135.5%22 cy%3D%2210.5%22 r%3D%223.5%22%3E%3C%2Fcircle%3E                        %3Cline x1%3D%22119%22 y1%3D%227%22 x2%3D%22125%22 y2%3D%2214%22 id%3D%22%E8%B7%AF%E5%BE%84-11%E5%A4%87%E4%BB%BD%22 stroke%3D%22%23979797%22 stroke-width%3D%222%22 transform%3D%22translate(122.000000%2C 10.500000) scale(-1%2C 1) translate(-122.000000%2C -10.500000) %22%3E%3C%2Fline%3E                    %3C%2Fg%3E                    %3Cg id%3D%22%E7%BC%96%E7%BB%84%22 transform%3D%22translate(112.000000%2C 106.000000)%22 fill-rule%3D%22nonzero%22%3E                        %3Cpath d%3D%22M38%2C21 L34.7%2C21 L34.7%2C16.5876777 C34.7%2C9.25878057 28.7901587%2C3.31753555 21.5%2C3.31753555 C14.2098413%2C3.31753555 8.3%2C9.25878057 8.3%2C16.5876777 L8.3%2C21 L5%2C21 L5%2C16.5876777 C5%2C7.42655628 12.3873016%2C0 21.5%2C0 C30.6126984%2C0 38%2C7.42655628 38%2C16.5876777 L38%2C21 Z%22 id%3D%22%E8%B7%AF%E5%BE%84%22 fill%3D%22%23979797%22%3E%3C%2Fpath%3E                        %3Cpath d%3D%22M38.0294802%2C55 L4.97051978%2C55 C2.21999019%2C54.9816229 0%2C52.7418168 0%2C49.9852507 L0%2C26.0147493 C0%2C23.2581832 2.21999019%2C21.0183771 4.97051978%2C21 L38.0294802%2C21 C40.7800098%2C21.0183771 43%2C23.2581832 43%2C26.0147493 L43%2C49.9852507 C43%2C52.7418168 40.7800098%2C54.9816229 38.0294802%2C55 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23F2F2F2%22%3E%3C%2Fpath%3E                        %3Cpath d%3D%22M22.0318315%2C42 C19.6022452%2C42.0127706 17.4047347%2C40.559118 16.4660513%2C38.3181535 C15.5273679%2C36.0771891 16.0328295%2C33.4913312 17.7462674%2C31.7687804 C19.4597054%2C30.0462295 22.042847%2C29.5270573 24.2887611%2C30.4538386 C26.5346752%2C31.3806199 28%2C33.5703865 28%2C36 C28%2C39.3013062 25.3330884%2C41.9824482 22.0318315%2C42 L22.0318315%2C42 Z M22%2C33 C20.3431458%2C33 19%2C34.3431458 19%2C36 C19%2C37.6568542 20.3431458%2C39 22%2C39 C23.6568542%2C39 25%2C37.6568542 25%2C36 C25%2C34.3431458 23.6568542%2C33 22%2C33 L22%2C33 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%22 fill%3D%22%23979797%22%3E%3C%2Fpath%3E                        %3Cpath d%3D%22M22%2C48 C20.8954305%2C48 20%2C47.2865096 20%2C46.4063745 L20%2C41.5936255 C20%2C40.7134904 20.8954305%2C40 22%2C40 C23.1045695%2C40 24%2C40.7134904 24%2C41.5936255 L24%2C46.4063745 C24%2C47.2865096 23.1045695%2C48 22%2C48 Z%22 id%3D%22%E8%B7%AF%E5%BE%84%22 fill%3D%22%23979797%22%3E%3C%2Fpath%3E                    %3C%2Fg%3E                    %3Ccircle id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-14%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 opacity%3D%220.39%22 cx%3D%22249%22 cy%3D%2232%22 r%3D%226%22%3E%3C%2Fcircle%3E                    %3Cpath d%3D%22M23%2C59.9518301 C33.6421532%2C45.6685856 51.7249284%2C43.1106779 77.2483254%2C52.278107 C106.627421%2C62.7602463 121.189137%2C24.4238586 99.8325378%2C22.966992 C86.2977408%2C21.7452157 84.0926228%2C39.1850219 88.8966444%2C41.3655239 C93.700666%2C43.5460259 103.774148%2C48.5662887 124.929333%2C34.3582007 C143.578502%2C20.5537994 192.45919%2C12.4719082 203.288327%2C30.0757333 C214.117464%2C47.6795584 168.346511%2C52.4848037 168.344056%2C43.1355678 C168.341602%2C33.7863319 177.42376%2C34.4737979 179.682529%2C34.372589 C205.883072%2C35.1735399 211.575569%2C57.6760441 243.14272%2C46.1840197%22 id%3D%22%E8%B7%AF%E5%BE%84-9%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 opacity%3D%220.389868024%22 stroke-dasharray%3D%224%2C4%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M8%2C126 C8.6565862%2C126 9.19616731%2C126.500958 9.25737551%2C127.141507 L9.26315789%2C127.263158 L9.263%2C132.736 L14.7368421%2C132.736842 C15.4344649%2C132.736842 16%2C133.302377 16%2C134 C16%2C134.656586 15.4990416%2C135.196167 14.8584926%2C135.257376 L14.7368421%2C135.263158 L9.263%2C135.263 L9.26315789%2C140.736842 C9.26315789%2C141.434465 8.69762284%2C142 8%2C142 C7.3434138%2C142 6.80383269%2C141.499042 6.74262449%2C140.858493 L6.73684211%2C140.736842 L6.736%2C135.263 L1.26315789%2C135.263158 C0.565535053%2C135.263158 0%2C134.697623 0%2C134 C0%2C133.343414 0.500958386%2C132.803833 1.14150736%2C132.742624 L1.26315789%2C132.736842 L6.736%2C132.736 L6.73684211%2C127.263158 C6.73684211%2C126.565535 7.30237716%2C126 8%2C126 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88%22 fill%3D%22%23979797%22 fill-rule%3D%22nonzero%22 opacity%3D%220.4%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M258%2C76 C258.656586%2C76 259.196167%2C76.5009584 259.257376%2C77.1415074 L259.263158%2C77.2631579 L259.263%2C82.736 L264.736842%2C82.7368421 C265.434465%2C82.7368421 266%2C83.3023772 266%2C84 C266%2C84.6565862 265.499042%2C85.1961673 264.858493%2C85.2573755 L264.736842%2C85.2631579 L259.263%2C85.263 L259.263158%2C90.7368421 C259.263158%2C91.4344649 258.697623%2C92 258%2C92 C257.343414%2C92 256.803833%2C91.4990416 256.742624%2C90.8584926 L256.736842%2C90.7368421 L256.736%2C85.263 L251.263158%2C85.2631579 C250.565535%2C85.2631579 250%2C84.6976228 250%2C84 C250%2C83.3434138 250.500958%2C82.8038327 251.141507%2C82.7426245 L251.263158%2C82.7368421 L256.736%2C82.736 L256.736842%2C77.2631579 C256.736842%2C76.5655351 257.302377%2C76 258%2C76 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88%E5%A4%87%E4%BB%BD-4%22 fill%3D%22%23979797%22 fill-rule%3D%22nonzero%22 opacity%3D%220.4%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M158.5%2C3 C164.29899%2C3 169%2C7.70101013 169%2C13.5 C169%2C18.4654763 165.553262%2C22.6259238 160.92179%2C23.719337 L160.921%2C27.961 L162.504892%2C27.961334 C163.609461%2C27.961334 164.504892%2C28.8567645 164.504892%2C29.961334 C164.504892%2C31.0659035 163.609461%2C31.961334 162.504892%2C31.961334 L160.921%2C31.961 L160.921183%2C38.0650601 C160.921183%2C39.9980567 159.35418%2C41.5650601 157.421183%2C41.5650601 C155.488187%2C41.5650601 153.921183%2C39.9980567 153.921183%2C38.0650601 L153.921248%2C22.9517379 C150.416332%2C21.2506897 148%2C17.6575272 148%2C13.5 C148%2C7.70101013 152.70101%2C3 158.5%2C3 Z M158.5%2C10.2413793 C156.700313%2C10.2413793 155.241379%2C11.7003135 155.241379%2C13.5 C155.241379%2C15.2996865 156.700313%2C16.7586207 158.5%2C16.7586207 C160.299687%2C16.7586207 161.758621%2C15.2996865 161.758621%2C13.5 C161.758621%2C11.7003135 160.299687%2C10.2413793 158.5%2C10.2413793 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88%22 stroke%3D%22%23979797%22 stroke-width%3D%222%22 fill%3D%22%23F2F2F2%22 transform%3D%22translate(158.500000%2C 22.282530) rotate(39.000000) translate(-158.500000%2C -22.282530) %22%3E%3C%2Fpath%3E                %3C%2Fg%3E            %3C%2Fg%3E        %3C%2Fg%3E    %3C%2Fg%3E%3C%2Fsvg%3E\")}.gk-alert-container .gk-alert-image.status-404{background-image:url(\"data:image/svg+xml,%3C%3Fxml version%3D%221.0%22 encoding%3D%22UTF-8%22%3F%3E%3Csvg width%3D%22326px%22 height%3D%22200px%22 viewBox%3D%220 0 326 200%22 version%3D%221.1%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E    %3Ctitle%3E%E7%BC%96%E7%BB%84 6%3C%2Ftitle%3E    %3Cg id%3D%22Components%22 stroke%3D%22none%22 stroke-width%3D%221%22 fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E        %3Cg id%3D%225.%E5%8F%8D%E9%A6%88%2F7.Result%E7%BB%93%E6%9E%9C%2F404%22 transform%3D%22translate(-117.000000%2C 1.000000)%22%3E            %3Cg id%3D%22%E7%BC%96%E7%BB%84-6%22 transform%3D%22translate(117.000000%2C 0.000000)%22%3E                %3Crect id%3D%22%E8%92%99%E7%89%88%22 x%3D%220%22 y%3D%220%22 width%3D%22326%22 height%3D%22200%22%3E%3C%2Frect%3E                %3Cg id%3D%22%E7%BC%96%E7%BB%84-4%22 transform%3D%22translate(36.000000%2C 1.000000)%22%3E                    %3Cg id%3D%22%E7%BC%96%E7%BB%84-11%22 transform%3D%22translate(117.518669%2C 77.572400) rotate(-14.000000) translate(-117.518669%2C -77.572400) translate(37.518669%2C 17.572400)%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22%3E                        %3Cline x1%3D%2223.592843%22 y1%3D%2295.4972973%22 x2%3D%2213.0448549%22 y2%3D%22119.983784%22 id%3D%22%E8%B7%AF%E5%BE%84-3%22 stroke-linecap%3D%22round%22%3E%3C%2Fline%3E                        %3Cline x1%3D%2231.7968338%22 y1%3D%2298.0899841%22 x2%3D%2230.6248351%22 y2%3D%22114.222258%22 id%3D%22%E8%B7%AF%E5%BE%84-3%E5%A4%87%E4%BB%BD%22 stroke-linecap%3D%22round%22%3E%3C%2Fline%3E                        %3Cline x1%3D%2279.8997361%22 y1%3D%222.59148649%22 x2%3D%2279.8997361%22 y2%3D%2219.4463514%22 id%3D%22%E7%9B%B4%E7%BA%BF%22 stroke-linecap%3D%22square%22%3E%3C%2Fline%3E                        %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-6%22 fill%3D%22%23FFFFFF%22 cx%3D%2279.8997361%22 cy%3D%223.26486486%22 rx%3D%223.26121372%22 ry%3D%223.26486486%22%3E%3C%2Fellipse%3E                        %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%22 fill%3D%22%23F9F9F9%22 cx%3D%2280.3073879%22 cy%3D%2250.6054054%22 rx%3D%2247.6952507%22 ry%3D%2234.2810811%22%3E%3C%2Fellipse%3E                        %3Cpath d%3D%22M140.110861%2C96.2746021 C152.371934%2C90.392528 159.799472%2C82.6973988 159.799472%2C74.2756757 C159.799472%2C55.7935412 124.027142%2C40.8108108 79.8997361%2C40.8108108 C35.7723304%2C40.8108108 7.4151415e-13%2C55.7935412 7.4151415e-13%2C74.2756757 C7.4151415e-13%2C92.7578102 35.7723304%2C107.740541 79.8997361%2C107.740541 C96.0844735%2C107.740541 111.145266%2C105.725028 123.72937%2C102.260581%22 id%3D%22%E8%B7%AF%E5%BE%84%22 fill%3D%22%23FFFFFF%22%3E%3C%2Fpath%3E                        %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-2%22 fill-opacity%3D%220.1%22 fill%3D%22%23000000%22 cx%3D%2280.9040095%22 cy%3D%2284.6374689%22 rx%3D%2238.7269129%22 ry%3D%2216.7324324%22%3E%3C%2Fellipse%3E                        %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%22 fill%3D%22%23FFFFFF%22 cx%3D%2230.7974628%22 cy%3D%2271.3461836%22 rx%3D%227.74538259%22 ry%3D%227.75405405%22%3E%3C%2Fellipse%3E                        %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-3%22 fill%3D%22%23FFFFFF%22 cx%3D%2259.3330829%22 cy%3D%2255.8380755%22 rx%3D%227.74538259%22 ry%3D%227.75405405%22%3E%3C%2Fellipse%3E                        %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-4%22 fill%3D%22%23FFFFFF%22 cx%3D%22102.544165%22 cy%3D%2255.8380755%22 rx%3D%227.74538259%22 ry%3D%227.75405405%22%3E%3C%2Fellipse%3E                        %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-5%22 fill%3D%22%23FFFFFF%22 cx%3D%22130.264481%22 cy%3D%2271.3461836%22 rx%3D%227.74538259%22 ry%3D%227.75405405%22%3E%3C%2Fellipse%3E                        %3Cline x1%3D%22146.754617%22 y1%3D%2295.4972973%22 x2%3D%22136.206629%22 y2%3D%22119.983784%22 id%3D%22%E8%B7%AF%E5%BE%84-3%E5%A4%87%E4%BB%BD-2%22 stroke-linecap%3D%22round%22 transform%3D%22translate(141.480623%2C 107.740541) scale(-1%2C 1) translate(-141.480623%2C -107.740541) %22%3E%3C%2Fline%3E                        %3Cline x1%3D%22129.174637%22 y1%3D%2298.0899841%22 x2%3D%22128.002639%22 y2%3D%22114.222258%22 id%3D%22%E8%B7%AF%E5%BE%84-3%E5%A4%87%E4%BB%BD-3%22 stroke-linecap%3D%22round%22 transform%3D%22translate(128.588638%2C 106.156121) scale(-1%2C 1) translate(-128.588638%2C -106.156121) %22%3E%3C%2Fline%3E                    %3C%2Fg%3E                    %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-7%22 fill%3D%22%23F3F3F3%22 cx%3D%22129.27145%22 cy%3D%22189.406199%22 rx%3D%2252.590517%22 ry%3D%227.75355913%22%3E%3C%2Fellipse%3E                    %3Cpath d%3D%22M0.852161841%2C187.147894 C10.7863948%2C169.73153 20.9532545%2C168.002067 31.3527412%2C181.959505%22 id%3D%22%E8%B7%AF%E5%BE%84-4%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M15.7539316%2C189.600298 C34.1215202%2C181.294211 52.4906121%2C178.714377 70.8612072%2C181.860797%22 id%3D%22%E8%B7%AF%E5%BE%84-5%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M173.710337%2C196.802247 C202.735636%2C181.98336 229.751059%2C176.994998 254.756605%2C181.837162%22 id%3D%22%E8%B7%AF%E5%BE%84-5%E5%A4%87%E4%BB%BD%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M186.82416%2C160.900646 C186.82416%2C160.900646 197.563706%2C157.375747 214.546602%2C162.087156%22 id%3D%22%E8%B7%AF%E5%BE%84-5%E5%A4%87%E4%BB%BD-2%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M222%2C168 C230.269038%2C141.987551 240.269038%2C141.349383 252%2C166.085498%22 id%3D%22%E8%B7%AF%E5%BE%84-6%E5%A4%87%E4%BB%BD%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23FFFFFF%22 stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M15.919278%2C114.705684 C16.5556786%2C114.705684 17.0786712%2C115.190698 17.1379977%2C115.810861 L17.1436023%2C115.928639 L17.1428954%2C121.226684 L22.4417054%2C121.226742 C23.1171249%2C121.226742 23.6646606%2C121.774891 23.6646606%2C122.451067 C23.6646606%2C123.087467 23.1796463%2C123.61046 22.5594842%2C123.669786 L22.4417054%2C123.675391 L17.1428954%2C123.674684 L17.1436023%2C128.973494 C17.1436023%2C129.648914 16.5954536%2C130.196449 15.919278%2C130.196449 C15.2828774%2C130.196449 14.7598847%2C129.711435 14.7005583%2C129.091273 L14.6949537%2C128.973494 L14.6948954%2C123.674684 L9.39685055%2C123.675391 C8.72143108%2C123.675391 8.17389541%2C123.127242 8.17389541%2C122.451067 C8.17389541%2C121.814666 8.6589097%2C121.291674 9.27907181%2C121.232347 L9.39685055%2C121.226742 L14.6948954%2C121.226684 L14.6949537%2C115.928639 C14.6949537%2C115.25322 15.2431023%2C114.705684 15.919278%2C114.705684 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88%E5%A4%87%E4%BB%BD-2%22 fill%3D%22%23979797%22 fill-rule%3D%22nonzero%22 opacity%3D%220.4%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M227.900061%2C69.0562762 C228.536461%2C69.0562762 229.059454%2C69.5412905 229.11878%2C70.1614526 L229.124385%2C70.2792314 L229.123678%2C75.5772762 L234.422488%2C75.5773345 C235.097908%2C75.5773345 235.645443%2C76.1254831 235.645443%2C76.8016588 C235.645443%2C77.4380594 235.160429%2C77.961052 234.540267%2C78.0203785 L234.422488%2C78.0259831 L229.123678%2C78.0252762 L229.124385%2C83.3240862 C229.124385%2C83.9995057 228.576236%2C84.5470414 227.900061%2C84.5470414 C227.26366%2C84.5470414 226.740668%2C84.0620271 226.681341%2C83.441865 L226.675736%2C83.3240862 L226.675678%2C78.0252762 L221.377633%2C78.0259831 C220.702214%2C78.0259831 220.154678%2C77.4778344 220.154678%2C76.8016588 C220.154678%2C76.1652582 220.639692%2C75.6422655 221.259855%2C75.5829391 L221.377633%2C75.5773345 L226.675678%2C75.5772762 L226.675736%2C70.2792314 C226.675736%2C69.6038119 227.223885%2C69.0562762 227.900061%2C69.0562762 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88%E5%A4%87%E4%BB%BD-3%22 fill%3D%22%23979797%22 fill-rule%3D%22nonzero%22 opacity%3D%220.4%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M0%2C46.9518301 C10.6421532%2C32.6685856 28.7249284%2C30.1106779 54.2483254%2C39.278107 C83.6274208%2C49.7602463 98.189137%2C11.4238586 76.8325378%2C9.96699195 C63.2977408%2C8.74521568 61.0926228%2C26.1850219 65.8966444%2C28.3655239 C70.700666%2C30.5460259 80.774148%2C35.5662887 101.929333%2C21.3582007 C120.578502%2C7.55379942 169.45919%2C-0.528091772 180.288327%2C17.0757333 C191.117464%2C34.6795584 145.346511%2C39.4848037 145.344056%2C30.1355678 C145.341602%2C20.7863319 154.42376%2C21.4737979 156.682529%2C21.372589 C182.883072%2C22.1735399 188.575569%2C44.6760441 220.14272%2C33.1840197%22 id%3D%22%E8%B7%AF%E5%BE%84-9%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 opacity%3D%220.389868024%22 stroke-dasharray%3D%224%2C4%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M117.37589%2C166.6623 C117.745495%2C166.6623 118.039004%2C166.629651 118.256418%2C166.564354 C118.430349%2C165.19311 118.571669%2C163.974228 118.680376%2C162.907705 C119.636998%2C162.77711 120.952355%2C162.537687 122.626444%2C162.189435 C122.626444%2C161.318804 122.539479%2C160.687597 122.365547%2C160.295813 C121.930719%2C160.36111 120.767553%2C160.480822 118.876049%2C160.654948 C119.006497%2C159.479597 119.223911%2C157.205074 119.528291%2C153.831381 C118.615152%2C153.657255 117.952038%2C153.613723 117.538951%2C153.700786 L117.538951%2C153.700786 L116.625811%2C160.883489 C115.23436%2C160.992318 113.582012%2C161.046732 111.668766%2C161.046732 C109.190244%2C161.046732 107.624861%2C160.959669 106.972619%2C160.785543 C107.124808%2C158.630732 107.537896%2C156.182083 108.21188%2C153.439597 C108.429294%2C152.590732 109.103278%2C150.207381 110.233832%2C146.289543 C109.646814%2C145.919525 109.016312%2C145.71275 108.342328%2C145.669219 C105.733357%2C152.220714 104.428872%2C157.890696 104.428872%2C162.679165 C106.168186%2C163.158011 108.581484%2C163.397435 111.668766%2C163.397435 C113.473305%2C163.397435 115.060429%2C163.332137 116.430138%2C163.201543 C116.343173%2C164.638083 116.29969%2C165.726372 116.29969%2C166.466408 C116.60407%2C166.597002 116.962803%2C166.6623 117.37589%2C166.6623 Z M135.964808%2C166.6623 C138.530297%2C166.6623 140.856629%2C165.68284 142.943806%2C163.723921 C145.009241%2C161.743237 146.041959%2C159.479597 146.041959%2C156.933002 C146.041959%2C153.167525 144.791827%2C150.272678 142.291563%2C148.248462 C141.748027%2C148.531417 141.269716%2C149.010264 140.856629%2C149.685002 C141.987183%2C150.990948 142.737262%2C152.068354 143.106867%2C152.917219 C143.541695%2C153.918444 143.759109%2C155.202624 143.759109%2C156.769759 C143.759109%2C158.598083 142.922064%2C160.339345 141.247975%2C161.993543 C139.552144%2C163.647741 137.791088%2C164.47484 135.964808%2C164.47484 C133.790666%2C164.47484 131.877421%2C163.702155 130.225072%2C162.156786 C128.594465%2C160.633183 127.779162%2C158.793975 127.779162%2C156.639165 C127.779162%2C154.440822 128.496629%2C152.47102 129.931563%2C150.729759 C131.453463%2C148.901435 133.290613%2C147.987273 135.443014%2C147.987273 C136.834465%2C147.987273 138.225917%2C148.335525 139.617368%2C149.032029 C139.856524%2C148.879669 140.095679%2C148.61848 140.334835%2C148.248462 C140.573991%2C147.90021 140.693568%2C147.595489 140.693568%2C147.3343 C140.10655%2C146.833687 139.291246%2C146.420137 138.247658%2C146.093651 C137.291035%2C145.810696 136.399637%2C145.669219 135.573463%2C145.669219 C132.681853%2C145.669219 130.246814%2C146.757507 128.268344%2C148.934083 C126.333357%2C151.023597 125.365864%2C153.52666 125.365864%2C156.443273 C125.365864%2C159.359885 126.398582%2C161.786768 128.464017%2C163.723921 C130.529452%2C165.68284 133.029716%2C166.6623 135.964808%2C166.6623 Z M161.728397%2C166.6623 C162.098001%2C166.6623 162.39151%2C166.629651 162.608925%2C166.564354 C162.782856%2C165.19311 162.924175%2C163.974228 163.032882%2C162.907705 C163.989505%2C162.77711 165.304861%2C162.537687 166.978951%2C162.189435 C166.978951%2C161.318804 166.891985%2C160.687597 166.718054%2C160.295813 C166.283225%2C160.36111 165.120059%2C160.480822 163.228555%2C160.654948 C163.359004%2C159.479597 163.576418%2C157.205074 163.880798%2C153.831381 C162.967658%2C153.657255 162.304545%2C153.613723 161.891458%2C153.700786 L161.891458%2C153.700786 L160.978318%2C160.883489 C159.586867%2C160.992318 157.934518%2C161.046732 156.021273%2C161.046732 C153.54275%2C161.046732 151.977368%2C160.959669 151.325125%2C160.785543 C151.477315%2C158.630732 151.890402%2C156.182083 152.564386%2C153.439597 C152.781801%2C152.590732 153.455785%2C150.207381 154.586339%2C146.289543 C153.99932%2C145.919525 153.368819%2C145.71275 152.694835%2C145.669219 C150.085864%2C152.220714 148.781378%2C157.890696 148.781378%2C162.679165 C150.520692%2C163.158011 152.933991%2C163.397435 156.021273%2C163.397435 C157.825811%2C163.397435 159.412935%2C163.332137 160.782645%2C163.201543 C160.695679%2C164.638083 160.652196%2C165.726372 160.652196%2C166.466408 C160.956576%2C166.597002 161.31531%2C166.6623 161.728397%2C166.6623 Z%22 id%3D%22404%22 fill-opacity%3D%220.45%22 fill%3D%22%23000000%22 fill-rule%3D%22nonzero%22 transform%3D%22translate(135.703911%2C 156.165759) rotate(-10.000000) translate(-135.703911%2C -156.165759) %22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M209.657032%2C171.879824 C215.500168%2C149.591313 222.56645%2C149.044506 230.855878%2C170.239401%22 id%3D%22%E8%B7%AF%E5%BE%84-6%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23FFFFFF%22 stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E                %3C%2Fg%3E            %3C%2Fg%3E        %3C%2Fg%3E    %3C%2Fg%3E%3C%2Fsvg%3E\")}.gk-alert-container .gk-alert-image.status-500{background-image:url(\"data:image/svg+xml,%3C%3Fxml version%3D%221.0%22 encoding%3D%22UTF-8%22%3F%3E%3Csvg width%3D%22326px%22 height%3D%22200px%22 viewBox%3D%220 0 326 200%22 version%3D%221.1%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E    %3Ctitle%3E%E7%BC%96%E7%BB%84 16%3C%2Ftitle%3E    %3Cdefs%3E        %3Cellipse id%3D%22path-1%22 cx%3D%2261.4998135%22 cy%3D%2261.9346409%22 rx%3D%2261.5%22 ry%3D%2261.5838926%22%3E%3C%2Fellipse%3E    %3C%2Fdefs%3E    %3Cg id%3D%22Components%22 stroke%3D%22none%22 stroke-width%3D%221%22 fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E        %3Cg id%3D%225.%E5%8F%8D%E9%A6%88%2F7.Result%E7%BB%93%E6%9E%9C%2F500%22 transform%3D%22translate(-116.000000%2C 2.000000)%22%3E            %3Cg id%3D%22%E7%BC%96%E7%BB%84-16%22 transform%3D%22translate(117.000000%2C 0.000000)%22%3E                %3Crect id%3D%22%E7%9F%A9%E5%BD%A2%22 x%3D%220%22 y%3D%220%22 width%3D%22326%22 height%3D%22200%22%3E%3C%2Frect%3E                %3Cg id%3D%22%E7%BC%96%E7%BB%84-15%22%3E                    %3Cpath d%3D%22M0%2C52.4975591 C16.7137944%2C62.3484795 33.938449%2C61.006607 51.6739638%2C48.4719414 C78.2772361%2C29.6699431 83.4968142%2C19.533958 103.489268%2C19.533958 C139.97142%2C19.533958 82.903957%2C57.6211552 96.2340016%2C26.6278396 C109.564046%2C-4.36547602 137.210651%2C1.40013087 166.370124%2C22.2979305 C195.529597%2C43.1957301 214.568903%2C36.6593599 239%2C28.7521373%22 id%3D%22%E8%B7%AF%E5%BE%84-10%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 opacity%3D%220.4%22 stroke-dasharray%3D%224%2C4%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M237%2C168.261766 C242.721616%2C148.373384 249.721616%2C149.286129 258%2C171%22 id%3D%22%E8%B7%AF%E5%BE%84-6%E5%A4%87%E4%BB%BD-2%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M221%2C172 C225.96629%2C152.492295 231.96629%2C152.012118 239%2C170.559467%22 id%3D%22%E8%B7%AF%E5%BE%84-6%E5%A4%87%E4%BB%BD-3%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23FFFFFF%22 stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M26%2C150 C30.9662904%2C130.492295 36.9662904%2C130.012118 44%2C148.559467%22 id%3D%22%E8%B7%AF%E5%BE%84-6%E5%A4%87%E4%BB%BD-5%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23FFFFFF%22 stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E                    %3Cg id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD%22 transform%3D%22translate(93.000000%2C 41.000000)%22%3E                        %3Cmask id%3D%22mask-2%22 fill%3D%22white%22%3E                            %3Cuse xlink%3Ahref%3D%22%23path-1%22%3E%3C%2Fuse%3E                        %3C%2Fmask%3E                        %3Cellipse stroke%3D%22%23979797%22 stroke-width%3D%223%22 cx%3D%2261.4998135%22 cy%3D%2261.9346409%22 rx%3D%2263%22 ry%3D%2263.0838926%22%3E%3C%2Fellipse%3E                        %3Cellipse stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23F9F9F9%22 mask%3D%22url(%23mask-2)%22 cx%3D%2268.1484622%22 cy%3D%228.67289592%22 rx%3D%2220.6148649%22 ry%3D%2220.6409396%22%3E%3C%2Fellipse%3E                        %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-8%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23E5E5E5%22 mask%3D%22url(%23mask-2)%22 cx%3D%2215.3748135%22 cy%3D%2288.9816208%22 rx%3D%2213.5506757%22 ry%3D%2213.5671141%22%3E%3C%2Fellipse%3E                        %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-9%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23FFFFFF%22 mask%3D%22url(%23mask-2)%22 cx%3D%2236.5673811%22 cy%3D%2242.7937013%22 rx%3D%227.31756757%22 ry%3D%227.32550336%22%3E%3C%2Fellipse%3E                        %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-10%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23F9F9F9%22 mask%3D%22url(%23mask-2)%22 cx%3D%2297.2363%22 cy%3D%2248.6192046%22 rx%3D%2211.472973%22 ry%3D%2211.4865772%22%3E%3C%2Fellipse%3E                        %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-11%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23FFFFFF%22 mask%3D%22url(%23mask-2)%22 cx%3D%2278.1214351%22 cy%3D%22106.874238%22 rx%3D%228.14864865%22 ry%3D%228.15771812%22%3E%3C%2Fellipse%3E                    %3C%2Fg%3E                    %3Cpath d%3D%22M98.9248865%2C83.0029642 C78.3577685%2C89.0922562 65.2831247%2C98.262716 65.2951658%2C108.533708 C65.316767%2C126.939578 107.356168%2C141.909716 159.192804%2C141.970631 C211.02944%2C142.031176 253.033831%2C127.159501 253.012247%2C108.75363 C253.001544%2C99.637596 242.683843%2C91.3643501 225.973686%2C85.3278559 C224.028048%2C84.6249998 221.995747%2C83.9524674 219.882963%2C83.312459%22 id%3D%22%E8%B7%AF%E5%BE%84%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 transform%3D%22translate(159.153706%2C 112.486798) rotate(-30.000000) translate(-159.153706%2C -112.486798) %22%3E%3C%2Fpath%3E                    %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%22 fill%3D%22%23F3F3F3%22 cx%3D%22163.5%22 cy%3D%22192%22 rx%3D%2252.5%22 ry%3D%227%22%3E%3C%2Fellipse%3E                    %3Cg id%3D%22%E7%BC%96%E7%BB%84-6%22 transform%3D%22translate(91.193912%2C 51.429384) rotate(-27.000000) translate(-91.193912%2C -51.429384) translate(60.193912%2C 9.929384)%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22%3E                        %3Cg id%3D%22%E7%BC%96%E7%BB%84-7%22 transform%3D%22translate(0.786940%2C 0.763244)%22%3E                            %3Cline x1%3D%222.30968266%22 y1%3D%2220.6958975%22 x2%3D%2219.1247929%22 y2%3D%2281.4833223%22 id%3D%22%E8%B7%AF%E5%BE%84-7%22%3E%3C%2Fline%3E                            %3Cpath d%3D%22M4.40076845%2C12.1586723 C14.18426%2C12.008468 23.8773672%2C10.4826714 33.48009%2C7.5812824 C45.3069841%2C5.6445918 53.1423855%2C7.15782855 56.9862943%2C12.1209926 L56.9659592%2C40.435397 C52.0644619%2C35.2174997 44.2290233%2C33.7559457 33.4596436%2C36.0507351 C23.9350239%2C40.1485838 14.2419539%2C41.6226976 4.3804334%2C40.4730766 L4.40076845%2C12.1586723 Z%22 id%3D%22%E7%9F%A9%E5%BD%A2%22 fill%3D%22%23FFFFFF%22 transform%3D%22translate(30.683364%2C 23.808374) scale(-1%2C 1) rotate(16.000000) translate(-30.683364%2C -23.808374) %22%3E%3C%2Fpath%3E                        %3C%2Fg%3E                    %3C%2Fg%3E                    %3Cpath d%3D%22M49%2C94 C49.6565862%2C94 50.1961673%2C94.5009584 50.2573755%2C95.1415074 L50.2631579%2C95.2631579 L50.263%2C100.736 L55.7368421%2C100.736842 C56.4344649%2C100.736842 57%2C101.302377 57%2C102 C57%2C102.656586 56.4990416%2C103.196167 55.8584926%2C103.257376 L55.7368421%2C103.263158 L50.263%2C103.263 L50.2631579%2C108.736842 C50.2631579%2C109.434465 49.6976228%2C110 49%2C110 C48.3434138%2C110 47.8038327%2C109.499042 47.7426245%2C108.858493 L47.7368421%2C108.736842 L47.736%2C103.263 L42.2631579%2C103.263158 C41.5655351%2C103.263158 41%2C102.697623 41%2C102 C41%2C101.343414 41.5009584%2C100.803833 42.1415074%2C100.742624 L42.2631579%2C100.736842 L47.736%2C100.736 L47.7368421%2C95.2631579 C47.7368421%2C94.5655351 48.3023772%2C94 49%2C94 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88%22 fill%3D%22%23979797%22 fill-rule%3D%22nonzero%22 opacity%3D%220.4%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M265%2C126 C265.656586%2C126 266.196167%2C126.500958 266.257376%2C127.141507 L266.263158%2C127.263158 L266.263%2C132.736 L271.736842%2C132.736842 C272.434465%2C132.736842 273%2C133.302377 273%2C134 C273%2C134.656586 272.499042%2C135.196167 271.858493%2C135.257376 L271.736842%2C135.263158 L266.263%2C135.263 L266.263158%2C140.736842 C266.263158%2C141.434465 265.697623%2C142 265%2C142 C264.343414%2C142 263.803833%2C141.499042 263.742624%2C140.858493 L263.736842%2C140.736842 L263.736%2C135.263 L258.263158%2C135.263158 C257.565535%2C135.263158 257%2C134.697623 257%2C134 C257%2C133.343414 257.500958%2C132.803833 258.141507%2C132.742624 L258.263158%2C132.736842 L263.736%2C132.736 L263.736842%2C127.263158 C263.736842%2C126.565535 264.302377%2C126 265%2C126 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88%E5%A4%87%E4%BB%BD%22 fill%3D%22%23979797%22 fill-rule%3D%22nonzero%22 opacity%3D%220.4%22%3E%3C%2Fpath%3E                    %3Ccircle id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%22 fill%3D%22%23979797%22 cx%3D%2273.5%22 cy%3D%2242.5%22 r%3D%222.5%22%3E%3C%2Fcircle%3E                    %3Ccircle id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-12%22 fill%3D%22%23979797%22 cx%3D%2286.5%22 cy%3D%2236.5%22 r%3D%222.5%22%3E%3C%2Fcircle%3E                    %3Ccircle id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-13%22 fill%3D%22%23979797%22 cx%3D%2295.5%22 cy%3D%2227.5%22 r%3D%222.5%22%3E%3C%2Fcircle%3E                    %3Cpath d%3D%22M188.478532%2C27.430718 C190.17052%2C27.430718 191.606483%2C26.9866619 192.786422%2C26.0985498 C194.077676%2C25.1216265 194.723303%2C23.8116612 194.723303%2C22.1686538 C194.723303%2C20.2148071 193.465443%2C18.8049292 190.949725%2C17.9390199 C189.257737%2C17.3395442 187.242936%2C17.0398064 184.905321%2C17.0398064 C184.504587%2C17.0398064 183.480489%2C17.0620092 181.833028%2C17.1064148 C181.899817%2C16.062883 182.345076%2C13.653879 183.168807%2C9.8794025 L183.168807%2C9.8794025 L195.424587%2C9.8794025 C195.558165%2C9.61296887 195.624954%2C9.27992683 195.624954%2C8.88027639 C195.624954%2C8.54723435 195.580428%2C8.23639511 195.491376%2C7.94775867 C194.957064%2C7.94775867 193.342997%2C7.90335307 190.649174%2C7.81454186 C187.8663%2C7.70352785 185.495291%2C7.64802084 183.536147%2C7.64802084 C183.580673%2C7.42599281 183.658593%2C6.99303816 183.769908%2C6.34915688 C183.012966%2C6.10492606 182.333945%2C6.00501344 181.732844%2C6.04941905 C180.174434%2C11.4002945 179.395229%2C15.8075508 179.395229%2C19.271188 C183.55841%2C19.271188 186.330153%2C19.3599992 187.710459%2C19.5376217 C190.91633%2C19.9372721 192.519266%2C20.8364856 192.519266%2C22.2352622 C192.519266%2C23.8560668 191.049908%2C24.9662069 188.111193%2C25.5656826 C188.08893%2C25.7211022 188.077798%2C25.8765218 188.077798%2C26.0319414 C188.077798%2C26.5204031 188.211376%2C26.9866619 188.478532%2C27.430718 Z M210.485505%2C27.430718 C213.112538%2C27.430718 215.494679%2C26.4315919 217.631927%2C24.4333396 C219.746911%2C22.4128846 220.804404%2C20.1037931 220.804404%2C17.5060652 C220.804404%2C13.6649804 219.524281%2C10.7120076 216.964037%2C8.64714696 C216.407462%2C8.93578339 215.917676%2C9.42424505 215.494679%2C10.1125319 C216.652355%2C11.4447001 217.420428%2C12.5437388 217.798899%2C13.4096481 C218.244159%2C14.430977 218.466789%2C15.7409424 218.466789%2C17.3395442 C218.466789%2C19.2045796 217.609664%2C20.9808038 215.895413%2C22.6682168 C214.158899%2C24.3556298 212.355596%2C25.1993363 210.485505%2C25.1993363 C208.259205%2C25.1993363 206.300061%2C24.4111368 204.608073%2C22.8347378 C202.938349%2C21.2805417 202.103486%2C19.4044048 202.103486%2C17.2063274 C202.103486%2C14.9638443 202.838165%2C12.9544907 204.307523%2C11.1782665 C205.865933%2C9.31323104 207.747156%2C8.38071333 209.951193%2C8.38071333 C211.376024%2C8.38071333 212.800856%2C8.73595817 214.225688%2C9.44644785 C214.470581%2C9.29102823 214.715474%2C9.0245946 214.960367%2C8.64714696 C215.20526%2C8.29190212 215.327706%2C7.98106288 215.327706%2C7.71462925 C214.726606%2C7.20396479 213.891743%2C6.78211154 212.823119%2C6.4490695 C211.843547%2C6.16043306 210.930765%2C6.01611484 210.084771%2C6.01611484 C207.123792%2C6.01611484 204.630336%2C7.12625498 202.604404%2C9.34653524 C200.622997%2C11.4780043 199.632294%2C14.0313266 199.632294%2C17.0065022 C199.632294%2C19.9816777 200.689786%2C22.4572902 202.804771%2C24.4333396 C204.919755%2C26.4315919 207.48%2C27.430718 210.485505%2C27.430718 Z M233.193761%2C27.430718 C235.820795%2C27.430718 238.202936%2C26.4315919 240.340183%2C24.4333396 C242.455168%2C22.4128846 243.512661%2C20.1037931 243.512661%2C17.5060652 C243.512661%2C13.6649804 242.232538%2C10.7120076 239.672294%2C8.64714696 C239.115719%2C8.93578339 238.625933%2C9.42424505 238.202936%2C10.1125319 C239.360612%2C11.4447001 240.128685%2C12.5437388 240.507156%2C13.4096481 C240.952416%2C14.430977 241.175046%2C15.7409424 241.175046%2C17.3395442 C241.175046%2C19.2045796 240.31792%2C20.9808038 238.60367%2C22.6682168 C236.867156%2C24.3556298 235.063853%2C25.1993363 233.193761%2C25.1993363 C230.967462%2C25.1993363 229.008318%2C24.4111368 227.31633%2C22.8347378 C225.646606%2C21.2805417 224.811743%2C19.4044048 224.811743%2C17.2063274 C224.811743%2C14.9638443 225.546422%2C12.9544907 227.01578%2C11.1782665 C228.57419%2C9.31323104 230.455413%2C8.38071333 232.65945%2C8.38071333 C234.084281%2C8.38071333 235.509113%2C8.73595817 236.933945%2C9.44644785 C237.178838%2C9.29102823 237.423731%2C9.0245946 237.668624%2C8.64714696 C237.913517%2C8.29190212 238.035963%2C7.98106288 238.035963%2C7.71462925 C237.434862%2C7.20396479 236.6%2C6.78211154 235.531376%2C6.4490695 C234.551804%2C6.16043306 233.639021%2C6.01611484 232.793028%2C6.01611484 C229.832049%2C6.01611484 227.338593%2C7.12625498 225.312661%2C9.34653524 C223.331254%2C11.4780043 222.34055%2C14.0313266 222.34055%2C17.0065022 C222.34055%2C19.9816777 223.398043%2C22.4572902 225.513028%2C24.4333396 C227.628012%2C26.4315919 230.188257%2C27.430718 233.193761%2C27.430718 Z%22 id%3D%22500%22 fill-opacity%3D%220.45%22 fill%3D%22%23000000%22 fill-rule%3D%22nonzero%22 transform%3D%22translate(211.453945%2C 16.723416) rotate(-10.000000) translate(-211.453945%2C -16.723416) %22%3E%3C%2Fpath%3E                %3C%2Fg%3E            %3C%2Fg%3E        %3C%2Fg%3E    %3C%2Fg%3E%3C%2Fsvg%3E\")}.gk-alert-container .gk-alert-image.status-refresh{background-image:url(\"data:image/svg+xml,%3C%3Fxml version%3D%221.0%22 encoding%3D%22UTF-8%22%3F%3E%3Csvg width%3D%22326px%22 height%3D%22200px%22 viewBox%3D%220 0 326 200%22 version%3D%221.1%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E    %3Ctitle%3E%E7%BC%96%E7%BB%84 25%3C%2Ftitle%3E    %3Cg id%3D%22Components%22 stroke%3D%22none%22 stroke-width%3D%221%22 fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E        %3Cg id%3D%225.%E5%8F%8D%E9%A6%88%2F7.Result%E7%BB%93%E6%9E%9C%2F%E7%B3%BB%E7%BB%9F%E9%94%99%E8%AF%AF%22 transform%3D%22translate(-117.000000%2C 0.000000)%22%3E            %3Cg id%3D%22%E7%BC%96%E7%BB%84-25%22 transform%3D%22translate(117.000000%2C 0.000000)%22%3E                %3Crect id%3D%22%E7%9F%A9%E5%BD%A2%22 x%3D%220%22 y%3D%220%22 width%3D%22326%22 height%3D%22200%22%3E%3C%2Frect%3E                %3Cg id%3D%22%E7%BC%96%E7%BB%84-24%22 transform%3D%22translate(33.000000%2C 14.000000)%22%3E                    %3Cellipse id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-16%22 fill%3D%22%23F3F3F3%22 cx%3D%22135%22 cy%3D%22173%22 rx%3D%2262%22 ry%3D%2212%22%3E%3C%2Fellipse%3E                    %3Ccircle id%3D%22%E6%A4%AD%E5%9C%86%E5%BD%A2%E5%A4%87%E4%BB%BD-17%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 opacity%3D%220.39%22 cx%3D%22254%22 cy%3D%2216%22 r%3D%226%22%3E%3C%2Fcircle%3E                    %3Cpath d%3D%22M0%2C32 C11.9888316%2C20.5596274 32.3598356%2C18.5108339 61.113012%2C25.8536197 C94.2097941%2C34.2494418 110.614178%2C3.54335392 86.5550736%2C2.3764554 C71.3075576%2C1.3978559 68.8233997%2C15.3665226 74.2353314%2C17.1130274 C79.6472631%2C18.8595323 90.9954626%2C22.8805848 114.827665%2C11.5004099 C135.836735%2C0.443573705 190.902879%2C-6.02973471 203.102356%2C8.07030528 C215.301832%2C22.1703453 163.738935%2C26.0191765 163.73617%2C18.5307699 C163.733405%2C11.0423633 173.964837%2C11.5929991 176.509435%2C11.5119344 C206.025444%2C12.1534677 212.438281%2C30.1771761 248%2C20.9724718%22 id%3D%22%E8%B7%AF%E5%BE%84-9%E5%A4%87%E4%BB%BD%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 opacity%3D%220.389868024%22 stroke-dasharray%3D%224%2C4%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M30%2C81 C30.6565862%2C81 31.1961673%2C81.5009584 31.2573755%2C82.1415074 L31.2631579%2C82.2631579 L31.263%2C87.736 L36.7368421%2C87.7368421 C37.4344649%2C87.7368421 38%2C88.3023772 38%2C89 C38%2C89.6565862 37.4990416%2C90.1961673 36.8584926%2C90.2573755 L36.7368421%2C90.2631579 L31.263%2C90.263 L31.2631579%2C95.7368421 C31.2631579%2C96.4344649 30.6976228%2C97 30%2C97 C29.3434138%2C97 28.8038327%2C96.4990416 28.7426245%2C95.8584926 L28.7368421%2C95.7368421 L28.736%2C90.263 L23.2631579%2C90.2631579 C22.5655351%2C90.2631579 22%2C89.6976228 22%2C89 C22%2C88.3434138 22.5009584%2C87.8038327 23.1415074%2C87.7426245 L23.2631579%2C87.7368421 L28.736%2C87.736 L28.7368421%2C82.2631579 C28.7368421%2C81.5655351 29.3023772%2C81 30%2C81 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88%E5%A4%87%E4%BB%BD-5%22 fill%3D%22%23979797%22 fill-rule%3D%22nonzero%22 opacity%3D%220.4%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M48.0740865%2C0.0359272935 C49.5929693%2C0.423750577 51.0485652%2C1.0252724 52.4013202%2C1.82466325 C52.8838819%2C2.10959465 53.0737422%2C2.71903123 52.8522385%2C3.22557593 C52.3459442%2C4.3653015 52.5832697%2C5.66332228 53.4613737%2C6.54186074 C54.3394778%2C7.4203992 55.6368568%2C7.65784203 56.7760189%2C7.15129733 C57.290224%2C6.92176926 57.8914484%2C7.11172353 58.1762389%2C7.59452394 C58.9752345%2C8.94003329 59.5764589%2C10.3963493 59.9640905%2C11.9238981 C60.1064857%2C12.4700166 59.8137844%2C13.0319647 59.2916684%2C13.2298337 C58.1287738%2C13.6730603 57.3772433%2C14.7652973 57.3772433%2C16 C57.3772433%2C17.2347027 58.1287738%2C18.3269397 59.2916684%2C18.7701663 C59.8137844%2C18.9680353 60.1064857%2C19.5299834 59.9640905%2C20.0761019 C59.5764589%2C21.6036507 58.9752345%2C23.0599667 58.1683281%2C24.4054761 C57.8835375%2C24.8882765 57.2823131%2C25.0782307 56.768108%2C24.8487027 C55.628946%2C24.342158 54.331567%2C24.5796008 53.4534629%2C25.4581393 C52.5753588%2C26.3366777 52.3380334%2C27.6346985 52.8443276%2C28.7744241 C53.0737422%2C29.2888835 52.8838819%2C29.8904054 52.4013202%2C30.1753367 C51.0485652%2C30.9747276 49.6008801%2C31.5762494 48.0740865%2C31.9640727 C47.528238%2C32.1065384 46.9665679%2C31.8136922 46.7687967%2C31.291318 C46.3257892%2C30.1278482 45.2340922%2C29.3759459 44%2C29.3759459 C42.7659078%2C29.3759459 41.6742108%2C30.1278482 41.2312033%2C31.291318 C41.0255213%2C31.8136922 40.471762%2C32.1065384 39.9259135%2C31.9640727 C38.4070307%2C31.5762494 36.9514348%2C30.9747276 35.5986798%2C30.1753367 C35.1161181%2C29.8904054 34.9262578%2C29.2809688 35.1477615%2C28.7744241 C35.6540558%2C27.6346985 35.4167303%2C26.3366777 34.5386263%2C25.4581393 C33.6605222%2C24.5796008 32.3631432%2C24.342158 31.2239811%2C24.8487027 C30.709776%2C25.0782307 30.1085516%2C24.8882765 29.8237611%2C24.4054761 C29.0247655%2C23.0599667 28.4235411%2C21.6036507 28.0359095%2C20.0761019 C27.8935143%2C19.5299834 28.1862156%2C18.9680353 28.7083316%2C18.7701663 C29.8712262%2C18.3269397 30.6227567%2C17.2347027 30.6227567%2C16 C30.6227567%2C14.7652973 29.8712262%2C13.6730603 28.7083316%2C13.2298337 C28.1862156%2C13.0240499 27.8935143%2C12.4700166 28.0359095%2C11.9238981 C28.4235411%2C10.3963493 29.0247655%2C8.94003329 29.8316719%2C7.59452394 C30.1164625%2C7.11172353 30.7176869%2C6.92176926 31.231892%2C7.15129733 C32.371054%2C7.65784203 33.668433%2C7.4203992 34.5465371%2C6.54186074 C35.4167303%2C5.67123704 35.6619666%2C4.3653015 35.1556724%2C3.22557593 C34.9262578%2C2.71111647 35.1161181%2C2.10959465 35.5986798%2C1.82466325 C36.9435239%2C1.0252724 38.3991199%2C0.423750577 39.9259135%2C0.0359272935 C40.471762%2C-0.106538402 41.0334321%2C0.18630775 41.2312033%2C0.708681969 C41.6742108%2C1.87215182 42.7659078%2C2.6240541 44%2C2.6240541 C45.2340922%2C2.6240541 46.3257892%2C1.87215182 46.7687967%2C0.708681969 C46.9744787%2C0.18630775 47.528238%2C-0.106538402 48.0740865%2C0.0359272935 Z M48.9889809%2C16.3275718 C49.1870168%2C13.310864 46.6887179%2C10.8197946 43.6724791%2C11.0102433 C41.1817971%2C11.1626023 39.1709712%2C13.1813588 39.0110191%2C15.6724282 C38.8129832%2C18.689136 41.3112821%2C21.1802054 44.3275209%2C20.9897567 C46.8182029%2C20.8297798 48.8290288%2C18.8186412 48.9889809%2C16.3275718 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23F2F2F2%22 fill-rule%3D%22nonzero%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M226%2C117 C226.656586%2C117 227.196167%2C117.500958 227.257376%2C118.141507 L227.263158%2C118.263158 L227.263%2C123.736 L232.736842%2C123.736842 C233.434465%2C123.736842 234%2C124.302377 234%2C125 C234%2C125.656586 233.499042%2C126.196167 232.858493%2C126.257376 L232.736842%2C126.263158 L227.263%2C126.263 L227.263158%2C131.736842 C227.263158%2C132.434465 226.697623%2C133 226%2C133 C225.343414%2C133 224.803833%2C132.499042 224.742624%2C131.858493 L224.736842%2C131.736842 L224.736%2C126.263 L219.263158%2C126.263158 C218.565535%2C126.263158 218%2C125.697623 218%2C125 C218%2C124.343414 218.500958%2C123.803833 219.141507%2C123.742624 L219.263158%2C123.736842 L224.736%2C123.736 L224.736842%2C118.263158 C224.736842%2C117.565535 225.302377%2C117 226%2C117 Z%22 id%3D%22%E5%BD%A2%E7%8A%B6%E7%BB%93%E5%90%88%E5%A4%87%E4%BB%BD-6%22 fill%3D%22%23979797%22 fill-rule%3D%22nonzero%22 opacity%3D%220.4%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M169.426384%2C140.016421 C168.022935%2C148.782185 170.880807%2C153.165067 178%2C153.165067 C188.67879%2C153.165067 189.039859%2C153.640489 189.039859%2C161 C189.039859%2C165.906341 195.693239%2C167.906341 209%2C167%22 id%3D%22%E8%B7%AF%E5%BE%84-12%22 stroke%3D%22%23979797%22 stroke-width%3D%222%22%3E%3C%2Fpath%3E                    %3Cpath d%3D%22M212.05702%2C163.31925 C214.70468%2C162.824806 217.35234%2C162.577585 220%2C162.577585 C222.64766%2C162.577585 225.29532%2C162.824806 227.94298%2C163.31925 C229.715226%2C163.650204 231%2C165.197117 231%2C167 C231%2C168.656854 229.656854%2C170 228%2C170 L212%2C170 C210.343146%2C170 209%2C168.656854 209%2C167 C209%2C165.197117 210.284774%2C163.650204 212.05702%2C163.31925 Z%22 id%3D%22%E7%9F%A9%E5%BD%A2%22 stroke%3D%22%23979797%22 stroke-width%3D%222%22 fill%3D%22%23F3F3F3%22%3E%3C%2Fpath%3E                    %3Crect id%3D%22%E7%9F%A9%E5%BD%A2%E5%A4%87%E4%BB%BD-6%22 stroke%3D%22%23979797%22 stroke-width%3D%222%22 fill%3D%22%23FFFFFF%22 x%3D%22218%22 y%3D%22161%22 width%3D%224%22 height%3D%225%22 rx%3D%222%22%3E%3C%2Frect%3E                    %3Cg id%3D%22%E7%BC%96%E7%BB%84-22%22 transform%3D%22translate(60.000000%2C 38.000000)%22%3E                        %3Cpolygon id%3D%22%E7%9F%A9%E5%BD%A2%E5%A4%87%E4%BB%BD-4%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23E5E5E5%22 points%3D%2264.4444444 86 85.5555556 86 90 129 60 129%22%3E%3C%2Fpolygon%3E                        %3Crect id%3D%22%E7%9F%A9%E5%BD%A2%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23FFFFFF%22 x%3D%220%22 y%3D%220%22 width%3D%22149%22 height%3D%22106%22 rx%3D%228%22%3E%3C%2Frect%3E                        %3Crect id%3D%22%E7%9F%A9%E5%BD%A2%E5%A4%87%E4%BB%BD-3%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23FFFFFF%22 x%3D%229%22 y%3D%229%22 width%3D%22131%22 height%3D%2289%22 rx%3D%224%22%3E%3C%2Frect%3E                        %3Cg id%3D%22%E7%BC%96%E7%BB%84%22 transform%3D%22translate(55.000000%2C 32.000000)%22 fill%3D%22%23979797%22 fill-rule%3D%22nonzero%22%3E                            %3Cpath d%3D%22M37.7204233%2C25.7280335 C36.8307907%2C25.5481171 35.7632316%2C26.0878661 35.585305%2C26.9874477 C33.8060397%2C34.3640167 27.4006849%2C39.4016736 19.9277708%2C39.4016736 C11.0314445%2C39.4016736 3.73645699%2C32.0251046 3.73645699%2C23.0292887 C3.73645699%2C14.0334728 11.0314445%2C6.65690375 19.9277708%2C6.65690375 C24.0200809%2C6.65690375 28.1123909%2C8.27615062 30.9592154%2C11.1548117 L23.4863013%2C11.1548117 C22.5966687%2C11.1548117 21.707036%2C11.874477 21.7070361%2C12.9539749 C21.7070361%2C13.8535565 22.4187422%2C14.7531381 23.4863013%2C14.7531381 L34.5177459%2C14.7531381 C35.4073785%2C14.7531381 36.2970111%2C14.0334728 36.2970111%2C12.9539749 L36.2970111%2C1.7991632 C36.2970111%2C0.89958162 35.585305%2C0 34.5177459%2C0 C33.6281132%2C0 32.7384806%2C0.719665288 32.7384806%2C1.7991632 L32.7384806%2C8.09623433 C29.1799501%2C4.8577406 24.5538604%2C3.05857744 19.7498443%2C3.0585774 C8.89632622%2C3.0585774 0%2C12.0543933 0%2C23.0292887 C0%2C34.0041841 8.89632626%2C43 19.7498443%2C43 C28.824097%2C43 36.6528641%2C36.7029289 38.965909%2C27.8870293 C39.1438355%2C26.9874477 38.6100559%2C26.0878661 37.7204233%2C25.7280335 Z%22 id%3D%22%E8%B7%AF%E5%BE%84%22%3E%3C%2Fpath%3E                        %3C%2Fg%3E                        %3Crect id%3D%22%E7%9F%A9%E5%BD%A2%E5%A4%87%E4%BB%BD-5%22 stroke%3D%22%23979797%22 stroke-width%3D%223%22 fill%3D%22%23F2F2F2%22 x%3D%2247%22 y%3D%22128%22 width%3D%2257%22 height%3D%227%22 rx%3D%223.5%22%3E%3C%2Frect%3E                    %3C%2Fg%3E                %3C%2Fg%3E            %3C%2Fg%3E        %3C%2Fg%3E    %3C%2Fg%3E%3C%2Fsvg%3E\")}.gk-alert-container .gk-alert-text{color:#000;font-size:16px;height:22px;line-height:22px;margin-top:24px;opacity:.85;vertical-align:top}.gk-alert-container .gk-alert-button{background-color:#3266fb;border-radius:8px;color:#fff;cursor:pointer;display:inline-block;font-size:16px;height:40px;line-height:40px;margin-top:40px;vertical-align:top;width:96px}"]
            },] }
];
AlertComponent.ctorParameters = () => [];
AlertComponent.propDecorators = {
    status: [{ type: Input }],
    hideButton: [{ type: Input }],
    homeHref: [{ type: Input }]
};

class GKAlertModule {
}
GKAlertModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    AlertComponent,
                ],
                imports: [
                    CommonModule,
                    RouterModule,
                ],
                exports: [
                    AlertComponent,
                ],
            },] }
];

function isGKList2CustomBtn1(btn) {
    return !!btn.btn;
}
function isGKList2AddBtn(btn) {
    return btn.mode === 'add';
}
/* config end */
class GKList2 {
    constructor(config) {
        this.config = config;
        this.createTable = () => {
            const tableConfig = this.config.table;
            if (tableConfig.pageMode !== 'server') {
                return new GKTable2(Object.assign(Object.assign({}, tableConfig), { source: () => __awaiter(this, void 0, void 0, function* () {
                        return yield tableConfig.source(this.getSearchParams());
                    }) }));
            }
            else {
                return new GKTable2(Object.assign(Object.assign({}, tableConfig), { source: (tableParams) => __awaiter(this, void 0, void 0, function* () {
                        return yield tableConfig.source(this.getSearchParams(), tableParams);
                    }) }));
            }
        };
        if (config.search) {
            this.searchFormGroup = config.search.layouts.getFormGroup();
            if (config.search.layouts.initValue) {
                this.searchFormGroup.patchValue(config.search.layouts.initValue);
            }
        }
        else {
            this.searchFormGroup = new FormGroup({});
        }
        this.table = this.createTable();
    }
    getSearchParams() {
        const searchParams = util.cloneDeep(this.lastSearchParams);
        if (this.config.table.paramClean !== false) {
            for (const [key, value] of Object.entries(searchParams)) {
                if ([undefined, null].includes(value)) {
                    delete searchParams[key];
                }
            }
        }
        return searchParams;
    }
}

class List2Component {
    constructor(nzIcon, gkReq) {
        this.nzIcon = nzIcon;
        this.gkReq = gkReq;
        this.contentBtns = {
            left: [],
            right: [],
        };
        /* 勾选 Input Output */
        this.checkTrs = [];
        this.checksChange = new EventEmitter(); // 勾选项发生变化
        this.nzIcon.addIcon(PlusOutline);
    }
    get list() { return this._list; }
    set list(newVal) {
        var _a, _b;
        this._list = newVal;
        this.contentBtns.left = this.handlerBtns((_a = this.list.config.content.btns) === null || _a === void 0 ? void 0 : _a.left);
        this.contentBtns.right = this.handlerBtns((_b = this.list.config.content.btns) === null || _b === void 0 ? void 0 : _b.right);
    }
    get checks() { return this.checkTrs; }
    set checks(newVal) {
        if (this.checkTrs !== newVal) {
            this.checkTrs = newVal;
            this.checksChange.emit(newVal);
        }
    }
    onSearch() {
        this.list.lastSearchParams = util.cloneDeep(this.list.searchFormGroup.value);
        console.info('list.lastSearchParams', this.list.lastSearchParams);
        this.list.table.refresh();
    }
    onReset() {
        var _a;
        // 清除排序状态
        this.list.table.component.sortKey = undefined;
        this.list.table.component.sortState = null;
        // 配置重置刷新表格
        if ((_a = this.list.config.search) === null || _a === void 0 ? void 0 : _a.resetRefresh) {
            this.onSearch();
        }
    }
    getFunc(v) {
        return typeof v === 'function' ? v() : v;
    }
    get contentTitle() {
        var _a, _b, _c;
        if (this.list.config.content.title) {
            return this.list.config.content.title;
        }
        if ((((_a = this.list.config.search) === null || _a === void 0 ? void 0 : _a.fastBtns) || []).length > 0 ||
            (((_b = this.list.config.content.btns) === null || _b === void 0 ? void 0 : _b.left) || []).length > 0 ||
            (((_c = this.list.config.content.btns) === null || _c === void 0 ? void 0 : _c.left) || []).length > 0) {
            return ' ';
        }
        return '';
    }
    handlerBtns(btns) {
        return (btns || []).map((btn) => {
            if (isGKList2AddBtn(btn)) {
                return this.createAddBtn(btn);
            }
            // GKList2CustomBtnInter
            if (btn instanceof GKButton) {
                return {
                    hide: undefined,
                    type: undefined,
                    disabled: undefined,
                    btn,
                };
            }
            else if (isGKList2CustomBtn1(btn)) {
                return btn;
            }
            else {
                const buttonConfig = Object.assign(Object.assign({}, btn), { type: undefined, disabled: undefined });
                return {
                    hide: btn.hide,
                    type: btn.type,
                    disabled: btn.disabled,
                    btn: new GKButton(buttonConfig),
                };
            }
        });
    }
    createAddBtn(btn) {
        const customBtn = {
            hide: btn.hide,
            type: btn.type,
            disabled: btn.disabled,
            btn: new GKButton({
                label: btn.label || '新增',
                icon: btn.icon || 'plus',
                onClick: () => {
                    const tableComponent = this.list.table.component;
                    tableComponent.modal = {
                        show: true,
                        width: btn.width,
                        title: btn.title || btn.label || '新增',
                        type: 'io',
                        ioControl: btn.ioControl,
                        data: btn.data,
                        onCancel: () => {
                            tableComponent.initModal();
                        },
                        onOk: () => __awaiter(this, void 0, void 0, function* () {
                            const formGroup = tableComponent.modal.ioControl.getFormGroup();
                            if (btn.onBeforeSubmit) {
                                const flag = yield btn.onBeforeSubmit(formGroup);
                                if (flag === false) {
                                    return;
                                }
                            }
                            for (const control of Object.values(formGroup.controls)) {
                                control.markAsDirty();
                                control.updateValueAndValidity();
                            }
                            if (formGroup.status === 'PENDING') {
                                yield new Promise((resolve) => {
                                    const formSubscription = formGroup.statusChanges.subscribe(() => {
                                        if (formGroup.status !== 'PENDING') {
                                            formSubscription.unsubscribe();
                                            resolve();
                                        }
                                    });
                                });
                            }
                            if (!formGroup.valid) {
                                return;
                            }
                            let params = formGroup.value;
                            if (btn.formatParams) {
                                params = yield btn.formatParams(formGroup);
                            }
                            this.gkReq.request(btn.api, params, true).subscribe({
                                next: (resp) => {
                                    var _a;
                                    if (((_a = resp.body) === null || _a === void 0 ? void 0 : _a.code) === 0) {
                                        tableComponent.initModal();
                                    }
                                    if (btn.onAfterSubmit) {
                                        btn.onAfterSubmit(resp);
                                    }
                                },
                            });
                        }),
                    };
                    if (btn.onShowModal) {
                        setTimeout(() => {
                            const formGroup = tableComponent.modal.ioControl.getFormGroup();
                            btn.onShowModal(formGroup);
                        }, 0);
                    }
                },
            }),
        };
        return customBtn;
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.onSearch();
        }, 0);
    }
    onTableAjaxBefore() {
        this.checkSearchParams();
    }
    checkSearchParams() {
        const searchParams = this.list.searchFormGroup.value;
        for (const [key, value] of Object.entries(searchParams)) {
            if (!util.isEqual(this.list.lastSearchParams[key], value)) {
                this.list.searchFormGroup.patchValue({
                    [key]: this.list.lastSearchParams[key],
                });
            }
        }
    }
}
List2Component.decorators = [
    { type: Component, args: [{
                selector: 'gk-list2',
                template: "<div *ngIf=\"list.config.search\" class=\"gk-m-b\">\n    <gk-panel [title]=\"list.config.search.title\">\n        <gk-search [searchs]=\"list.config.search.layouts\" (searchEvent)=\"onSearch()\" (resetEvent)=\"onReset()\">\n        </gk-search>\n    </gk-panel>\n</div>\n<div>\n    <gk-panel [title]=\"contentTitle\">\n        <div id=\"title-left\">\n            <!-- <ng-container *ngFor=\"let btn of list.config.search.fastBtns || []\">\n                <gk-button [type]=\"btn.type\" [icon]=\"btn.icon\" [active]=\"false\" (click)=\"onFastBtnClick(btn.value)\">\n                    {{ btn.label }}\n                </gk-button>  // TODO\n            </ng-container> -->\n\n            <ng-container *ngFor=\"let item of contentBtns.left\">\n                <gk-button *ngIf=\"!item.hide || !item.hide()\" [button]=\"item.btn\" [type]=\"getFunc(item.type)\"\n                    [disabled]=\"item.disabled && item.disabled()\"></gk-button>\n            </ng-container>\n\n            <ng-content select=\"#title-left\"></ng-content>\n        </div>\n        <div id=\"title-right\">\n            <ng-content select=\"#title-right\"></ng-content>\n\n            <ng-container *ngFor=\"let item of contentBtns.right\">\n                <gk-button *ngIf=\"!item.hide || !item.hide()\" [button]=\"item.btn\" [type]=\"getFunc(item.type)\"\n                    [disabled]=\"item.disabled && item.disabled()\"></gk-button>\n            </ng-container>\n        </div>\n\n        <gk-table2 [table]=\"list.table\" [initLoad]=\"false\" [(checks)]=\"checks\" (tableAjaxBefore)=\"onTableAjaxBefore()\">\n        </gk-table2>\n    </gk-panel>\n</div>\n",
                styles: [".gk-text{color:#595959;font-size:14px}.gk-text-stress{color:#595959;color:#262626;font-size:14px}.gk-text-minor,.gk-text-minor.ant-form-item-label>label{color:#8c8c8c}.gk-text-hint{color:#bfbfbf}.gk-title,.gk-title-minor{color:#262626;font-size:16px;font-weight:500}.gk-title-minor{font-size:14px}.gk-title-stress{color:#262626;font-size:16px;font-size:18px;font-weight:500}.gk-m-t{margin-top:16px}.gk-m-b{margin-bottom:16px}.gk-m-l{margin-left:16px}.gk-m-r{margin-right:16px}.gk-p-t{padding-top:16px}.gk-p-b{padding-bottom:16px}.gk-p-l{padding-left:16px}.gk-p-r{padding-right:16px}.gk-flt{float:left}.gk-frt{float:right}.gk-clr:after{clear:both;content:\"\";display:block}body{background-color:#f5f5f5}.ant-menu-inline,.ant-menu-vertical,.ant-menu-vertical-left{border-right:0}.ant-menu-inline .ant-menu-item,.ant-menu-inline .ant-menu-submenu-title{width:100%}.gk-search-group-container .ant-input-number-handler-wrap{display:none}.ant-checkbox-inner,.ant-tree-checkbox-inner{border-radius:4px}.ant-table-tbody>tr>td,.ant-table-thead>tr>th,.ant-table tfoot>tr>td,.ant-table tfoot>tr>th{height:54px;padding:10px 16px}.ant-input{height:32px}.ant-input-affix-wrapper{padding-bottom:0;padding-top:0}.ant-dropdown-menu-item:hover,.ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled){color:#3266fb}.ant-modal-footer{border-top:0;padding:8px 24px 32px}.ant-modal-body{padding:16px 24px 0}.gk-modal-bottom .gk-btn{margin-left:8px}.gk-modal-bottom .gk-btn:first-child{margin-left:0}"]
            },] }
];
List2Component.ctorParameters = () => [
    { type: NzIconService },
    { type: GKRequestService }
];
List2Component.propDecorators = {
    list: [{ type: Input }],
    checks: [{ type: Input }],
    checksChange: [{ type: Output }]
};

class GKList2Module {
}
GKList2Module.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    List2Component,
                ],
                imports: [
                    CommonModule,
                    NzModalModule,
                    GKIconModule,
                    GKButtonModule,
                    GKPanelModule,
                    GKIOModule,
                    GKSearchModule,
                    GKTable2Module,
                ],
                exports: [
                    List2Component,
                ],
            },] }
];

class UploadService {
    constructor(http) {
        this.http = http;
    }
    getFileSuffix(fileName) {
        if (fileName.length === 0 || !fileName.includes('.')) {
            return '';
        }
        const list = fileName.split('.');
        if (list.length === 2 && list[0] === '') {
            return '';
        }
        return list[list.length - 1].toLowerCase();
    }
    getChunkSize(fileSize) {
        let chunkSize = this.config.chunkSize;
        let chunkNumber = Math.ceil(fileSize / chunkSize);
        const maxChunkNumber = 10 * 1000;
        if (chunkNumber > maxChunkNumber) {
            chunkSize = Math.ceil(fileSize / maxChunkNumber);
            chunkNumber = Math.ceil(fileSize / chunkSize);
            console.warn(`分片大小被强制设置为 ${chunkSize}, 因为当分片大小小于该值时, 分片数量将大于10000片`);
        }
        console.info(`分片大小: ${(chunkSize / 1024).toFixed(2)}KB  分片数量: ${chunkNumber}`);
        return chunkSize;
    }
    parallelUpload(store) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobs = new Array(this.config.parallel).fill('').map((_, index) => this.uploadJob(store, index));
            const jobsSttaus = yield Promise.all(jobs);
            const isStop = jobsSttaus.some((v) => v === 3);
            const isError = jobsSttaus.some((v) => v === 1);
            return [isStop, isError];
        });
    }
    uploadJob(store, index) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
                0: 线程完成任务退出
                1: 线程出错退出
                2: 线程检测到其他线程出错退出
                3: 取消动作退出
            */
            while (true) {
                if (store.status === 'stopping') {
                    console.warn(`上传线程${index}检测到 取消动作, 直接退出`);
                    return 3;
                }
                if (store.status === 'error') {
                    console.warn(`上传线程${index}检测到 其他地方已出错, 直接退出`);
                    return 2;
                }
                const waitCheckChunks = store.chunks.filter((chunk) => chunk.state === 'waitCheck');
                if (waitCheckChunks.length === 0) {
                    if (store.sliceState === 'done') {
                        return 0;
                    }
                    else {
                        yield util.sleep(1000);
                    }
                }
                else {
                    const chunk = waitCheckChunks[0];
                    const [checkError, earlyExist] = yield this.checkChunkExist(store, chunk);
                    if (checkError) {
                        console.error(`上传线程${index}在checkChunkExist时出错, 抛出错误`, checkError);
                        return 1;
                    }
                    if (!earlyExist) {
                        const uploadError = yield this.uploadChunkBlob(store, chunk);
                        if (uploadError) {
                            console.error(`上传线程${index}在uploadChunkBlob时出错, 抛出错误`, checkError);
                            return 1;
                        }
                    }
                    delete chunk.blob;
                    chunk.state = 'done';
                    store.uploadSize += chunk.size;
                    store.progress = Math.floor((store.uploadSize / store.file.size * 0.9 * 100));
                }
            }
        });
    }
    checkChunkExist(store, chunk) {
        return new Promise((resolve) => {
            chunk.state = 'checking';
            this.http.get(`${this.config.apiPrefix}/fileUpload/chunkCheck`, {
                params: {
                    taskID: store.uuid,
                    fileSize: String(store.file.size),
                    chunkSize: String(chunk.size),
                    chunkMD5: chunk.md5,
                },
            }).pipe(retry(3)).subscribe({
                next: (resp) => {
                    const { code, data } = resp;
                    if (code !== 0) {
                        chunk.state = 'checkError';
                        store.status = 'error';
                        resolve([new Error('检查分片信息时出错'), false]);
                    }
                    else {
                        resolve([null, !!data.exist]);
                    }
                },
                error: (error) => {
                    chunk.state = 'checkError';
                    store.status = 'error';
                    resolve([error, false]);
                },
            });
        });
    }
    uploadChunkBlob(store, chunk) {
        return new Promise((resolve) => {
            const formData = new FormData();
            formData.append('taskID', store.uuid);
            formData.append('fileSize', String(store.file.size));
            // formData.append('chunkSize', String(chunk.size))
            formData.append('chunkMD5', chunk.md5);
            formData.append('chunkFile', chunk.blob);
            this.http.post(`${this.config.apiPrefix}/fileUpload/chunkUpload`, formData, {
                headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
            }).pipe(retry(3)).subscribe({
                next: (resp) => {
                    const { code } = resp;
                    if (code !== 0) {
                        chunk.state = 'uploadError';
                        store.status = 'error';
                        resolve(new Error('上传分片时出错'));
                    }
                    else {
                        resolve(null);
                    }
                },
                error: (error) => {
                    chunk.state = 'uploadError';
                    store.status = 'error';
                    resolve(error);
                },
            });
        });
    }
    chunkMerge(store) {
        return __awaiter(this, void 0, void 0, function* () {
            store.status = 'merging';
            const [startMergeError, mergeId] = yield this.startChunkMerge(store);
            if (startMergeError) {
                console.error(`分片全部上传完成, 触发文件合并时出错, 抛出错误`, startMergeError);
                return [true, ''];
            }
            while (true) {
                const { error: checkMergeError, progress, success, fileId } = yield this.checkChunkMerge(store, mergeId);
                if (checkMergeError) {
                    console.error(`已触发文件合并, 检查文件合并状态时出错, 抛出错误`, checkMergeError);
                    return [true, ''];
                }
                store.progress = 90 + (Math.floor(progress * 0.1) || 0);
                if (success) {
                    store.status = 'success';
                    return [false, fileId];
                }
                yield util.sleep(5000);
            }
        });
    }
    startChunkMerge(store) {
        return new Promise((resolve) => {
            store.chunks.sort((a, b) => {
                return a.index - b.index;
            });
            this.http.post(`${this.config.apiPrefix}/fileUpload/chunkMerge`, {
                taskID: store.uuid,
                fileName: store.file.name,
                fileSize: store.file.size,
                fileMD5: store.fileMd5,
                chunks: store.chunks.map(({ index, size, md5 }) => ({ index, size, MD5: md5 })),
            }).pipe(retry(3)).subscribe({
                next: (resp) => {
                    const { code, data } = resp;
                    if (code !== 0) {
                        store.status = 'error';
                        resolve([new Error('触发文件分片合并时出错'), '']);
                    }
                    else {
                        resolve([null, data.mergeID]);
                    }
                },
                error: (error) => {
                    store.status = 'error';
                    resolve([error, '']);
                },
            });
        });
    }
    checkChunkMerge(store, mergeId) {
        return new Promise((resolve) => {
            this.http.get(`${this.config.apiPrefix}/fileUpload/mergeTask`, {
                params: {
                    mergeID: mergeId,
                },
            }).pipe(retry(3)).subscribe({
                next: (resp) => {
                    const { code, data } = resp;
                    if (code === 210001) {
                        resolve({
                            error: null,
                            progress: data.mergeProgress,
                            success: false,
                            fileId: undefined,
                        });
                    }
                    else if (code === 210002) {
                        resolve({
                            error: null,
                            progress: 100,
                            success: true,
                            fileId: (data || {}).fileID,
                        });
                    }
                    else {
                        store.status = 'error';
                        resolve({
                            error: new Error('获取文件分片状态时出错'),
                            progress: 0,
                            success: false,
                            fileId: undefined,
                        });
                    }
                },
                error: (error) => {
                    store.status = 'error';
                    resolve({
                        error,
                        progress: 0,
                        success: false,
                        fileId: undefined,
                    });
                },
            });
        });
    }
}
UploadService.ɵprov = ɵɵdefineInjectable({ factory: function UploadService_Factory() { return new UploadService(ɵɵinject(HttpClient)); }, token: UploadService, providedIn: "root" });
UploadService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
UploadService.ctorParameters = () => [
    { type: HttpClient }
];

class BigUploadComponent {
    constructor(message, nzIcon, upload) {
        this.message = message;
        this.nzIcon = nzIcon;
        this.upload = upload;
        this.SIZE_1M = 1024 * 1024;
        this.SIZE_1G = 1024 * this.SIZE_1M;
        this.defaultConfig = {
            spans: [6, 14],
            label: '文件',
            required: true,
            buttonText: '选择文件',
            uploadDisabled: false,
            apiPrefix: '',
            chunkSize: 4 * this.SIZE_1M,
            parallel: 3,
            suffixs: [],
            uploadText: '正在上传文件, 请耐心等待',
            errorText: '上传失败, 请重试',
            successText: '文件已成功上传',
            showUploadCancel: true,
            onCancelBtn: undefined,
            onSelectBefore: undefined,
            onSelectAfter: undefined,
            onUploadBefore: undefined,
            onChunkUploaded: undefined,
            onUploadCancel: undefined,
            onUploadError: undefined,
            onUploadSuccess: undefined,
            onUploadFinish: undefined,
            onSuccessButton: undefined,
        };
        this.nzBeforeUpload = (file) => {
            if (!file.size) {
                this.message.warning('获取文件大小异常, 请检查文件');
                return false;
            }
            console.info(`获取的到文件大小 ${(file.size / this.SIZE_1M).toFixed(2)}MB`);
            if (file.size > 1000 * this.SIZE_1G) {
                this.message.warning('文件最大请不要超过1000G');
                return false;
            }
            if (this.config.suffixs.length > 0 &&
                !this.config.suffixs.map((s) => s.toLowerCase())
                    .includes(this.upload.getFileSuffix(file.name))) {
                this.message.warning(`文件后缀名仅支持${this.config.suffixs.join('、')}`);
                return false;
            }
            this.store.file = file;
            if (this.config.onSelectAfter) {
                this.config.onSelectAfter(this.store.file);
            }
            return false;
        };
        this.nzIcon.addIcon(UploadOutline, PaperClipOutline, DeleteOutline);
    }
    get instance() { return this._instance; }
    set instance(newVal) {
        this._instance = newVal;
        // this.config = util.merge({}, this.defaultConfig, this.instance.config)
        this.store = this.instance.store;
        this.initStore = this.instance.initStore;
    }
    get config() {
        return util.merge({}, this.defaultConfig, this.instance.config);
    }
    ngOnInit() {
        if (typeof Worker === 'undefined') {
            console.error('worker 未传入, 无法继续');
            return;
        }
        const minChunkSize = 100 * 1024;
        if (this.config.chunkSize < minChunkSize) {
            console.error('分片大小最小可配置 100KB');
            return;
        }
        if (!Number.isInteger(this.config.parallel) || this.config.parallel < 1 || this.config.parallel > 10) {
            console.error('线程数需为 1 到 10 之间的整数');
            return;
        }
        this.upload.config = this.config;
        this.initStore();
        this.worker.onmessage = ({ data: { type, data } }) => {
            if (type === 'addChunk') {
                const { chunk } = data;
                this.store.chunks.push(chunk);
            }
            else if (type === 'endSlice') {
                const { fileMd5 } = data;
                this.store.fileMd5 = fileMd5;
                this.store.sliceState = 'done';
            }
        };
    }
    onSelect($event, nzUpload) {
        return __awaiter(this, void 0, void 0, function* () {
            $event.preventDefault();
            $event.stopPropagation();
            if (this.config.onSelectBefore) {
                const flag = yield this.config.onSelectBefore();
                if (!flag) {
                    return;
                }
            }
            nzUpload.uploadComp.file.nativeElement.click();
        });
    }
    onDelete() {
        this.store.file = undefined;
    }
    onUpload() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.store.file) {
                this.message.warning(`请选择需上传的文件`);
                return;
            }
            if (this.config.onUploadBefore) {
                const flag = yield this.config.onUploadBefore(this.store.file);
                if (!flag) {
                    return;
                }
            }
            yield this.startUploadMain(this.store.file);
            if (this.config.onUploadFinish) {
                this.config.onUploadFinish();
            }
        });
    }
    onStopUpload() {
        if (this.store.status === 'uploading') {
            this.store.status = 'stopping';
            this.worker.postMessage({
                type: 'clickStop',
            });
        }
        else if (this.store.status === 'merging') {
            this.message.warning('文件分片合并中, 无法取消');
        }
    }
    onSuccess() {
        this.initStore();
        if (this.config.onSuccessButton) {
            this.config.onSuccessButton();
        }
    }
    onRetry() {
        const file = this.store.file;
        this.initStore();
        this.store.file = file;
    }
    startUploadMain(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const uuid = v4();
            util.merge(this.store, {
                status: 'uploading',
                uuid,
                file,
                fileMd5: '',
                chunkSizeGlobal: this.upload.getChunkSize(file.size),
                sliceState: 'wait',
                chunks: [],
                uploadSize: 0,
                progress: 0,
            });
            this.store.sliceState = 'doing';
            this.worker.postMessage({
                type: 'startSliceChunk',
                data: {
                    file: this.store.file,
                    chunkSizeGlobal: this.store.chunkSizeGlobal,
                },
            });
            console.info(`开始进行 ${this.config.parallel}线程 分片上传`);
            const [isUploadStop, isUploadError] = yield this.upload.parallelUpload(this.store);
            if (isUploadStop) {
                console.warn(`上传中 因取消动作, 所有线程已退出`);
                this.initStore();
                if (this.config.onUploadCancel) {
                    this.config.onUploadCancel();
                }
                return;
            }
            if (isUploadError) {
                console.warn(`上传中 有线程出错, 所有线程已退出`);
                this.store.chunks = []; /* 优化内存占用 */
                this.worker.postMessage({
                    type: 'someError',
                });
                if (this.config.onUploadError) {
                    this.config.onUploadError();
                }
                return;
            }
            console.info(`所有分片完成上传`);
            if (this.config.onChunkUploaded) {
                this.config.onChunkUploaded();
            }
            console.info('开始进行分片合并');
            const [isMergeError, fileId] = yield this.upload.chunkMerge(this.store);
            if (isMergeError) {
                this.store.chunks = []; /* 优化内存占用 */
                this.worker.postMessage({
                    type: 'someError',
                });
                if (this.config.onUploadError) {
                    this.config.onUploadError();
                }
                return;
            }
            this.store.chunks = []; /* 优化内存占用 */
            console.info('文件上传成功');
            if (this.config.onUploadSuccess) {
                this.config.onUploadSuccess(fileId);
            }
        });
    }
}
BigUploadComponent.decorators = [
    { type: Component, args: [{
                selector: 'gk-big-upload',
                template: "<div class=\"gk-big-upload-container\">\n    <ng-container *ngIf=\"store.status === 'wait'\">\n        <form nz-form>\n            <ng-content></ng-content>\n            <ng-content select=\"#form-before\"></ng-content>\n            <nz-form-item>\n                <nz-form-label [nzSpan]=\"config.spans[0]\" [nzRequired]=\"config.required\">{{ config.label\n                    }}</nz-form-label>\n                <nz-form-control [nzSpan]=\"config.spans[1]\">\n                    <ng-container *ngIf=\"!store.file\">\n                        <nz-upload #nzUpload nzAction=\"\" [nzBeforeUpload]=\"nzBeforeUpload\">\n                            <gk-button [label]=\"config.buttonText\" icon=\"upload\" (click)=\"onSelect($event, nzUpload)\">\n                            </gk-button>\n                        </nz-upload>\n                    </ng-container>\n                    <ng-container *ngIf=\"store.file\">\n                        <div>\n                            <gk-icon type=\"paper-clip\" style=\"margin-right: 6px;\"></gk-icon>\n                            <span>{{ store.file.name }}</span>\n                            <gk-button mode=\"text\" (click)=\"onDelete()\" style=\"margin-left: 3px;\">\n                                <gk-icon type=\"delete\" style=\"color: #ff4d4f;\"></gk-icon>\n                            </gk-button>\n                        </div>\n                    </ng-container>\n                    <div *ngIf=\"config.suffixs.length > 0\" style=\"margin-top: 5px;\">\u6587\u4EF6\u540E\u7F00\u540D: {{\n                        config.suffixs.join('\u3001')\n                        }}</div>\n                </nz-form-control>\n            </nz-form-item>\n            <ng-content select=\"#form-after\"></ng-content>\n        </form>\n        <div style=\"text-align: right;\">\n            <button *ngIf=\"config.onCancelBtn\" nz-button nzSize=\"large\" style=\"padding-left: 24px; padding-right: 24px;\"\n                (click)=\"config.onCancelBtn()\">\u53D6\u6D88</button>\n            <button nz-button nzSize=\"large\" nzType=\"primary\" [disabled]=\"!!config.uploadDisabled\"\n                style=\"margin-left: 10px; padding-left: 24px; padding-right: 24px;\" (click)=\"onUpload()\">\u4E0A\u4F20</button>\n        </div>\n    </ng-container>\n\n    <ng-container class=\"gk-big-upload-pending-wp\" *ngIf=\"['uploading', 'merging', 'stopping'].includes(store.status)\">\n        <div style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;\">\n            <nz-progress [nzPercent]=\"store.progress\" nzType=\"circle\" [nzWidth]=\"48\"></nz-progress>\n            <div style=\"margin-top: 18px; line-height: 24px; font-size: 16px;\n            font-weight: 500; color: #000000;\">\u6587\u4EF6\u4E0A\u4F20</div>\n            <div style=\"margin-top: 8px; line-height: 22px; font-size: 14px;\n            font-weight: 400; color: #585858;\">{{ config.uploadText }}</div>\n            <button *ngIf=\"config.showUploadCancel\" nz-button nzSize=\"large\" class=\"gk-big-upload-pending-stop-button\"\n                style=\"margin-top: 24px; width: 226px; height: 38px;\" (click)=\"onStopUpload()\">{{\n                $any({ uploading: '\u53D6\u6D88', merging: '\u53D6\u6D88', stopping: '\u6B63\u5728\u53D6\u6D88\u4E2D' })[store.status] }}</button>\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"store.status === 'error'\">\n        <div class=\"gk-big-upload-error-wp\"\n            style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;\">\n            <nz-progress [nzPercent]=\"store.progress\" nzType=\"circle\" [nzWidth]=\"48\" nzStatus=\"exception\"></nz-progress>\n            <div style=\"margin-top: 18px; line-height: 24px; font-size: 16px;\n            font-weight: 500; color: #000000;\">\u4E0A\u4F20\u5931\u8D25</div>\n            <div style=\"margin-top: 8px; line-height: 22px; font-size: 14px;\n            font-weight: 400; color: #585858;\">{{ config.errorText }}</div>\n            <button nz-button nzSize=\"large\" nzType=\"primary\" class=\"gk-big-upload-error-restry-button\"\n                style=\"margin-top: 24px; width: 226px; height: 38px;\" (click)=\"onRetry()\">\u91CD\u8BD5</button>\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"store.status === 'success'\">\n        <div class=\"gk-big-upload-success-wp\"\n            style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;\">\n            <nz-progress [nzPercent]=\"store.progress\" nzType=\"circle\" [nzWidth]=\"48\"></nz-progress>\n            <div style=\"margin-top: 18px; line-height: 24px; font-size: 16px;\n            font-weight: 500; color: #000000;\">\u4E0A\u4F20\u5B8C\u6210</div>\n            <div style=\"margin-top: 8px; line-height: 22px; font-size: 14px;\n            font-weight: 400; color: #585858;\">{{ config.successText }}</div>\n            <button nz-button nzSize=\"large\" nzType=\"primary\" class=\"gk-big-upload-success-enter-button\"\n                style=\"margin-top: 24px; width: 226px; height: 38px;\" (click)=\"onSuccess()\">\u786E\u5B9A</button>\n        </div>\n    </ng-container>\n</div>\n",
                styles: [".gk-big-upload-container{height:100%;min-height:200px;min-width:250px;position:relative;width:100%}"]
            },] }
];
BigUploadComponent.ctorParameters = () => [
    { type: NzMessageService },
    { type: NzIconService },
    { type: UploadService }
];
BigUploadComponent.propDecorators = {
    instance: [{ type: Input }],
    worker: [{ type: Input }]
};

class GKBigUploadModule {
}
GKBigUploadModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    BigUploadComponent,
                ],
                imports: [
                    CommonModule,
                    NzUploadModule,
                    NzFormModule,
                    NzButtonModule,
                    NzProgressModule,
                    GKIconModule,
                    GKButtonModule,
                ],
                exports: [
                    BigUploadComponent,
                ],
            },] }
];

class GKBigUpload {
    constructor(config) {
        this.config = config;
        this.initStore = () => {
            this.store = util.merge(this.store || {}, {
                status: 'wait',
                uuid: '',
                file: undefined,
                fileMd5: '',
                chunkSizeGlobal: 0,
                sliceState: 'wait',
                chunks: [],
                uploadSize: 0,
                progress: 0,
            });
        };
        this.getStore = () => {
            return this.store;
        };
        this.initStore();
    }
}

/*
 * Public API Surface of ng-goku
 */

/**
 * Generated bundle index. Do not edit.
 */

export { EchartLineConfig, EchartLineData, EchartLineOption, EchartPieConfig, EchartPieData, EchartPieOption, GKAlertModule, GKAsideMenus, GKBigUpload, GKBigUploadModule, GKBreadCrumbsService, GKBtnStatusValues, GKButton, GKButtonModule, GKChartModule, GKEditor, GKEditorModule, GKFirstMenuLink, GKFirstMenuWp, GKFormAgree, GKFormAgreeBase, GKFormCheckbox, GKFormCheckboxBase, GKFormControls, GKFormDate, GKFormDateBase, GKFormDateRange, GKFormDateRangeBase, GKFormEditor, GKFormEditorBase, GKFormModule, GKFormNumber, GKFormNumberBase, GKFormPassword, GKFormPasswordBase, GKFormRadio, GKFormRadioBase, GKFormRate, GKFormRateBase, GKFormSelect, GKFormSelectBase, GKFormSwitch, GKFormSwitchBase, GKFormText, GKFormTextBase, GKFormTextarea, GKFormTextareaBase, GKFormUpload, GKFormUploadBase, GKHomeModule, GKIOControl, GKIOGroup, GKIOGroupItem, GKIOItem, GKIOLabelBlock, GKIOModule, GKIOPropItem, GKIconModule, GKInfoCustom, GKInfoCustomBase, GKInfoEditorBase, GKInfoGroupCustom, GKInfoGroupImg, GKInfoGroupLink, GKInfoGroupRate, GKInfoGroupTags, GKInfoGroupText, GKInfoImg, GKInfoImgBase, GKInfoLink, GKInfoLinkBase, GKInfoMix, GKInfoModule, GKInfoRate, GKInfoRateBase, GKInfoStatusText, GKInfoTags, GKInfoTagsBase, GKInfoText, GKInfoTextBase, GKList2, GKList2Module, GKListModule, GKMenuGroup, GKModalModule, GKModalService, GKPanelModule, GKSearch, GKSearchDate, GKSearchDateRange, GKSearchDaterange, GKSearchMix, GKSearchModule, GKSearchNumber, GKSearchSelect, GKSearchText, GKSecondMenuLink, GKStatusValues, GKTable2, GKTable2Module, GKTableColImage, GKTableColPoint, GKTableColSwitch, GKTableColumn, GKTableOperateColumn, GKTableOperateEvent, GKTabs, GKTipModule, GKTitleModule, GKTree, GKTreeModule, GK_TABLE_CONF, defaultTableConf, isGKBtnStatus, isGKList2AddBtn, isGKList2CustomBtn1, isGKStatus, isGKTable2CustomBtn1, isGKTable2DeleteBtn, util, ɵ0, AsideMenuComponent as ɵa, TopBarComponent as ɵb, InfoComponent as ɵba, FormComponent as ɵbb, SearchComponent as ɵbc, ChartLineComponent as ɵbd, ChartPieComponent as ɵbe, TipComponent as ɵbf, TitleComponent as ɵbg, Table2Component as ɵbi, CeilTypeComponent as ɵbj, TreeComponent as ɵbk, AlertComponent as ɵbl, List2Component as ɵbm, BigUploadComponent as ɵbn, UploadService as ɵbo, HomeComponent as ɵc, BreadCrumbsComponent as ɵd, TopSearchComponent as ɵe, IconComponent as ɵf, TableComponent as ɵg, TableService as ɵh, CheckService as ɵi, BaseService as ɵj, SortService as ɵk, ListComponent as ɵl, GKDataService as ɵm, UpdateService as ɵn, ButtonComponent as ɵo, ModalComponent as ɵp, PanelComponent as ɵq, TabComponent as ɵr, IOComponent as ɵs, IOService as ɵt, NumberComponent as ɵu, CheckboxComponent as ɵv, TimePickerComponent as ɵw, UploadComponent as ɵx, GK_EDITOR_VALUE_ACCESSOR as ɵy, EditorComponent as ɵz };
//# sourceMappingURL=ng-goku.js.map
