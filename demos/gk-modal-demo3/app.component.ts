import { Component } from '@angular/core'

@Component({
    selector: 'app-root',
    template: `
    <gk-button (click)="isVisible = true">弹窗 (投影 footer)</gk-button>
    <gk-modal [(isVisible)]="isVisible" [titleText]="title">
        模态框内容
        <div id="modal-footer">
            <gk-button>自定义投影按钮</gk-button>
        </div>
    </gk-modal>
    `,
})
export class AppComponent {
    isVisible = false

    title = '测试标题'

    constructor() { }
}
