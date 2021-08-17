import { HttpClient } from '@angular/common/http'
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { GKTable2, GKTable2ColumnInter, util } from 'ng-goku'
import { NzIconService } from 'ng-zorro-antd/icon'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
    selector: 'app-root',
    template: `
    <gk-table2 [table]="table"></gk-table2>

    <ng-template #customRef let-data="data" let-rowIndex="rowIndex">
        {{data| json}} |||||| {{rowIndex}}
    </ng-template>
    `,
})
export class AppComponent implements OnInit {

    @ViewChild('customRef')
    customRef: TemplateRef<any>

    columns: GKTable2ColumnInter[] = [
        {
            type: 'check',
            fixed: 'left',
            onTrCheckChange: (checked, tr) => {
                console.log('checked, tr', checked, tr)
            },
            onPageCheckChange: (checked, trs) => {
                console.log('checked, trs', checked, trs)
            },
        },
        {
            title: 'type defautl',
            prop: 'key1',
            width: '120px',
            fixed: 'left',
            sort: true,
        },
        {
            type: 'default',
            title: 'type defautl',
            prop: 'key2',
            width: '120px',
        },
        {
            type: 'operate',
            title: 'type operate',
            prop: 'operate',
            btns: [
                {
                    label: '编辑',
                    // type: 'danger',
                    onClick: (trData, index) => {
                        console.info('trData, index', trData, index)
                        this.message.info(`trData, index, ${trData}, ${index}`)
                    },
                    hide: (trDate, index) => {
                        return index > 2
                    },
                },
            ],
            width: '120px',
        },
        {
            type: 'expand',
            title: 'type expand',
            width: '100px',
            disabled: (tr, prop, index) => index % 2 === 1,
            expandRender: () => this.customRef,
        },
        {
            type: 'render',
            title: 'type render',
            prop: 'render',
            render: () => this.customRef,
            width: '120px',
        },
        {
            type: 'switch',
            title: 'type switch',
            prop: 'switch',
            width: '120px',
            disabled: (tr, prop, index) => index % 2 === 1,
            onSwitch: async (tr, prop, index) => {
                console.info('tr, index', tr, index)
                await util.sleep(0.5 * 1000)
                if (Math.random() < 0.5) {
                    tr[prop] = !tr[prop]
                }
            },
            checkedText: '启用',
            unCheckedText: '停用',
            color: 'green',
        },
        {
            type: 'tip',
            title: 'type tip',
            width: '80px',
            tdStyle: {
                'text-align': 'center',
            },
            tip: '悬浮显示tip',
        },
        {
            type: 'group',
            title: 'type group',
            content: [
                {
                    type: 'image',
                    prop: 'image1',
                    image: {
                        width: 40,
                        height: 40,
                        fill: true,
                        circle: true, // 显示为圆形 (不配置默认为方形)
                        preview: false,
                    },
                    ceilStyle: {
                        display: 'inline-block',
                        'margin-right': '5px',
                    },
                    ceilTip: '图片',
                },
                {
                    type: 'switch',
                    prop: 'switch',
                    onSwitch: async (tr, prop) => {
                        tr[prop] = !tr[prop]
                    },
                    ceilStyle: {
                        'margin-right': '5px',
                    },
                    ceilTip: (tr, prop, index) => index % 2 === 0 ? '开关' : '',
                },
                {
                    type: 'default',
                    prop: 'key2',
                    format: (tr, prop) => {
                        return tr[prop] + '1111'
                    },
                },
                {
                    type: 'tip',
                    tip: () => '点击显示tip',
                    trigger: 'click',
                },
            ],
            width: '250px',
        },
        {
            title: '占位列',
            width: '850px',
        },
        {
            type: 'image',
            title: 'type image',
            prop: 'image2',
            width: '160px',
            tdStyle: {
                padding: 0,
                'text-align': 'center',
            },
            fixed: 'right',
            image: {
                width: 140,
                height: 40,
            },
            ceilStyle: {
                display: 'inline-block',
            },
            ceilTip: '图片',
        },
        {
            type: 'status',
            title: 'type status',
            prop: 'status',
            width: '120px',
            fixed: 'right',
            point: {
                color: () => 'warning',
            },
        },
        {
            type: 'status',
            title: 'type status2',
            prop: 'status',
            width: '120px',
            fixed: 'right',
            status: (tr, prop, index) => {
                let icon
                let pointColor
                let textColor
                if (index === 0) {
                    icon = 'iconfont-vol'
                    textColor = '#999999'
                } else if (index === 1) {
                    pointColor = 'warning'
                } else if (index >= 2) {
                    pointColor = 'success'
                    if (index > 4) {
                        pointColor = '#999999'
                        textColor = '#999999'
                    }
                }
                return {
                    icon,
                    pointColor,
                    textColor,
                }
            },
        },
    ]

    list = Array(5).fill('').map((v, index) => (
        {
            id: index, key1: index, key2: 'key2',
            image1: '../../../../../assets/images/1.png',
            image2: '../../../../../assets/images/2.png',
            status: 'status',
        }
    ))

    table = new GKTable2({
        pageMode: 'none',
        columns: this.columns,
        source: async () => {
            await util.sleep(1000)
            return this.list
        },
        sortFunc: (sortKey, a, b) => {
            return String(a.key1).localeCompare(String(b.key1))
        },
    })

    constructor(
        public http: HttpClient,
        public message: NzMessageService,
        private nzIcon: NzIconService,
    ) {
        this.nzIcon.fetchFromIconfont({
            scriptUrl: 'https://at.alicdn.com/t/font_386958_krs6rtlxzbe.js',
        }) // 包含 iconfont-vol
    }

    ngOnInit(): void {
    }
}
