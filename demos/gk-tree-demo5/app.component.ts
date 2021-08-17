import { Component, OnInit } from '@angular/core'
import { GKTree, TreeDefaultDataInter } from 'ng-goku'

@Component({
    selector: 'app-root',
    template: `
    <gk-tree [gkTree]="gkTree"></gk-tree>
    `,
})
export class AppComponent implements OnInit {
    gkTree: GKTree
    ngOnInit(): void {
        const dig = (path = '0', level = 3) => {
            const list = []
            for (let i = 0; i < 10; i += 1) {
                const key = `${path}-${i}`
                const treeNode: TreeDefaultDataInter = {
                    title: key,
                    key,
                    expanded: true,
                    children: [],
                    isLeaf: false,
                }

                if (level > 0) {
                    treeNode.children = dig(key, level - 1)
                } else {
                    treeNode.isLeaf = true
                }

                list.push(treeNode)
            }
            return list
        }
        const nodes = dig()
        this.gkTree = new GKTree(nodes, {
            virtual: true,
        })
    }
    constructor() {
    }
}
