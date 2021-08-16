import { Component, OnDestroy, OnInit } from '@angular/core'
import { GKButton } from 'ng-goku'
import { NzIconService } from 'ng-zorro-antd/icon'
import { FlagFill } from '@ant-design/icons-angular/icons'

@Component({
    selector: 'app-root',
    template: `
    <div>下面的按钮是通过传入 GKButton 实例创建的。</div>
    <div>初始状态： icon为flag，按钮的value为字符串 '实例可传入 value'。</div>
    <br>
    <div>点击状态：会触发valueClick事件。在其回调函数中，去掉icon，加上loading状态。value值变为 '实例的value值已经发生改变'</div>
    <br>
    <div>三秒后：按钮会重置为初始状态</div>
    <br>
    <gk-button [button]="buttonOne" (valueClick)="onValueChange($event)"></gk-button>  按钮的value值：<span>{{this.buttonOne.value}}</span>
    <br>
    <div>注意：实例控制的属性优先级比 直接传入的属性 的优先级低</div>
    `,
})
export class AppComponent implements OnInit, OnDestroy {
    constructor(
        private nzIcon: NzIconService,
    ) {
        this.nzIcon.addIcon(FlagFill)
    }
    timer
    public buttonOne = new GKButton({
        label: '传入实例',
        icon: 'flag-fill',
        loading: false,
        onClick: () => {
            console.info('这是点击事件的回调')
        },
        value: '实例可传入 value',
    })
    onValueChange(value: string): void {
        this.buttonOne.value = '实例的value值已经发生改变'
        this.buttonOne.icon = ''
        this.buttonOne.loading = true
        console.info('这是valueClick事件：', value)
    }
    ngOnInit(): void {
        this.timer = setInterval(() => {
            this.buttonOne.value = '实例可传入 value'
            this.buttonOne.icon = 'flag-fill'
            this.buttonOne.loading = false
        }, 3 * 1000)
    }
    ngOnDestroy(): void {
        clearInterval(this.timer)
    }
}
