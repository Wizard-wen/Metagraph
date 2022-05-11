/**
 * @author songxiwen
 * @date  2022/5/10 15:57
 */

const speed = {
  status: 3,
};
const that = this;

function Network() {
  this.speedInterval = null;
  this.networkInterval = null;
  this.reNetworkInterval = null;
  this.time = 5000;
  this.speedStauts = null;
  this.getConnectState = function () {
    return navigator.onLine ? 1 : 0;
  };
  this.getSpeedStauts = function () {
    return this.speedStauts;
  };
}

// 网络速度检测
Network.prototype.startSpeed = function () {
  window.clearInterval(this.speedInterval);
  this.speedInterval = null;
  const that = this;
  if (this.getConnectState() == 1) {
    this.speedInterval = window.setInterval(() => {
      const start = new Date().getTime();
      if (that.getConnectState() == 1) {
        const img = document.getElementById('networkSpeedImage');
        try {
          img.src = `http://www.baidu.com/img/baidu_jgylogo3.gif?_t=${new Date().getTime()}`;
          img.onload = function () {
            const end = new Date().getTime();
            const delta = end - start;
            console.info('delta====>', delta);
            if (delta > 200) {
              console.info('凑活');
              speed.status = 1;
            } else if (delta > 100) {
              speed.status = 2;
            } else {
              speed.status = 3;
            }
            console.info('statusSpeed====>', speed.status);
          };
        } catch {
          speed.status = 0;
          console.info('网络断开');
        }
      } else {
        speed.status = 0;
        console.info('网络断开2');
      }
    }, this.time);
  } else {
    speed.status = 0;
    console.info('网络断开1');
  }
};
const netWork = new Network();
