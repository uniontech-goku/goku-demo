import { Component, ViewChild } from '@angular/core'
import { GKChartPieConfig, GKChartLineConfig } from 'ng-goku'

@Component({
    selector: 'app-root',
    template: `
    <span>单个饼图：</span>
    <div style="width: 400px; height: 147px">
        <gk-chart-pie #chart1 [data]="pieData1" ></gk-chart-pie>
    </div>
    <br/>
    <span>嵌套饼图</span>
    <div style="width: 400px; height: 147px">
        <gk-chart-pie #chart2 [data]="pieData2" [config]="pieConfig2"></gk-chart-pie>
    </div>

    `,
})
export class AppComponent {
    @ViewChild('chart1') chart1: any
    @ViewChild('chart2') chart2: any

    pieData1
    pieData2


    pieConfig2: GKChartPieConfig = {
        width: 400,
        height: 147,
        center: [100, '50%'],
        orient: 'vertical',
        colorGroup: ['#4F9AFF', '#FFB257', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        legendFormatter: (name, value, percent, sum) => {
            return `${name}：${percent}；总和：${sum}`
        },
    }

    constructor() {
        this.pieData1 = {
            series: [
                {
                    name: '男',
                    value: [
                        57,
                    ],
                },
                {
                    name: '女',
                    value: [
                        47,
                    ],
                },
                {
                    name: '未知',
                    value: [
                        123,
                    ],
                },
            ],
        }
        this.pieData2 = {
            series: [
                {
                    name: 'QQ',
                    group: '腾讯',
                    value: [
                        57,
                    ],
                },
                {
                    name: '微信',
                    group: '腾讯',
                    value: [
                        87,
                    ],
                },
                {
                    name: '淘宝',
                    group: '阿里',
                    value: [
                        21,
                    ],
                },
                {
                    name: '支付宝',
                    group: '阿里',
                    value: [
                        119,
                    ],
                },
            ],
        }
        // 如图表大小，样式不正确，可以执行chart实例的resize方法
        setTimeout(() => {
            this.chart1.resize()
            this.chart2.resize()
        }, 0)
    }
}
