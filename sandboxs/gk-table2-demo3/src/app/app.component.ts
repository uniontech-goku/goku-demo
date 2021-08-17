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
        },
        {
            title: '姓名',
            prop: 'username',
            width: '170px',
            sort: true,
        },
        {
            title: '电话',
            prop: 'tel',
            sort: 'ascend',
        },
        {
            title: '年龄',
            prop: 'age',
        },
        {
            type: 'default',
            title: '性别',
            prop: 'sex',
            format: (trData, prop, index) => trData[prop] === '0' ? '男' : '女',
        },
        {
            type: 'render',
            title: '自定义列',
            prop: 'render',
            render: () => this.customRef,
        },
    ]

    list = Array(80).fill('').map((v, index) => (
        { id: index, username: index, tel: 'tel', age: 'age', sex: Math.random() < 0.5 ? '0' : '1' }
    ))

    table = new GKTable2({
        pageMode: 'server',
        columns: this.columns,
        source: ({ pageIndex, pageSize, pageSort }) => {
            console.info('table2 pageIndex, pageSize, pageSort', pageIndex, pageSize, pageSort)
            return new Promise(async (resolve) => {
                await util.sleep(0.5 * 1000)
                resolve({
                    list: this.list.slice(pageSize * (pageIndex - 1), pageSize * pageIndex),
                    pagination: { total: this.list.length },
                })
            })
        },
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: [4, 25],
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
