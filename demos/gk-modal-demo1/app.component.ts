import { Component } from '@angular/core'

@Component({
    selector: 'app-root',
    template: `
    <span>默认情况：</span><gk-button (click)="isVisible1 = true">弹窗1</gk-button>
    <gk-modal [(isVisible)]="isVisible1" [titleText]="title" (cancel)="cancelHander()" (ok)="okHander()">
        模态框内容
    </gk-modal>
    <br/>
    <span>通过btns配置空数组，取消底部按钮：</span><gk-button (click)="isVisible2 = true">弹窗2</gk-button>
    <gk-modal [(isVisible)]="isVisible2" [titleText]="title" [btns]="[]" (cancel)="cancelHander()" (ok)="okHander()">
        模态框内容
    </gk-modal>
    `,
})
export class AppComponent {
    isVisible1 = false
    isVisible2 = false
    title = '模态框标题'

    constructor() { }

    cancelHander(): void {
        console.info('窗口被关闭')
    }

    okHander(): void {
        console.info('点击确定按钮')
    }
}
