import { Component, ViewChild } from '@angular/core'
import { GKChartPieConfig, GKChartLineConfig } from 'ng-goku'

@Component({
    selector: 'app-root',
    template: `
    <span>默认样式：</span>
    <div style="width: 100%; height: 400px">
        <gk-chart-line #chart1 [data]="lineData1"></gk-chart-line>
    </div>
    <br/>
    <span>支持配置颜色，折线样式，及y轴起点</span>
    <div style="width: 100%; height: 400px">
        <gk-chart-line #chart2 [data]="lineData2" [config]="lineConfig2"></gk-chart-line>
    </div>
    `,
})
export class AppComponent {
    @ViewChild('chart1') chart1: any
    @ViewChild('chart2') chart2: any

    lineData1
    lineData2

    lineConfig2: GKChartLineConfig = {
        color: ['#3ba272', '#ea7ccc'],
        type: 'line',
        yAxisScale: true,
    }

    constructor() {
        this.lineData1 = {
            xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            series: [
                {
                    name: '邮件营销',
                    value: [120, 132, 101, 134, 90, 230, 210],
                },
            ],
        }
        this.lineData2 = {
            xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            series: [
                {
                    name: '邮件营销',
                    value: [120, 132, 101, 134, 90, 230, 210],
                },
                {
                    name: '联盟广告',
                    value: [220, 182, 191, 234, 290, 330, 310],
                },
            ],
        }
        // 如果图表大小，样式不正确，可以执行chart实例的resize方法
        setTimeout(() => {
            this.chart1.resize()
            this.chart2.resize()
        }, 0)
    }
}
