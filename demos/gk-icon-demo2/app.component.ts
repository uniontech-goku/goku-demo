import { Component } from '@angular/core'
import { NzIconService } from 'ng-zorro-antd/icon'

@Component({
    selector: 'app-root',
    template: `
    <div>
        <gk-icon style="font-size: 20px" type="icon-tuichu"></gk-icon>
        <span style="margin-left: 20px"
            >此时type值为icon-tuichu，引入对应的iconfont图标</span
        >
    </div>
    <div>
        <gk-icon style="font-size: 20px" type="iconfont-vol"></gk-icon>
        <span style="margin-left: 20px"
            >此时type值为iconfont-vol，也能引入对应的iconfont图标</span
        >
    </div>
    `,
})
export class AppComponent {
    constructor(
        private nzIcon: NzIconService,
    ) {
        this.nzIcon.fetchFromIconfont({
            scriptUrl: 'https://at.alicdn.com/t/font_386958_krs6rtlxzbe.js',
        }) // 包含 iconfont-vol
        this.nzIcon.fetchFromIconfont({
            scriptUrl: 'https://at.alicdn.com/t/font_2545192_ep3lkqwhmyn.js',
        }) // 包含 icon-tuichu
    }
}
