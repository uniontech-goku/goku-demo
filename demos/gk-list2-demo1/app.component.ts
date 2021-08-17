import { Component, OnInit } from '@angular/core'
import { ForkOutline, PlusOutline } from '@ant-design/icons-angular/icons'
import { GKApi } from '@goku/http'
import { NzIconService } from 'ng-zorro-antd/icon'
import { NzMessageService } from 'ng-zorro-antd/message'
import { Observable } from 'rxjs'
import * as dayjs from 'dayjs'

import {
    GKIOControl, GKIOItem, GKList2, GKSearch, GKSearchSelect,
    GKSearchText, util, GKFormSelectBase, GKFormTextBase, GKFormPasswordBase, GKSearchDaterange, GKSearchDate, GKButton,
} from 'ng-goku'

@Component({
    selector: 'app-root',
    template: `
    <gk-list2 [list]="list" [(checks)]="checks">
        <span id="title-left">
            我是左侧标题右上角投影
        </span>
        <span id="title-right">
            我是右侧投影
        </span>
    </gk-list2>`,
})
export class AppComponent implements OnInit {

    checks = []

    list = new GKList2({
        search: {
            title: '搜索区标题 (可隐藏)',
            layouts: new GKSearch([
                new GKSearchText('登陆账户', 'one', 1, '请输入账户信息'),
                new GKSearchSelect('用户角色', 'select1', undefined, '请选择', {
                    options: [
                        { label: 'item1', value: '1' },
                        { label: 'item2', value: '2' },
                        { label: 'item3', value: '3' },
                    ],
                    mode: 'default',
                    search: true,
                }),
                new GKSearchSelect('启用状态', 'select2', undefined, '请选择', {
                    options: [
                        { label: 'item1', value: '1' },
                        { label: 'item2', value: '2' },
                        { label: 'item3', value: '3' },
                    ],
                    mode: 'default',
                    search: true,
                }),
                new GKSearchDate('时间', 'xxx', 1, '请选择', {
                    disabledDate: (date) => dayjs(date).subtract(10, 'day').isAfter(dayjs()),
                }),
                new GKSearchDaterange('操作时间', 'two', 1, {
                    disabledDate: (date) => dayjs(date).subtract(10, 'day').isAfter(dayjs()),
                }),
            ], {
                labelWidth: '70px',
            }, {
                two: [new Date('2021-06-25').getTime(), new Date().getTime()],
            }),
            resetRefresh: false, // 配置为true 在点击重置后 自动刷新表格
        },
        content: {
            title: '内容区标题 (可隐藏)',
            btns: {
                right: [
                    new GKButton({
                        label: '手动刷新表格(回到第一页)',
                        type: 'warning',
                        onClick: () => {
                            this.list.table.refresh()
                        },
                    }),
                    {
                        // hide: () => false,
                        // type: 'default',
                        // type: () => 'warning',
                        // disabled: () => false,
                        btn: new GKButton({
                            label: '手动刷新表格(回到第一页)',
                            type: 'warning',
                            onClick: () => {
                                this.list.table.refresh()
                            },
                        }),
                    },
                    {
                        // hide: () => false,
                        // type: 'default',
                        // type: () => 'default',
                        // disabled: () => true,
                        label: '手动刷新表格(当页)',
                        onClick: () => {
                            this.list.table.refresh(false)
                        },
                    },
                    {
                        mode: 'add',
                        type: 'primary',
                        title: '添加11',
                        data: { abc: '123' },
                        api: new GKApi('/xxxx', 'post'),
                        ioControl: new GKIOControl([
                            new GKIOItem('用户角色', 'role', ['infoText', new GKFormSelectBase({
                                required: true,
                                options: [
                                    { label: '管理员', value: 'admin' },
                                    { label: '普通员工', value: 'none' },
                                ],
                                asyncValidas: [
                                    {
                                        tip: '不能选择admin',
                                        handler: (control) => {
                                            return new Observable((observer) => {
                                                setTimeout(() => {
                                                    const value = control.value
                                                    observer.next(value === 'admin')
                                                    observer.complete()
                                                }, 1 * 1000)
                                            })
                                        },
                                    },
                                ],
                            })]),
                            new GKIOItem('登陆账户', 'username', ['infoText', new GKFormTextBase({
                                required: true,
                            })]),
                            new GKIOItem('密码', 'password', ['infoText', new GKFormPasswordBase({
                                required: true,
                                validas: {
                                    tip: '',
                                    handler: (control, formGroup) => {
                                        return control.value && formGroup.value.passwordVerif &&
                                            control.value !== formGroup.value.passwordVerif
                                    },
                                },
                            })]),
                            new GKIOItem('确认密码', 'passwordVerif', ['infoText', new GKFormPasswordBase({
                                required: true,
                                validas: [
                                    {
                                        tip: '两次输入的密码不一致',
                                        handler: (control, formGroup) => {
                                            return formGroup.value.password && control.value &&
                                                formGroup.value.password !== control.value
                                        },
                                    },
                                ],
                            })]),
                        ], {
                            defaultMode: 'form',
                            gridCount: 1,
                        }),
                        onShowModal: (formGroup) => {
                            // formGroup.patchValue({})
                        },
                        onBeforeSubmit: (formGroup) => {
                            console.info('onBeforeSubmit formGroup', formGroup)
                            return true
                        },
                        onAfterSubmit: (resp) => {
                            console.info('onAfterSubmit resp', resp)
                        },
                    },
                ],
            },
        },
        table: {
            pageMode: 'server',
            columns: [
                {
                    type: 'check',
                },
                {
                    title: '序号',
                    width: '70px',
                    fixed: 'left',
                    format: (trDate, prop, rowIndex, pageIndex, pageSize) => {
                        return rowIndex + (pageIndex - 1) * pageSize + 1
                    },
                },
                {
                    // type: 'default',
                    title: '登陆账户',
                    prop: 'user',
                    width: '140px',
                },
                {
                    title: '用户角色',
                    prop: 'role',
                    width: '170px',
                },
                {
                    title: '创建时间',
                    prop: 'createTime',
                    width: '120px',
                    sort: true,
                    showTextTitle: true,
                },
                {
                    title: '最后登陆时间',
                    prop: 'lastLoginTime',
                    width: '180px',
                    sort: true,
                },
                {
                    type: 'switch',
                    title: '状态',
                    prop: 'status',
                    width: '120px',
                    onSwitch: async (tr, prop, index) => {
                        console.info('tr, index', tr, index)
                        await util.sleep(1000)
                        if (Math.random() < 0.5) {
                            tr[prop] = !tr[prop]
                        }
                    },
                    checkedText: '启用',
                    unCheckedText: '停用',
                    color: 'green',
                },
                {
                    title: '占位列',
                    prop: 'null',
                    width: '780px',
                },
                {
                    type: 'operate',
                    title: '操作',
                    width: '320px',
                    fixed: 'right',
                    btns: [
                        {
                            label: '重置密码',
                            icon: 'plus',
                            onClick: () => {
                                this.message.info('自定义按钮: 重置密码')
                            },
                        },
                        {
                            label: '服务器管理',
                            onClick: () => {
                                this.message.info('自定义按钮: 服务器管理')
                            },
                        },
                        {
                            mode: 'delete',
                            icon: 'fork',
                            api: new GKApi('/xxxx', 'delete'),
                            prop: 'id',
                            tip: true, // 可配置文字
                            confirmMode: true,
                            refresh: true, // 删除后刷新表格
                        },
                    ],
                },
            ],
            source: (searchParams, tableParams) => {
                console.info('searchParams, tableParams', searchParams, tableParams)
                return new Promise(async (resolve) => {
                    await util.sleep(1000)
                    resolve({
                        list: Array(tableParams.pageSize).fill('').map(() => {
                            return {
                                user: 'admin',
                                role: '超级管理员',
                                createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                                lastLoginTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                                status: Math.random() < 0.5,
                            }
                        }),
                        pagination: {
                            total: 142,
                        },
                    })
                })
            },
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            defaultPageSize: 20,
            // hideMorePageLastBtn: true,
        },
    })

    constructor(
        private nzIcon: NzIconService,
        private message: NzMessageService,
    ) {
        this.nzIcon.addIcon(ForkOutline, PlusOutline)
    }

    ngOnInit(): void {
    }

}
