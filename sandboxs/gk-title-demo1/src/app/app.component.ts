import { Component } from '@angular/core'

@Component({
    selector: 'app-root',
    template: `
    <gk-title [title]="'标题'">
        内容区域
    </gk-title>
    <br/>
    <br/>
    <gk-title [tip]="'tip信息'" [title]="'带有icon提示的标题'">
        内容区域
    </gk-title>
    `,
})
export class AppComponent {

    constructor() { }

}
