import { Component, OnInit } from '@angular/core'
import { NzIconService } from 'ng-zorro-antd/icon'
import { FlagTwoTone } from '@ant-design/icons-angular/icons'
import { GKButtonInter } from 'ng-goku'

@Component({
    selector: 'app-root',
    template: `
    <gk-panel [title]="'标题'" [leftBtns]="leftBtns" [rightBtns]="rightBtns" [action]="selected"
        (btnsEvent)="btnsClick($event)">
        通过action设置，默认激活的按钮为 "左侧按钮 1"
    </gk-panel>
    `,
})
export class AppComponent implements OnInit {

    leftBtns: GKButtonInter[] = [
        { label: '左侧按钮 1', value: '1' },
        { label: '按钮2', value: '2', icon: 'flag-twotone', onClick: () => { console.info('按钮2 onClick') } },
    ]

    rightBtns: GKButtonInter[] = [
        { label: '右侧按钮 3', value: '3' },
        { label: '按钮4', value: '4', icon: 'iconfont-vol' },
    ]

    selected: string[] = ['1']

    btnsClick(value): void {
        // 返回点击按钮的所有配置信息
        console.info('value', value)
    }

    constructor(
        private nzIcon: NzIconService,
    ) {
        this.nzIcon.addIcon(FlagTwoTone)
        this.nzIcon.fetchFromIconfont({
            scriptUrl: 'https://at.alicdn.com/t/font_386958_krs6rtlxzbe.js',
        })
    }

    ngOnInit(): void {
    }

}
