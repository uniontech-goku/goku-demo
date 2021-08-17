import { Component } from '@angular/core'

@Component({
    selector: 'app-root',
    template: `
    <gk-title [title]="'标题'">
        <div id="title-left">
            <gk-button>左侧投影</gk-button>
        </div>
        标题 + 左侧投影
    </gk-title>
    <br/>
    <br/>
    <gk-title [title]="'标题'" [tip]="'tip信息'">
        <div id="title-left">
            <gk-button>左侧投影</gk-button>
        </div>
        <div id="title-right">
            <gk-button>右侧投影</gk-button>
        </div>
        标题 + tip + 左侧投影 + 右侧投影
    </gk-title>
    `,
})
export class AppComponent {

    constructor() { }

}
