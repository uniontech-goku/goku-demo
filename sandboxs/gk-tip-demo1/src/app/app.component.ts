import { Component } from '@angular/core'

@Component({
    selector: 'app-root',
    template: `<gk-tip tip="tip 内容, hover 显示"></gk-tip> <span> (hover 显示)</span>
    <br />
    <gk-tip tip="tip 内容, click 显示" trigger="click"></gk-tip> <span> (click 显示)</span>`,
})
export class AppComponent {

    constructor() { }

}
