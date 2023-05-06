/*
 * @Author: zhishiqu
 * @Description: 
 * @Date: 2023-04-18 10:18:49
 * @LastEditTime: 2023-04-21 10:43:58
 * @FilePath: \vue-vite-cesium-demo\src\cesiumUtils\initCesium.js
 */
import Cesium from '@/cesiumUtils/cesium'
import Global_ht from './Global_ht'
import TilesetFlow from "@/cesiumUtils/tilesetFlow";

import { getProviderViewModels } from "./tdt_provider.js";

let [tiandiVecModel, tiandiImgModel] = getProviderViewModels();


// eslint-disable-next-line no-unused-vars
const addTileMapProvider = (viewer) => {
    const imageryViewModels = []
    imageryViewModels.push(
        new Cesium.ProviderViewModel({
            name: 'Google_COBALT',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/blueMarble.png'),
            tooltip: 'Google_COBALT',
            creationFunction() {
                return new Cesium.TileMapServiceImageryProvider({
                    url: window.setting.geoServerBaseUrl,
                    fileExtension: 'png'
                })
            }
        })
    )
    new Cesium.BaseLayerPicker('baseLayerPickerContainer', {
        globe: viewer.scene.globe,
        imageryProviderViewModels: imageryViewModels
    })
}

Global_ht.terrainProvider = new Cesium.CesiumTerrainProvider({

    url: import.meta.env.VITE_APP_BASE_API + import.meta.env.VITE_APP_PORT + '/SLH_Terrain/',
    // url: 'http://192.168.2.196:3001/SLH_Terrain/',

    // requestWaterMask: true,
    // requestVertexNormals: true
})

export const initCesium = (viewerName = '3d') => {
    // DEFAULT_VIEW in China
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(80, 22, 130, 50)
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwOTk0NzRmZC04ZmIxLTQ3MzgtYjExNS0wZDhlYzcyMDgyZjciLCJpZCI6MjU5MTcsImlhdCI6MTYyNDUwMDk3OH0.HThCMHIU5Z8dJ3f1kawW2vKEb4o2RTu4Ed84CWcUxn8"
    // const url = '/geoserver' // Geoserver URL
    // const terrainUrl = '/terrain' // Terrain URL
    const is3D = viewerName === '3d'
    const containerName = is3D ? 'cesiumContainer' : 'cesiumContainer2D'
    const baseConf = {
        // imageryProvider: false,
        infoBox: false,
        geocoder: false,
        navigationHelpButton: false,
        selectionIndicator: false,
        // baseLayerPicker: false,
        showRenderLoopErrors: false,
        // terrainProvider: Cesium.createWorldTerrain(),
        terrainProvider: Global_ht.terrainProvider,
        imageryProviderViewModels: [tiandiVecModel, tiandiImgModel],
        // imageryProvider : new Cesium.WebMapServiceImageryProvider({
        //     url: Global_ht.geoserverUrl,
        //     layers : 'huitu:slh_13',
        //     maximumLevel: 13,
        //     parameters: {
        //         service : 'WMS',
        //         format: 'image/png',
        //         transparent: true,
        //       }  
        // }),
    }
    const extendConf = {}
    const viewer = new Cesium.Viewer(containerName, { ...baseConf, ...extendConf })
    // load terrain from Cesium IonResource site, also load your own terrain optionally
    const terrainLayer = new Cesium.CesiumTerrainProvider({
        // url: terrainUrl,
        url: Cesium.IonResource.fromAssetId(1),
        requestWaterMask: true,
        requestVertexNormals: true
    })
    // viewer.scene.terrainProvider = terrainLayer
    viewer.scene.globe.enableLighting = true
    //   viewer.imageryLayers.addImageryProvider(
    //     new Cesium.IonImageryProvider({ assetId: 3 })
    //   )
    // load your own tile optionally
    //   addTileMapProvider(viewer)

    let vvv = {
        destination: [-580832.9468060052, 4862439.285582528, 4077020.85703316],
        direction: [-0.20806433572529676, 0.19574514531530418, -0.9583282685409429],
        up: [-0.2058395892654742, 0.9490664056837295, 0.2385435412950591],
    }
    viewer.camera.flyTo({
        destination: new Cesium.Cartesian3(...vvv.destination),
        orientation: {
            direction: new Cesium.Cartesian3(...vvv.direction),
            up: new Cesium.Cartesian3(...vvv.up)
        },
        duration: 0.1 // fly time 10s
    })
    viewer.scene.debugShowFramesPerSecond = true
    viewer.clock.shouldAnimate = true
    initCesiumHandler(viewer)
    operationHabitMid(viewer)

    // viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    //     url: Global_ht.geoserverUrl,
    //     layers : 'huitu:slh_15',
    //     maximumLevel: 15,
    //     parameters: {
    //         service : 'WMS',
    //         format: 'image/png',
    //         transparent: true,
    //       }  
    // }));
    // viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    //     url: Global_ht.geoserverUrl,
    //     layers : 'huitu:slh_17',
    //     maximumLevel: 17,
    //     parameters: {
    //         service : 'WMS',
    //         format: 'image/png',
    //         transparent: true,
    //       }  
    // }));

    // viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    //     url: Global_ht.geoserverUrl,
    //     layers : 'huitu:flh_dixing',
    //     maximumLevel: 17,
    //     parameters: {
    //         service : 'WMS',
    //         format: 'image/png',
    //         transparent: true,
    //       }  
    // }));

    // viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    //     url: Global_ht.geoserverUrl,
    //     layers : 'huitu:flh_biaozhu',
    //     maximumLevel: 17,
    //     parameters: {
    //         service : 'WMS',
    //         format: 'image/png',
    //         transparent: true,
    //       }  
    // }));

    // viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    //     url: "http://t0.tianditu.gov.cn/ter_w/wmts?tk=dfce9582892b549ec6662a5488d0391d",
    //     layer: "ter",
    //     style: "default",
    //     tileMatrixSetID: "w",
    //     format: "tiles",
    //     maximumLevel: 18
    // }))

    new TilesetFlow(viewer);
    return viewer
}


//设置操作习惯,更换中键和右键
let operationHabitMid = function (viewer) {

    viewer.scene.screenSpaceCameraController.rotateEventTypes = [  //平移
        // Cesium.CameraEventType.LEFT_DRAG,  //鼠标左键按住，然后移动鼠标并松开按键
        Cesium.CameraEventType.RIGHT_DRAG
    ];

    viewer.scene.screenSpaceCameraController.translateEventTypes = [  //平移
        // Cesium.CameraEventType.LEFT_DRAG,  //鼠标左键按住，然后移动鼠标并松开按键
        Cesium.CameraEventType.RIGHT_DRAG
    ];

    viewer.scene.screenSpaceCameraController.tiltEventTypes = [   //旋转
        Cesium.CameraEventType.LEFT_DRAG,
        // Cesium.CameraEventType.RIGHT_DRAG,  //鼠标右键按住，然后移动鼠标并松开按键
        // Cesium.CameraEventType.PINCH,   //双指触控屏幕
        // { eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL },
        // { eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL }
    ];

    viewer.scene.screenSpaceCameraController.zoomEventTypes = [   //缩放
        Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH
    ];
}

// 初始化鼠标事件
export const initCesiumHandler = (viewer_ht) => {
    const canvas = viewer_ht.scene.canvas
    const handler = new Cesium.ScreenSpaceEventHandler(canvas)
    handler.setInputAction(function (movement) {
        const cartesian = viewer_ht.scene.pickPosition(movement.position)
        if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
            let lon = Cesium.Math.toDegrees(cartographic.longitude)
            let lat = Cesium.Math.toDegrees(cartographic.latitude)
            let height = cartographic.height
            console.log(lon.toFixed(14) + ' ,' + lat.toFixed(14) + ' ,' + height.toFixed(14))
            // console.log(cartesian)
            if (Global_ht.printPoint) {

                console.log('position:' + viewer_ht.camera.position.toString())
                console.log('up:' + viewer_ht.camera.up.toString())
                console.log('direction:' + viewer_ht.camera.direction.toString())

                console.log(`
                    destination: [${viewer_ht.camera.position.x}, ${viewer_ht.camera.position.y}, ${viewer_ht.camera.position.z}],
                    direction: [${viewer_ht.camera.direction.x}, ${viewer_ht.camera.direction.y}, ${viewer_ht.camera.direction.z}],
                    up: [${viewer_ht.camera.up.x}, ${viewer_ht.camera.up.y}, ${viewer_ht.camera.up.z}],
                `)
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

}