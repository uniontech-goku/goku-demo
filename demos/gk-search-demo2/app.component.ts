import { Component } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { GKApi, GKRequestService } from '@goku/http'
import { GKSearch, GKSearchDate, GKSearchDateRange, GKSearchMix, GKSearchNumber, GKSearchSelect, GKSearchText } from 'ng-goku'
import { Observable } from 'rxjs'


@Component({
    selector: 'app-root',
    template: `
    <gk-search [searchs]="searchs" (resetEvent)="searchClick($event)"  (searchEvent)="searchClick($event)"></gk-search>
    <gk-button (click)="getSearchForm()">通过实例方法 获取搜索组件formGroup</gk-button>
    <br/>
    <p>{{ searchForm?.value | json }}</p>
    `,
})
export class AppComponent {
    searchs = new GKSearch([
        new GKSearchText('文本输入', 'text', 1, ''),
        new GKSearchNumber('数字输入', 'number', 1, '输入一下下', {
            negative: false, // 是否允许负数
            point: false, // 是否允许小数点
            addOnBefore: '头部',
            addOnAfter: '尾部',
        }),
        new GKSearchSelect('下拉1', 'select1', undefined, '选一下下嘛', {
            options: [
                { label: 'item1', value: '1' },
                { label: 'item2', value: '2' },
                { label: 'item3', value: '3' },
            ],
        }),
        new GKSearchSelect('下拉2', 'select2', undefined, '选一下下嘛', {
            optionSource: new GKApi('/222'),
        }),
        new GKSearchSelect('下拉3', 'select3', undefined, '选一下下嘛', {
            link: ['select1'],
            optionSource: new GKApi('/333'),
        }),
        new GKSearchSelect('下拉4', 'select4', undefined, '选一下下嘛', {
            link: ['select1'],
            optionSource: (params) => {
                return new Observable<any>((observer) => {
                    setTimeout(() => {
                        console.info('optionSource', params)
                        let list = [
                            { label: 'xxxxxx', value: '1' },
                        ]
                        if (params.select1 === '1') {
                            list = [
                                { label: '111 item1', value: '1' },
                                { label: '111 item2', value: '2' },
                                { label: '111 item3', value: '3' },
                            ]
                        } else if (params.select1 === '2') {
                            list = [
                                { label: '222 item1', value: '1' },
                                { label: '222 item2', value: '2' },
                                { label: '222 item3', value: '3' },
                            ]
                        }
                        observer.next({
                            code: 0,
                            data: list,
                        })
                        observer.complete()
                    }, 2000)
                })
            },
        }),
        new GKSearchDate('日期选择', 'date', 1, '选一下日期嘛', {
            // showTime: true,
            format: 'yyyy年M月d日',
            showToday: true,
        }),
        new GKSearchDateRange('日期范围选择', 'dateRange', 1, {
            fastRange: ['week-c', 'week-h', 'week-h-c', 'week-f', 'week-f-c',
                'month-c', 'month-h', 'month-h-c', 'month-f', 'month-f-c'],
        }),
        new GKSearchMix('混合搜索1', [
            new GKSearchSelect('下拉', 'mixSelect1', undefined, '选一下下嘛Select', {
                options: [
                    { label: 'item1', value: '1' },
                    { label: 'item2', value: '2' },
                    { label: 'item3', value: '3' },
                ],
            }),
            new GKSearchText('输入123', 'threea', undefined, '输入'),
        ], 1),
        new GKSearchMix('混合搜索2', [
            new GKSearchSelect('下拉', 'mixSelect2', undefined, '选一下下嘛Select', {
                options: [
                    { label: 'item1', value: '1' },
                    { label: 'item2', value: '2' },
                    { label: 'item3', value: '3' },
                ],
            }),
            '纯文本',
        ], 1, {
            firstWidth: '50%',
        }),
    ], {
        labelWidth: '100px',
        searchText: '搜索按钮文本',
        resetText: '重置按钮文本',
    }, {
        text: '111111',
        select1: '1',
    })
    searchForm: FormGroup
    getSearchForm(): void {
        this.searchForm = this.searchs.getFormGroup()
    }
    searchClick(formGroup): void {
        this.searchForm = formGroup
        console.info('formGroup', formGroup)
    }
    constructor(
        private req: GKRequestService,
    ) { }

}
