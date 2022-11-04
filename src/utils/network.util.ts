/**
 * @author wizard.song
 * @date  2022/5/10 15:57
 * @description 网络测速
 */

export class NetworkUtil {
  speed = {
    status: 3,
  };

  speedInterval?: number;

  networkInterval = null;

  reNetworkInterval = null;

  time = 5000;

  speedStatus?: number;

  getConnectState() {
    return navigator.onLine ? 1 : 0;
  }

  getSpeedStatus() {
    return this.speedStatus;
  }

  startSpeed() {
    if (this.speedInterval) {
      window.clearInterval(this.speedInterval);
    }
    this.speedInterval = undefined;
    // eslint-disable-next-line eqeqeq
    if (this.getConnectState() === 1) {
      this.speedInterval = window.setInterval(() => {
        const start = new Date().getTime();
        // eslint-disable-next-line eqeqeq
        if (this.getConnectState() === 1) {
          // const img = document.getElementById('networkSpeedImage');
          const image = new Image();
          try {
            image.src = `http://www.baidu.com/img/baidu_jgylogo3.gif?_t=${new Date().getTime()}`;
            image.onload = () => {
              const end = new Date().getTime();
              const delta = end - start;
              console.info('delta====>', delta);
              if (delta > 200) {
                console.info('凑活');
                this.speed.status = 1;
              } else if (delta > 100) {
                this.speed.status = 2;
              } else {
                this.speed.status = 3;
              }
              console.info('statusSpeed====>', this.speed.status);
            };
          } catch {
            this.speed.status = 0;
            console.info('网络断开');
          }
        } else {
          this.speed.status = 0;
          console.info('网络断开2');
        }
      }, this.time);
    } else {
      this.speed.status = 0;
      console.info('网络断开1');
    }
  }
}
