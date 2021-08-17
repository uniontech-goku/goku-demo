import { Component } from '@angular/core'
import { GKTabs } from 'ng-goku'

@Component({
    selector: 'app-root',
    template: `
    <gk-panel [title]="'标题'" [tabs]="tabs" (tabChange)="tabChange($event)">
        <gk-tab [value]="'tab1'">
            <div style="border: 1px solid #ccc;">标签1</div>
        </gk-tab>
        <gk-tab [value]="'tab2'">
            <div style="border: 1px solid #ccc;">标签2</div>
        </gk-tab>
        <gk-tab [value]="3">
            <div style="border: 1px solid #ccc;">标签3</div>
        </gk-tab>
        <gk-tab [value]="4">
            <div style="border: 1px solid #ccc;">标签4</div>
        </gk-tab>
        <gk-tab [value]="true">
            <div style="border: 1px solid #ccc;">标签5</div>
        </gk-tab>
        内容块内容
        <div>tabChange事件返回当前tab栏的值：{{tabValue}}</div>
    </gk-panel>
    <br />
    `,
})
export class AppComponent {
    tabs = new GKTabs([
        { label: '页签1', value: 'tab1' },
        { label: '页签2', value: 'tab2' },
        { label: '页签3', value: 3 },
        { label: '页签4', value: 4 },
        { label: '页签5', value: true },
    ])
    tabValue = ''
    tabChange(value): void {
        this.tabValue = value
    }
    constructor() {
        // 通过tab实例我们可以修改action值，进而控制当前激活的tab栏
        this.tabs.action = 'tab2'
    }

}
