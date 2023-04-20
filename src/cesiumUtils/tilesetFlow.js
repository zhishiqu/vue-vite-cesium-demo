import Cesium from '@/cesiumUtils/cesium'
import Global_ht from './Global_ht'
/**
 * tilesetFlow
 * @author Jack
 * @alias TilesetFlow
 * @class
 * @param {Cesium.Viewer} viewer Cesium viewer
 */
export default class TilesetFlow {
    constructor(viewer) {
        this.viewer = viewer
        this.tileset = null
        // this.addTileset()
        this.addGisData()
    }

    addTileset() {
        Cesium.ExperimentalFeatures.enableModelExperimental = true
        const tilesets = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            // url or site of tilesets
            url: 'https://lab.earthsdk.com/model/702aa950d03c11e99f7ddd77cbe22fea/tileset.json'
        }))
        tilesets.readyPromise.then((tileset) => {
            tileset.style = new Cesium.Cesium3DTileStyle({
                color: {
                    conditions: [
                        ['true', "color('cyan')"]
                    ]
                }
            })
            this.viewer.flyTo(tileset)
        })
        const customShader = new Cesium.CustomShader({
            lightingModel: Cesium.LightingModel.UNLIT,
            fragmentShaderText: `
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
          float _baseHeight = 0.0; // base height
          float _heightRange = 60.0; // highlight range (_baseHeight to _baseHeight + _heightRange) default 0-60m
          float _glowRange = 300.0; // glow range(height)
            float vtxf_height = fsInput.attributes.positionMC.z-_baseHeight;
            float vtxf_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
            float vtxf_a12 = vtxf_height / _heightRange + sin(vtxf_a11) * 0.1;
            material.diffuse*= vec3(vtxf_a12, vtxf_a12, vtxf_a12);
            float vtxf_a13 = fract(czm_frameNumber / 360.0);
            float vtxf_h = clamp(vtxf_height / _glowRange, 0.0, 1.0);
            vtxf_a13 = abs(vtxf_a13 - 0.5) * 2.0;
            float vtxf_diff = step(0.005, abs(vtxf_h - vtxf_a13));
            material.diffuse += material.diffuse * (1.0 - vtxf_diff);
        }
        `
        })
        tilesets.customShader = customShader
    }

    addmodel_3dtile(d3Name, height, spaceNum = 1, zoom = false) {
        // console.log('env:' + import.meta.env.VITE_APP_API_URL)
        var url = import.meta.env.VITE_APP_BASE_API + import.meta.env.VITE_APP_PORT + '/' + d3Name + '/Scene/3Dtile.json';
        if (d3Name.includes('http')) {
            url = d3Name
        }
        var modalOne = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                // show: false,
                // url: d3Name,
                url: url,
                // url: import.meta.env.VITE_APP_BASE_API + ':3001/Productions/' + d3Name + '/Scene/3Dtile.json',
                // shadows: 4,
                // maximumNumberOfLoadedTiles: 1000, // Temporary workaround for low memory mobile devices - Decrease (disable) tile cache.
                // debugShowBoundingVolume: true,
                // debugColorizeTiles: true,
                // debugShowUrl: true,
                // debugShowContentBoundingVolume: true,
                // debugShowViewerRequestVolume: true,
                // debugShowRenderingStatistics: true,
    
                // shadows: Cesium.ShadowMode.DISABLED,
                maximumMemoryUsage: 1024,
                //classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
                //skipLevelOfDetail: true,
                preloadFlightDestinations: true,
                preloadWhenHidden: false,
                //dynamicScreenSpaceError: true,
                maximumScreenSpaceError: spaceNum,
                // debugShowGeometricError: true,
                // debugShowMemoryUsage: true,
                cullRequestsWhileMoving: true,
                progressiveResolutionHeightFraction: 0.5,
                refineToVisible: false,
            })
        )
        modalOne.readyPromise.then(function (tileset) {
    
            Global_ht.model_3dtiles.push(modalOne)
    
            var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
            var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + height);
            var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
            if (zoom) this.viewer.zoomTo(tileset)
        })
    }
    
    addmodel_3dtile_ccc(d3Name = 'SLH_3Dtiles_Data/Part_A_GLF_3Dtile', height, spaceNum = 1, zoom = 1) {
        // console.log('env:' + import.meta.env.VITE_APP_BASE_API)
        var url = import.meta.env.VITE_APP_BASE_API + import.meta.env.VITE_APP_PORT + '/' + d3Name + '/Scene/3Dtile.json';
        if (d3Name.includes('http')) {
            url = d3Name
        }
        var modalOne = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                // show: false,
                // url: d3Name,
                url: url,
                // url: import.meta.env.VITE_APP_BASE_API + ':3001/Productions/' + d3Name + '/Scene/3Dtile.json',
                // shadows: 4,
                // maximumNumberOfLoadedTiles: 1000, // Temporary workaround for low memory mobile devices - Decrease (disable) tile cache.
                // debugShowBoundingVolume: true,
                // debugColorizeTiles: true,
                // debugShowUrl: true,
                // debugShowContentBoundingVolume: true,
                // debugShowViewerRequestVolume: true,
                // debugShowRenderingStatistics: true,
    
                // shadows: Cesium.ShadowMode.DISABLED,
                maximumMemoryUsage: 1024,
                //classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
                //skipLevelOfDetail: true,
                preloadFlightDestinations: true,
                preloadWhenHidden: false,
                //dynamicScreenSpaceError: true,
                maximumScreenSpaceError: spaceNum,
                // debugShowGeometricError: true,
                // debugShowMemoryUsage: true,
                cullRequestsWhileMoving: true,
                progressiveResolutionHeightFraction: 0.5,
                refineToVisible: false,
            })
        )
        modalOne.readyPromise.then(function (tileset) {
    
            Global_ht.model_3dtiles.push(modalOne)
    
            var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
            var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            // var offset = Cesium.Cartesian3.fromRadians(-1.8199e-7,1.2205e-7,106.99390000000001);
            var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude - 1.8199e-7, cartographic.latitude + 1.2205e-7, cartographic.height + 106.99390000000001);
            var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
            if (zoom) this.viewer.zoomTo(tileset)
        })
    }
    
    addGisData() {
        this.addmodel_3dtile_ccc()
        let modelS = [
            'SLH_3Dtiles_Data/Part_A_3Dtile',
            'SLH_3Dtiles_Data/Part_A_3Dtile_fix2',
            
            'SLH_3Dtiles_Data/Part_B_3Dtile',
            'SLH_3Dtiles_Data/Part_B_3Dtile_fix2',

            'SLH_3Dtiles_Data/Part_C_3Dtile',
            'SLH_3Dtiles_Data/Part_C_3Dtile_fix2',

            'SLH_3Dtiles_Data/Part_CM_3Dtile',
            'SLH_3Dtiles_Data/Part_D_3Dtile',
            'SLH_3Dtiles_Data/Part_E_3Dtile',
            'SLH_3Dtiles_Data/Part_F_3Dtile',
            'SLH_3Dtiles_Data/Part_G_3Dtile',
            'SLH_3Dtiles_Data/Part_H_3Dtile',
            'SLH_3Dtiles_Data/Part_I_3Dtile',
            'SLH_3Dtiles_Data/Part_J_3Dtile',
            'SLH_3Dtiles_Data/Part_K_3Dtile',
            'SLH_3Dtiles_Data/Part_L_3Dtile',
            'SLH_3Dtiles_Data/Part_M_3Dtile',
            'SLH_3Dtiles_Data/Part_N_3Dtile',
            'SLH_3Dtiles_Data/Part_O_3Dtile',
            'SLH_3Dtiles_Data/Part_P_3Dtile',
            'SLH_3Dtiles_Data/Part_Q_3Dtile',
            // 'SLH_3Dtiles_Data/Part_R_3Dtile',
            'SLH_3Dtiles_Data/Part_S_3Dtile2',
    
            'SLH_3Dtiles_Data/Part_SH_B_3Dtile',
            'SLH_3Dtiles_Data/Part_SH_B2_3Dtile',
            'SLH_3Dtiles_Data/Part_SH_C_3Dtile',
            'SLH_3Dtiles_Data/Part_SH_C2_3Dtile',
            'SLH_3Dtiles_Data/Part_SH_D_3Dtile',
            'SLH_3Dtiles_Data/Part_SH_D2_3Dtile',
            'SLH_3Dtiles_Data/Part_SH_E_3Dtile',
            'SLH_3Dtiles_Data/Part_T_3Dtile',
            'SLH_3Dtiles_Data/Part_U_3Dtile',
    
            'SLH_3Dtiles_Data/Part_SH_A_3Dtile',
            'SLH_3Dtiles_Data/Part_SH_A2_3Dtile',
            // 'SLH_3Dtiles_Data/CJX',
            'SLH_3Dtiles_Data/CJX2'
        ];
        modelS.forEach(item => {
            this.addmodel_3dtile(item, Global_ht.model_base_height)
        })
    
    
        // addmodel_3dtile('SLH_3Dtiles_Data/Part_SH_A_3Dtile', 135.9251271202479,)
        // addmodel_3dtile('SLH_3Dtiles_Data/Part_SH_A2_3Dtile', 135.9251271202479,)
        // addmodel_3dtile('SLH_3Dtiles_Data/CJX', 135.9251271202479, )
        // addmodel_3dtile('SLH_3Dtiles_Data/CJX2', 135.9251271202479,)
    
    
        this.addmodel_3dtile('SLH_3Dtiles_Data/Part_V_3Dtile', Global_ht.model_base_height, 0.3)
        this.addmodel_3dtile('SLH_3Dtiles_Data/Part_W_3Dtile', Global_ht.model_base_height, 0.3)
        // addmodel_3dtile('SLH_3Dtiles_Data/Part_F_3Dtile_b', Global_ht.model_base_height, 3)
        this.addmodel_3dtile('SLH_3Dtiles_Data/Part_R_3Dtile_b', Global_ht.model_base_height, 3)
        this.addmodel_3dtile('SLH_3Dtiles_Data/HH-玉门1-3D_b', Global_ht.model_base_height_st, 3)
        this.addmodel_3dtile('SLH_3Dtiles_Data/HH-玉门2-3D_b', Global_ht.model_base_height_st, 3)
        this.addmodel_3dtile('SLH_3Dtiles_Data/HH-玉门3-3D_b', Global_ht.model_base_height_st, 3)
        this.addmodel_3dtile('SLH_3Dtiles_Data/HH-玉门4-3D_b', Global_ht.model_base_height_st, 3)
    }

    clear() {
        if (this.tileset) {
            this.viewer.scene.primitives.remove(this.tileset)
            this.tileset = null
        }
    }
}
