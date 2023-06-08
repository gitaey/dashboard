(function (window, $) {
    "use strict";

    window.Sis3DLayer = function (map) {
        this._init(map);
    };

    Sis3DLayer.prototype = {
        map: null,
        loadPrim: {},
        feature: {
            pickedFeature: null
        },
        infoCondition: false,

        _init: function (map) {
            if (!map) {
                alert("지도를 설정하여주세요.");
                return false;
            }

            this.map = map;

        },

        addBuldFromAsset: async function(name, assetId) {

            var tileset, clickHandler;
            var self = this;

            tileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId,
                {
                    classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                });

            tileset.style = new Cesium.Cesium3DTileStyle({
                color: "rgba(255, 255, 255, 0.1)",
            });

            this.map.scene.primitives.add(tileset);
            this.loadPrim[name + "_asset"] = tileset;

            clickHandler = this.map.viewer.screenSpaceEventHandler.getInputAction(
                Cesium.ScreenSpaceEventType.LEFT_CLICK
            );

            if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(this.map.scene)) {

                this.map.viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {

                    if(self.infoCondition) {

                        if(self.feature["pickedFeature"] != null) {
                            const tmpPickedFeature = self.map.scene.pick(movement.position);
                            if(tmpPickedFeature instanceof Cesium.Cesium3DTileFeature) {
                                self.feature["pickedFeature"].color = new Cesium.Color(1, 1, 1, 0.1);
                            }

                        }
                        const pickedFeature = self.map.scene.pick(movement.position);

                        if(pickedFeature instanceof Cesium.Cesium3DTileFeature) {
                            self.feature["pickedFeature"] = pickedFeature;
                            self.feature["pickedFeature"].color = new Cesium.Color(1, 0, 0, 0.5);
                            var sigCd = self.feature["pickedFeature"].getProperty("SIG_CD");        // 시군구 코드
                            var emdCd = self.feature["pickedFeature"].getProperty("EMD_CD");        // 읍면동 코드
                            var liCd = self.feature["pickedFeature"].getProperty("LI_CD");          // 리 코드
                            var mntnYn = self.feature["pickedFeature"].getProperty("MNTN_YN") == '0' ? '1' : '2';      // 산 여부
                            var lnbrMnnm = String(self.feature["pickedFeature"].getProperty("LNBR_MNNM")).lpad(4, '0');  // 본번
                            var lnbrSlno = String(self.feature["pickedFeature"].getProperty("LNBR_SLNO")).lpad(4, '0');  // 부번
                            var buldNm = self.feature["pickedFeature"].getProperty("BULD_NM");      // 건축물대장건물명
                            var buldNmDc = self.feature["pickedFeature"].getProperty("BULD_NM_DC"); // 상세건물명

                            // $(".modal-body").html("건축물번호 : " + self.feature["pickedFeature"].getProperty("BD_MGT_SN"));
                            console.log(sigCd + emdCd + liCd + mntnYn + lnbrMnnm + lnbrSlno, buldNm + " " + buldNmDc);

                            // Modal Show
                            $("#info-modal").show();
                        }

                        if (!Cesium.defined(self.feature["pickedFeature"])) {
                            clickHandler(movement);
                            return;
                        }
                    }
                },
                Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
        },

        removePickedFeatureColor: function() {
            if(this.feature["pickedFeature"] != null) this.feature["pickedFeature"].color = new Cesium.Color(1, 1, 1, 0.1);
        },

        addDroneModel: async function(name) {
            const droneTileset = await Cesium.Cesium3DTileset.fromUrl(
                'http://sisnet.iptime.org:8092/cslist/' + name + '/' + name + '.json',
                {
                    shadows: Cesium.ShadowMode.DISABLED, //타일 표면에 그림자를 드리울지 여부. 로딩시 ENABLED가 아니면 속성 수정반영이 잘 안되었음
                    maximumScreenSpaceError: 1, //Default 16. 세분화 수준 향상 값 : 작을수록 디테일함
                    maximumMemoryUsage: 2048, //Default 512. 개발PC기준 1024 설정시 더 불안정 했음
                    cullWithChildrenBounds: true, //Default true. 최적화 옵션. 자식을 묶는 볼륨을 결합하여 타일을 제거할지 여부.
                    skipLevelOfDetail: true, //Default true. 최적화 옵션. 순회 중에 디테일 스킵의 레벨을 적용할지 어떨지를 판정
                    baseScreenSpaceError: 1024, //Default 1024. skipLevelOfDetail이 true 일 때, 디테일 수준을 건너 뛰기 전에 도달해야하는 화면 공간 오류
                    skipScreenSpaceErrorFactor: 16, //Default 16. skipLevelOfDetail이 true 인 경우 건너 뛸 최소 화면 공간 오류를 정의하는 배율. 로드 할 타일을 결정하기 위해 skipLevels와 함께 사용.
                    skipLevels: 1, //Default 1. skipLevelOfDetail이 true 인 경우 타일을로드 할 때 건너 뛸 최소 레벨 수를 정의하는 상수. 0이면 아무 레벨도 건너 뜀. 로드 할 타일을 결정하기 위해 skipScreenSpaceErrorFactor와 함께 사용.
                    immediatelyLoadDesiredLevelOfDetail: false, //Default false. skipLevelOfDetail이 true이면 최대 화면 공간 오류를 충족시키는 타일 만 다운로드. 건너 뛰는 요인은 무시되고 원하는 타일 만로드.
                    loadSiblings: false, //Default false. skipLevelOfDetail이 true 일 때 보이는 타일의 형제가 순회 중에 항상 다운로드되는지 여부를 결정,

                });

            this.map.scene.primitives.add(droneTileset);
            this.loadPrim[name + "_drone"] = droneTileset;

            const heightOffset = 22;
            const boundingSphere = droneTileset.boundingSphere;
            const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
            const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
            const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
            const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());

            droneTileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
            droneTileset._root.transform = Cesium.Matrix4.IDENTITY;
            this.map.scene.camera.flyToBoundingSphere(droneTileset.boundingSphere);

            droneTileset.initialTilesLoaded.addEventListener(function () {
                console.log('초기 타일이 로드됨');
            });

            droneTileset.allTilesLoaded.addEventListener(function () {
                console.log('모든 타일이 로드됨');
            });

            droneTileset.loadProgress.addEventListener(function (numberOfPendingRequests, numberOfTilesProcessing) {
                if ((numberOfPendingRequests === 0) && (numberOfTilesProcessing === 0)) {
                    $("#tileLoading").html("3D Tile Loading...");
                    $("#tileLoading").hide();
                    return;
                }
                $("#tileLoading").show();
                $("#tileLoading").html("3D Tile Loading...(" + numberOfPendingRequests + "/" + numberOfTilesProcessing + ")");
                // console.log('Loading: requests: ' + numberOfPendingRequests + ', processing: ' + numberOfTilesProcessing);
            });
        },

        removeFromName: function(name) {
            const drone = this.loadPrim[name + "_drone"];
            const asset = this.loadPrim[name + "_asset"];
            const prm = this.map.scene.primitives;

            if(drone !== undefined && asset !== undefined) {
                prm.remove(drone);
                prm.remove(asset);
                this.feature.pickedFeature = null;
            }
        },

        removeAll: function() {
            this.map.scene.primitives.removeAll();
        }

    };

})(window, jQuery);

