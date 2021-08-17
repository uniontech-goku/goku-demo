import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import {
    GKInfo, GKInfoCustom, GKInfoGroupCustom, GKInfoGroupImg, GKInfoGroupLink, GKInfoGroupRate, GKInfoGroupTags, GKInfoGroupText,
    GKInfoImg, GKInfoLink, GKInfoMix, GKInfoRate, GKInfoStatusText, GKInfoTags, GKInfoText,
} from 'ng-goku'

@Component({
    selector: 'app-root',
    template: `
    <gk-info [structure]="structure" [data]="data"></gk-info>

    <ng-template #customRef let-data="data" let-prop="prop" let-value="value">
        customRef: data： {{data | json}} ptop： {{prop}} value： {{value}}
    </ng-template>
    `
})
export class AppComponent1 implements OnInit, AfterViewInit {

    @ViewChild('customRef')
    customRef: TemplateRef<any>

    data: { [key: string]: any } = {}
    structure: GKInfo[]

    constructor() { }

    ngOnInit(): void {

        this.data = {
            文本: '王二麻子',
            文本2: '文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回',
            文本3: '文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回文本内容函数返回',
            评分: 3,
            标签: ['张三', '李四', '王二麻子'],
            链接: 'http://www.baidu.com',
            图片: '../../assets/images/1.png',
            图片2: ['../../assets/images/1.png', '../../assets/images/1.png'],
            customProp: '自定义自定义自定义自定义自定义',
            link3: 'https://app.mockplus.cn/app/ZpBrDRV5hEka/specs/design/6w6RdoYL3eckN',
        }

        this.structure = [
            new GKInfoText('文本', '文本', 1, {
                textType: 'singel',
                color: (data, prop) => 'error',
                tips: true,
                copyBtn: true,
            }, {
                filter: (data) => true,
            }),
            new GKInfoText('文本', (data) => data.文本2, 1, {
                textType: 'singel',
                color: (data, prop) => '#999999',
                tips: true,
                copyBtn: true,
            }),
            new GKInfoText('文本', (data) => data.文本3, 2, {
                textType: 'multi',
                color: (data, prop) => 'blue',
                tips: true,
                copyBtn: true,
            }),
            new GKInfoText('状态文本',
                () => [
                    '前置文本',
                    new GKInfoStatusText('success', 'success'),
                    new GKInfoStatusText('primary', 'primary'),
                    '中间文本',
                    new GKInfoStatusText('warning', 'warning'),
                    new GKInfoStatusText('danger', 'danger'),
                    '后置文本',
                ],
                2, {
                textType: 'multi',
                tips: true,
                copyBtn: true,
            }),

            new GKInfoRate('评分', '评分', 1, {
                tooltips: ['1星', '2星', '3星', '4星', '满星'],
            }),
            new GKInfoRate('评分', () => 5, 1, {
                tooltips: ['1星', '2星', '3星', '4星', '满星'],
            }),

            new GKInfoTags('标签', '标签', 1, {
                tagType: 'error',
            }),
            new GKInfoTags('标签2', (data) => ['张三', '李四', '王二麻子'], 1, {
                tagType: (data, prop, index) => index === 1 ? 'error' : 'warning',
            }),

            new GKInfoLink('链接', '链接', 1),
            new GKInfoLink('链接2', () => 'google', 1, {
                href: () => 'http://wwww.google.com',
                copyBtn: true,
            }),
            new GKInfoLink('链接3', 'link3', 1, {
                copyBtn: true,
            }),

            new GKInfoImg('图片', '图片', 1),
            new GKInfoImg('图片2', '图片2', 1),
            new GKInfoImg('图片3', () => Array(12).fill('../../assets/images/1.png'), 2),
        ]
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.structure = [
                ...this.structure,
                new GKInfoCustom('自定义', 'customProp', () => this.customRef, 2),
                new GKInfoCustom('自定义2', () => 'customData', () => this.customRef, 2),

                new GKInfoMix('混合', [
                    new GKInfoGroupText('文本3', {
                        textType: 'singel',
                        color: (value) => '#999999',
                        tips: true,
                    }, {
                        filter: (data) => true,
                    }),
                    new GKInfoGroupRate(() => 4, {
                        tooltips: ['1星', '2星', '3星', '4星', '满星'],
                    }),
                    new GKInfoGroupTags((data) => ['张三', '李四', '王二麻子'], {
                        tagType: (data, prop, index) => index === 1 ? 'error' : 'warning',
                    }),
                    new GKInfoGroupLink('链接', {
                        href: () => 'http://wwww.google.com',
                    }),
                    new GKInfoGroupImg(() => Array(12).fill('../../assets/images/1.png')),
                    new GKInfoGroupCustom(() => 'customData', () => this.customRef),
                ], 2),
            ]
        }, 1000)
    }
}
