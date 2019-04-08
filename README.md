## 前言

后端接口返回经纬度坐标，每隔十分钟，后端接口经纬度坐标+1租，前端根据接口数据做地图形式轨迹的渲染。由于后端是点状数据，汽车高速每小时100km/h，10分钟的间隔周期，汽车大约行驶了17km的路程，所以在地图上，可能存在多条路径能够匹配这一组经纬度坐标点，因此不能够简单的使用折线连接，于是选择了百度地图SDK的`BMap.DrivingRoute`方法做渲染，路线倾向为默认，确保轨迹是适配图上的道路的。[官方API地址](http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html#a7b22)

官方Demo：
```js
var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

var p1 = new BMap.Point(116.301934,39.977552);
var p2 = new BMap.Point(116.508328,39.919141);

var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
driving.search(p1, p2);
```

## 效果

![图1](../../images/16.png)


## 代码实现

引入`vue-baidu-map`，需要达到，后台接口数据更新，前台地图轨迹自动更新

```html
<template>
  <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler"></baidu-map>
</template>
```

```js
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
    }
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
  }
}
```
