import { Component } from '@angular/core'
import { GKTree } from 'ng-goku'


@Component({
    selector: 'app-root',
    template: `
    <gk-tree [gkTree]="gkTree" (gkClick)="treeClick($event)"></gk-tree>
    `,
})
export class AppComponent {
    gkTree: GKTree = new GKTree([{
        name: 'parent 1',
        key: '100',
        arr: [
            {
                name: 'parent 1-0',
                key: '1001',
                disabled: true,
                arr: [
                    { name: 'leaf 1-0-0', key: '10010', disabled: true },
                    { name: 'leaf 1-0-1', key: '10011' },
                ],
            },
            {
                name: 'parent 1-1',
                key: '1002',
                arr: [
                    { name: 'leaf 1-1-0', key: '10020' },
                    { name: 'leaf 1-1-1', key: '10021' },
                ],
            },
        ],
    }], {
        expandAll: true,
        // 需要替换的数据字段名
        replaceKeyName: {
            title: 'name',
            children: 'arr',
        },
    })
    treeClick(e): void {
        console.info('treeClick', e)
    }
    constructor() {
    }
}
