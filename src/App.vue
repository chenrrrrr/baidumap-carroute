<template>
  <div id="app">
    <baidu-map class="map"
               :center="center"
               :zoom="zoom"
               @ready="handler"></baidu-map>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiData: [
        { x: 116.432045, y: 39.910683 },
        { x: 116.129721, y: 39.314429 },
        { x: 116.729721, y: 39.454429 },
        { x: 117.834782, y: 39.971891 },
        { x: 115.134782, y: 38.271891 },
        { x: 116.131282, y: 37.971891 }
      ],
      center: { lng: 0, lat: 0 },
      zoom: 3,
      notifyData: {
        title: "通知标题",
        opt: {
          body: "页面跳转",
          href: "https://www.npmrundev.com"
        }
      }
    };
  },
  methods: {
    handler({ BMap, map }) {
      // 缩放
      map.enableScrollWheelZoom();

      let self = this.apiData;
      // 画线
      for (let i = 0; i < self.length; i++) {
        let driving = new BMap.DrivingRoute(map, {
          renderOptions: { map: map, autoViewport: true },
          onMarkersSet(e) {
            // 只绘制一组起点、终点标注
            if (i === 0) {
              map.removeOverlay(e[1].marker);
            } else if (i === self.length - 2) {
              map.removeOverlay(e[0].marker);
            } else {
              map.removeOverlay(e[0].marker);
              map.removeOverlay(e[1].marker);
            }
          },
          onPolylinesSet: function(routes) {
            //当线条添加完成时调用
            for (let j = 0; j < routes.length; j++) {
              let polyline = routes[j].getPolyline(); //获取线条遮挡物
              polyline.setStrokeColor("#0097ff"); //设置颜色
              polyline.setStrokeWeight(5); //设置宽度
              polyline.setStrokeOpacity(1); //设置透明度
            }
          }
        });
        let s = new BMap.Point(self[i].x, self[i].y);
        if (i !== self.length - 1) {
          let e = new BMap.Point(self[i + 1].x, self[i + 1].y);
          driving.search(s, e);
        }
        map.addOverlay(new BMap.Marker(new BMap.Point(self[i].x,self[i].y))); // 沿途红点标注
      }
    },
  },
};
</script>

<style lang="less">
.map {
  height: 600px;
}
</style>

