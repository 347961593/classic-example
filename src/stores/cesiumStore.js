import { defineStore } from 'pinia'
import * as Cesium from 'cesium';

export const useCesiumStore = defineStore('cesium', {
    state: () => ({
        viewer: null
    }),
    actions: {
        initializeCesium(containerId) {
            if (!this.viewer) {
                this.viewer = new Cesium.Viewer(containerId, {
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

                // this.viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId : 2684829 }));

                // 去除版权信息
                this.viewer._cesiumWidget._creditContainer.style.display = 'none';
                // console.log('1111',viewer);
            }
        }
    }
})
