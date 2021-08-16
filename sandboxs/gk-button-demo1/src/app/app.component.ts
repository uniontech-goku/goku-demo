import { Component } from '@angular/core'
import { NzIconService } from 'ng-zorro-antd/icon'
import { FlagFill } from '@ant-design/icons-angular/icons'

@Component({
    selector: 'app-root',
    template: `
    <div>
        <span>mode 默认值为 fill，type 默认值为 default </span>
    </div>
    <div>
        <div>loading: <nz-switch [(ngModel)]="loading" (ngModelChange)="disabled = false"></nz-switch> （loading状态不会传递点击事件）</div>
        <div>disabled: <nz-switch [(ngModel)]="disabled" (ngModelChange)="loading = false"></nz-switch> （disabled状态不会传递点击事件）<div>
    </div>
    <br />
    <div>
        <span>mode为fill时: </span>
        <gk-button mode="fill" type="default" [loading]="loading" [disabled]="disabled">default
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="fill" type="primary" [loading]="loading" [disabled]="disabled">primary
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="fill" type="success" [loading]="loading" [disabled]="disabled">success
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="fill" type="warning" [loading]="loading" [disabled]="disabled">warning
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="fill" type="danger" [loading]="loading" [disabled]="disabled">danger
        </gk-button>
        <br />
        <br />
        <span>mode为outline时: </span>
        <gk-button mode="outline" type="default" [loading]="loading" [disabled]="disabled">default
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="outline" type="primary" [loading]="loading" [disabled]="disabled">primary
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="outline" type="success" [loading]="loading" [disabled]="disabled">success
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="outline" type="warning" [loading]="loading" [disabled]="disabled">warning
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="outline" type="danger" [loading]="loading" [disabled]="disabled">danger
        </gk-button>
        <br />
        <br />
        <span>mode为dashed时: </span>
        <gk-button mode="dashed" type="default" [loading]="loading" [disabled]="disabled">default
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="dashed" type="primary" [loading]="loading" [disabled]="disabled">primary
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="dashed" type="success" [loading]="loading" [disabled]="disabled">success
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="dashed" type="warning" [loading]="loading" [disabled]="disabled">warning
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="dashed" type="danger" [loading]="loading" [disabled]="disabled">danger
        </gk-button>
        <br />
        <br />
        <span>mode为text时: </span>
        <gk-button mode="text" type="default" [loading]="loading" [disabled]="disabled">default
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="text" type="primary" [loading]="loading" [disabled]="disabled">primary
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="text" type="success" [loading]="loading" [disabled]="disabled">success
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="text" type="warning" [loading]="loading" [disabled]="disabled">warning
        </gk-button>
        <span style="display:inline-block;width: 4px;"></span>
        <gk-button mode="text" type="danger" [loading]="loading" [disabled]="disabled">danger
        </gk-button>
    </div>
    `,
})
export class AppComponent {
    constructor(
        private nzIcon: NzIconService,
    ) {
        this.nzIcon.addIcon(FlagFill)
    }

    public loading = false
    public disabled = false
}
