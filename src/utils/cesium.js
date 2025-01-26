import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

//去cesium官网申请一个token 
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYmRiZmVkOS1kNTFmLTRiMjQtYjc0Mi1mMDNjMTg1MTVhZGEiLCJpZCI6MjY4NDg4LCJpYXQiOjE3MzY3MDQ2ODV9.M23Q0g6lozIqtQFoZNoeOT0E0fmLqmIHue9QonAaXi8';
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    // 西边经度 南边纬度 东边经度 北边纬度
    89.9,
    20.4,
    110.4,
    61.2
);

let viewer;
export function initializeCesium(containerId) {
    if (!viewer) {
        viewer = new Cesium.Viewer(containerId, {
            animation: true,  //播放动画
            baseLayerPicker: true, //图形选择器
            fullscreenButton: true,  //全屏按钮
            geocoder: true,  //搜索框
            homeButton: true,  //home按钮
            infoBox: true, //信息框
            sceneModePicker: true, //查看器显示模式
            selectionIndicator: true,  
            timeline: true,  //时间轴
            navigationHelpButton: false,  //帮助按钮
        });

        // viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId : 2684829 }));

        // 去除版权信息
        viewer._cesiumWidget._creditContainer.style.display = 'none';
        // console.log('1111',viewer);
    }
    return viewer;
}

export function getViewer() {
    return viewer;
}