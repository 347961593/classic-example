import { Ion, Viewer } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
 
//去cesium官网申请一个token 
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYmRiZmVkOS1kNTFmLTRiMjQtYjc0Mi1mMDNjMTg1MTVhZGEiLCJpZCI6MjY4NDg4LCJpYXQiOjE3MzY3MDQ2ODV9.M23Q0g6lozIqtQFoZNoeOT0E0fmLqmIHue9QonAaXi8';
 
let viewer;
 
export function initializeCesium(containerId) {
    if (!viewer) {
        viewer = new Viewer(containerId, {
            animation: true, 
            baseLayerPicker: true,
            fullscreenButton: true,
            geocoder: true,
            homeButton: true,
            infoBox: true,
            sceneModePicker: true,
            selectionIndicator: true,
            timeline: true,
            navigationHelpButton: false,
        });
        // 去除版权信息
        viewer._cesiumWidget._creditContainer.style.display = 'none';
    }
    return viewer;
}
 
export function getViewer() {
    return viewer;
}