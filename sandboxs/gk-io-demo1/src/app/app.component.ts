import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core'

import {
    GKIOControl, GKIOGroup, GKIOGroupItem, GKFormTextareaBase,
    GKFormDateRangeBase, util, GKIOItem, GKInfoTextBase, GKInfoRateBase,
    GKInfoTagsBase, GKInfoLinkBase, GKInfoCustomBase, GKFormTextBase, GKInfoImgBase,
    GKFormNumberBase, GKFormPasswordBase, GKFormSwitchBase, GKFormSelectBase,
    GKFormRadioBase, GKFormCheckboxBase, GKFormRateBase, GKFormAgreeBase, GKFormUploadBase,
    GKFormEditorBase,
} from 'ng-goku'

@Component({
    selector: 'app-root',
    template: `
        <gk-io [control]="ioControl" [data]="data"></gk-io>
        <button nz-button (click)="switchMode()">当前为： {{ ioControl.mode }}</button>
        {{ ioControl.formGroup.value | json }}

        <ng-template #customRef let-data="data" let-prop="prop" let-value="value">
            customRef: data： {{data | json}} ptop： {{prop}} value： {{value}}
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

    @ViewChild('customRef')
    customRef: TemplateRef<any>

    data = {
        infoText: '文本内容展示',
        infoRate: 3,
        infoTags: ['张三', '李四', '王二麻子'],
        infoLink: 'https://www.google.com',
        infoImg: [
            '../../assets/images/1.png',
            '../../assets/images/1.png',
            '../../assets/images/1.png',
        ],

        formText: '',
        formNumber: null,
        formPassword: '',
        formSwitch: false,
        formRadio: null,
        formChcekbox: [],
        formSelect: '',
        formRate: null,
    }

    ioControl = new GKIOControl([
        new GKIOItem('文本展示', 'infoText', new GKInfoTextBase()),
        new GKIOItem('评分展示', 'infoRate', new GKInfoRateBase()),
        new GKIOItem('标签展示', 'infoTags', new GKInfoTagsBase()),
        new GKIOItem('链接展示', 'infoLink', new GKInfoLinkBase()),
        new GKIOItem('图片展示', 'infoImg', new GKInfoImgBase(), { grid: 2 }),
        new GKIOItem('自定义展示', 'infoCustom', new GKInfoCustomBase({
            format: (data, prop) => '可format处理 ' + data[prop],
            render: () => this.customRef,
        }), { grid: 3 }),

        new GKIOItem('文本输入', 'formText', [
            'infoText',
            new GKFormTextBase(),
        ]),
        new GKIOItem('多行文本输入', 'formTextarea', [
            'infoText',
            new GKFormTextareaBase(),
        ]),
        new GKIOItem('数字输入', 'formNumber', [
            'infoText',
            new GKFormNumberBase(),
        ]),
        new GKIOItem('密码输入', 'formPassword', [
            'infoText',
            new GKFormPasswordBase(),
        ]),
        new GKIOItem('开关切换', 'formSwitch', [
            'infoText',
            new GKFormSwitchBase(),
        ]),
        new GKIOItem('单选选择', 'formRadio', [
            'infoText',
            new GKFormRadioBase({
                options: [
                    { label: 'item1', value: '1' },
                    { label: 'item2', value: '2' },
                    { label: 'item3', value: '3' },
                ],
            }),
        ]),
        new GKIOItem('多选选择', 'formChcekbox', [
            'infoText',
            new GKFormCheckboxBase({
                options: [
                    { label: 'item1', value: '1' },
                    { label: 'item2', value: '2' },
                    { label: 'item3', value: '3' },
                ],
            }),
        ]),
        new GKIOItem('下拉选择', 'formSelect', [
            'infoText',
            new GKFormSelectBase({
                options: [
                    { label: 'item1', value: '1' },
                    { label: 'item2', value: '2' },
                    { label: 'item3', value: '3' },
                ],
            }),
        ]),
        new GKIOItem('评分选择', 'formRate', [
            'infoText',
            new GKFormRateBase(),
        ]),
        new GKIOItem('时间选择', 'formDate', [
            'infoText',
            new GKFormRateBase(),
        ]),
        new GKIOItem('时间范围选择', 'formDateRange', [
            'infoText',
            new GKFormDateRangeBase(),
        ], { grid: 2 }),
        new GKIOItem('协议勾选', 'formAgree', [
            'infoText',
            new GKFormAgreeBase(),
        ]),
        new GKIOItem('文件上传', 'formUpload', [
            'infoText',
            new GKFormUploadBase(),
        ]),
        new GKIOItem('富文本编辑', 'formEditor', [
            'infoText',
            new GKFormEditorBase(),
        ], { grid: 3 }),

        new GKIOGroup('group 共用label', [
            new GKIOGroupItem('infoText', new GKInfoTextBase()),
            new GKIOGroupItem('infoTags', new GKInfoTagsBase()),
            new GKIOGroupItem('infoImg', new GKInfoImgBase()),
            new GKIOGroupItem('formText', [
                'infoText',
                new GKFormTextBase(),
            ]),
            new GKIOGroupItem('formNumber', [
                'infoText',
                new GKFormNumberBase(),
            ]),
        ], {
            grid: 3,
        }),
    ], {
        defaultMode: 'form', // 初始展示信息还是表单 默认值为 info
        gridCount: 3, // 一行总计 grid 默认值为 2
        labelWidth: '145px',   // label宽度 默认值为 85px 支持百分比形式
    })

    ioGroup = this.ioControl.getFormGroup()

    switchMode(): void {
        if (this.ioControl.mode === 'form') {
            util.merge(this.data, this.ioGroup.value)
        }

        this.ioControl.switchMode()
    }

    constructor() { }

    ngOnInit(): void {
    }

}
