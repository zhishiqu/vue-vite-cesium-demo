/*
 * @Author: zhishiqu
 * @Description: 
 * @Date: 2023-04-21 10:40:13
 * @LastEditTime: 2023-04-21 16:16:41
 * @FilePath: \vue-vite-cesium-demo\src\cesiumUtils\tdt_provider.js
 */
import Cesium from '@/cesiumUtils/cesium'
export function getProviderViewModels() {
    const tiandiKey = "dfce9582892b549ec6662a5488d0391d";       //天地图key，官网申请
    const baseUrl = 'http://t{s}.tianditu.com';
    //天地图矢量
    let tiandiVec = new Cesium.UrlTemplateImageryProvider({
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        url: baseUrl + '/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + tiandiKey
    });
    //天地图影像
    var tiandiImg = new Cesium.UrlTemplateImageryProvider({
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        // url: baseUrl + '/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + tiandiKey
        url: 'https://t{s}.tianditu.gov.cn/mapservice/GetTiles?&tk=' + tiandiKey
    });
    var tiandiImg = new Cesium.UrlTemplateImageryProvider({
        url: 'https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + tiandiKey,
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        tilingScheme : new Cesium.WebMercatorTilingScheme(),
        maximumLevel : 18
    });
    //天地图标注
    let tiandiCva = new Cesium.UrlTemplateImageryProvider({
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        url: baseUrl + '/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + tiandiKey
    });

    let tiandiVecModel = new Cesium.ProviderViewModel({
        name: '天地图',
        category: '国内地图资源',
        iconUrl: Cesium.buildModuleUrl('./Widgets/Images/ImageryProviders/openStreetMap.png'),
        tooltip: 'WMTS 地图服务',
        creationFunction: function () {
            return [tiandiVec, tiandiCva];
        }
    });
    let tiandiImgModel = new Cesium.ProviderViewModel({
        name: '天地图影像',
        category: '国内地图资源',
        iconUrl: Cesium.buildModuleUrl('./Widgets/Images/ImageryProviders/esriWorldImagery.png'),
        tooltip: 'WMTS 影像服务',
        creationFunction: function () {
            return [tiandiImg, tiandiCva];
        }
    });

    return [tiandiVecModel, tiandiImgModel]
}

