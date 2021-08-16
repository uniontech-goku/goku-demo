import { Component, OnInit } from '@angular/core'
import { Validators, AbstractControl, FormGroup } from '@angular/forms'
import {
    GKFormControls, GKFormText, GKFormNumber, GKFormPassword, GKFormSelect,
    GKFormDate, GKFormDateRange, GKFormRate, GKFormTextarea, GKFormRadio,
    GKFormAgree, GKFormSwitch, GKFormUpload, GKFormCheckbox, GKFormEditor,
} from 'ng-goku'
import { Observable } from 'rxjs'


@Component({
    selector: 'app-root',
    template: `
    <gk-form [controls]="controls" [data]="data"></gk-form>
    <span>点击按钮，修改下拉框选项将有item1，item2，item3 变为 temA，itemB，itemc</span>
    <br/>
    <gk-button mode="fill" type="primary" (click)="changeClick()">修改</gk-button>
    `,
})
export class AppComponent implements OnInit {
    data = { text: '12345', rate: 3, number: 2211 }
    controls = new GKFormControls([
        new GKFormUpload('本地上传', 'formFileUpload', 1,
            {
                required: true,
                mode: 'form',
                type: 'multiple',
                fileType: 'default',
                maxLength: 2,
            },
        ),
        new GKFormUpload('本地上传', 'formImageUpload', 1,
            {
                mode: 'form',
                type: 'multiple',
                fileType: 'image',
                maxLength: 2,
                fileSuffixs: ['jpg', 'png'],
                fileTip: '支持格式: jpg, png',
            },
        ),
        new GKFormUpload('服务上传', 'serverFileUpload', 1,
            {
                required: true,
                mode: 'server',
                type: 'multiple',
                fileType: 'default',
                maxLength: 2,
                serverConfig: {
                    url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
                },
            },
        ),
        new GKFormUpload('oss上传', 'ossImageUpload', 1,
            {
                mode: 'aliyunOSS',
                type: 'multiple',
                fileType: 'image',
                ossServerUrl: '/XXXXX',
            },
        ),
        new GKFormText('文本', 'text', 1, '请输入', {
            required: true,
            validas: [
                Validators.email,
                Validators.required,
                Validators.maxLength(1),
                Validators.minLength(1),
                {
                    tip: '姓名不能叫小王',
                    handler: (control: AbstractControl) => {
                        return control.value === '小王'
                    },
                },
                {
                    tip: '姓名不能叫小李',
                    handler: (control: AbstractControl) => {
                        return control.value === '小李'
                    },
                },
                {
                    tip: '姓名必须叫小张',
                    handler: (control: AbstractControl) => {
                        return control.value === '小张'
                    },
                },
            ],
            asyncValidas: [
                {
                    tip: '错误文本',
                    handler: (control) => {
                        return new Observable((observer) => {
                            setTimeout(() => {
                                const value = control.value
                                observer.next(value === 'xiaowang')
                                observer.complete()
                            }, 1000)
                        })
                    },
                },
            ],
        }, {
            filter: (formGroup) => {
                return formGroup.value.number < 12
            },
        }),
        new GKFormTextarea('多行文本', 'textarea', 1, undefined, {
            rows: 3,
            maxCharacterCount: 10,
            noResize: true,
            validas: [
                Validators.maxLength(10),
            ],
        }),
        new GKFormNumber('数字', 'number'),
        new GKFormPassword('密码', 'password'),
        new GKFormDate('日期', 'date', 1, undefined, {
            mode: 'date',
            format: 'YYYY-mm-ss',
            disabledDate: 'future-today',
        }),
        new GKFormDateRange('范围日期', 'dataRange', 1,
            {
                fastRange: [
                    'week-c', 'week-h', 'week-h-c', 'week-f', 'week-f-c',
                    'month-c', 'month-h', 'month-h-c', 'month-f', 'month-f-c',
                    { label: '自定义', range: [new Date(), new Date()] },
                ],
            },
        ),
        new GKFormSelect('选择框', 'select', 1, undefined, {
            options: [
                { label: 'item1', value: '1' },
                { label: 'item2', value: '2' },
                { label: 'item3', value: '3' },
            ]
            , mode: 'default',
        }),
        new GKFormRadio('单选框', 'radio', 1, {
            required: true,
            options: [
                { label: 'item1', value: '1', disabled: true },
                { label: 'item2', value: '2', disabled: false },
                { label: 'item3', value: '3' },
            ],
        }),
        new GKFormCheckbox('多选', 'checkbox', 1, {
            options: [
                { label: 'Apple', value: 'Apple' },
                { label: 'Pear', value: 'Pear' },
                { label: 'Orange', value: 'Orange' },
            ],
        }),
        new GKFormSwitch('隐藏协议', 'switch2', 1, {
        }),
        new GKFormAgree('协议勾选', 'agree', 1, {
            required: true,
            content: [
                '请阅读',
                {
                    text: '隐私协议',
                    href: 'https:www.baidu.com',
                },
                ', 不勾选无法注册。(单选框为3时禁用)',
            ],
            disabled: (formGroup) => formGroup.value.radio === '3',
        }, {
            filter: (formGroup) => formGroup.value.switch2,
        }),
        new GKFormRate('评分', 'rate'),
        new GKFormEditor('富文本', 'editor', 2, {
            placeholder: '请输入文字',
        }),
    ])

    formGroup: FormGroup

    changeClick(): void {
        this.controls.get('select').list = [
            { label: 'itemA', value: '1' },
            { label: 'itemB', value: '2' },
            { label: 'itemC', value: '3' },
        ]
    }

    constructor() { }

    ngOnInit(): void {
        this.formGroup = this.controls.getFormGroup()
        console.info('this.formGroup', this.formGroup)
        this.formGroup.valueChanges.subscribe((value) => {
            console.info('this.formGroup valueChanges', value)
        })
    }

}
