import { Component } from '@angular/core'
import { GKButton, GKButtonInter } from 'ng-goku'

@Component({
    selector: 'app-root',
    template: `
    <gk-button (click)="isVisible = true">弹窗(自定义按钮)</gk-button>
    <gk-modal [(isVisible)]="isVisible" [titleText]="title" [btns]="btmBtns" [closable]="false" (cancel)="cancelHander()" (ok)="okHander()"
        (btnAction)="btnAction($event)">
        模态框内容
    </gk-modal>
    `,
})
export class AppComponent {
    isVisible = false

    title = '测试标题'

    btmBtns: GKButtonInter[] = [
        new GKButton('按钮1', 'key1', 'warning'),
        new GKButton('按钮2', 'key3', 'primary', 'flag'),
        {
            label: '按钮3',
            type: 'success',
            icon: 'flag',
            mode: 'outline',
            onClick: () => {
                console.info('按钮3 onClick')
            },
        },
        { label: '关闭', onClick: () => { this.isVisible = false } },
    ]
    constructor() { }

    cancelHander(): void {
        console.info('窗口被关闭')
    }

    okHander(): void {
        console.info('点击确定按钮')
    }

    btnAction(value): void {
        console.info(`值为${value}的按钮被点击了`)
    }
}
