import { Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartStreaming from 'chartjs-plugin-streaming';
import 'chartjs-adapter-luxon'

const websocketUrl = 'wss://ws-feed.exchange.coinbase.com';
const canvasID = 'live-chart-id';

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
})
export class WebsocketComponent {
  @ViewChild('canvasdiv') canvasDiv: ElementRef<HTMLElement>;

  pairs = ['BTC-USD', 'ETH-USD', "ETH-EUR"];
  currentPair = this.pairs[0];
  currentChart: Chart | undefined;
  exchange = 'Coinbase';
  buf = {};
  streamer = new WebSocket(websocketUrl);
  isStreaming = false;
  canvas = null;

  ngAfterViewInit() {
    this.loadWebsocketAndUpdateChart();
  }

  toggleStream() {
    if (this.streamer && this.isStreaming) {
      this.streamer.send('Close!');
      if (this.currentChart) {
        this.currentChart.destroy();
      }
      this.canvasDiv.nativeElement.removeChild(this.canvas);
      this.closeStream();
    } else {
      this.streamer = new WebSocket(websocketUrl);
      this.loadWebsocketAndUpdateChart();
    }
    this.isStreaming = !this.isStreaming;
  }

  togglePairs(current: string) {
    if (this.currentPair === current) return;
    this.currentPair = current;
  }

  loadWebsocketAndUpdateChart() {
    this.buf[this.exchange] = [[], []];
    this.openStream();
  };

  openStream() {
    this.streamer.onopen = () => {
      let subRequest = {
        'type': 'subscribe',
        'product_ids': [this.currentPair],
        'channels': [
          'heartbeat',
          {
            'name': 'ticker',
            'product_ids': [this.currentPair]
          }
        ]
      };
      this.streamer.send(JSON.stringify(subRequest));
      this.isStreaming = 1 === this.streamer.readyState;
      this.createCanvas();
    }

    this.streamer.onmessage = (message) => {
      let data = JSON.parse(message.data);
      if (data['type'] === 'ticker') {
        let topBid = data['best_bid'];
        let topAsk = data['best_ask'];
        let timestamp = Date.parse(data['time']);

        if (topBid) {
          this.buf[this.exchange][0].push({
            x: timestamp,
            y: topBid
          });
        }
        if (topAsk) {
          this.buf[this.exchange][1].push({
            x: timestamp,
            y: topAsk
          });
        }
      }
    }
  }

  closeStream() {
    this.streamer.close();
    this.streamer = null;
  }

  createCanvas() {
    if (this.currentChart) {
      this.currentChart.destroy();
    }
    this.canvas = document.createElement("canvas");
    this.canvas.id = canvasID;
    this.canvasDiv.nativeElement.appendChild(this.canvas);
    let ctx = this.canvas.getContext('2d');
    Chart.register(ChartStreaming);

    this.currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: [],
          label: 'Bid',
          borderColor: 'rgb(0, 255, 0)',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
          fill: false,
        }, {
          data: [],
          label: 'Ask',
          borderColor: 'rgb(55, 48, 163)',
          backgroundColor: 'rgba(55, 48, 163, 0.5)',
          fill: false,
        }]
      },
      options: {
        scales: {
          x: {
            type: 'realtime',
            realtime: {
              onRefresh: (chart) => {
                if (chart && chart.data && chart.ctx) {
                  Array.prototype.push.apply(
                    chart.data.datasets[0].data, this.buf[this.exchange][0]
                  );
                  Array.prototype.push.apply(
                    chart.data.datasets[1].data, this.buf[this.exchange][1]
                  );
                  this.buf[this.exchange] = [[], []];
                }
              }
            },
          },
        }
      }
    })
  };

  ngOnDestroy() {
    this.closeStream();
  }
}
