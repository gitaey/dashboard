(function (window, $) {
    "use strict";

    window.Sis3D = function (id, props) {
        this._init(id, props);
    };

    Sis3D.prototype = {
        viewer: null,
        scene: null,
        canvas: null,
        dataSources: null,
        centerPosition: {
            lon: null,
            lat: null,
            height: 0,
            roll: null,
            pitch: null,
            heading: null
        },
        vWorld: {
            vBase: null,
            vSatellite: null,
            vHybrid: null
        },
        // blockLimiter_: false,
        // boundingSphere_: null,

        _init: function (id, props) {
            if (!id) {
                alert("Map ID가 지정되지 않았습니다.");
                return false;
            }
            this._setInitConfig(id, props); // 초기설정
        },

        // 초기 설정
        _setInitConfig: function (id, props) {
            // 속성값 설정
            this.extendProps(props);
            // 3D 지도 생성
            this._create3dMap(id);
            // 컨트롤러 변경
            this._setChangeControl();
            // Extent Limit 변경
            this._setLimitExtnet();
        },

        // 속성값 설정
        extendProps: function (props) {
            this.props = $.extend({}, this.props, props);
        },

        // 3D 지도 생성
        _create3dMap: function (id) {

            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NDBmZTU3MC04M2NiLTQ2YWItODI1Zi0yODc3NzRjODk4YzAiLCJpZCI6MjQzMzYsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1ODUwNTA4MTF9.rGy_wHw1N_t2T6Z0JywCTpg7d-e2vCMPTi-SGyi7MqE';

            this.viewer = new Cesium.Viewer(id, {
                terrain: Cesium.Terrain.fromWorldTerrain(),
                animation: false,
                imageryProvider: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: false,
                sceneModePicker: false,
                selectionIndicator: false,
                timeline: false,
                navigationHelpButton: false,
            });
            this.scene = this.viewer.scene;
            this.canvas = this.viewer.canvas;

            // Center 변경
            this._setCenter();

            // Cesium globe change to BLACK
            this.scene.imageryLayers.removeAll();
            this.scene.globe.baseColor = Cesium.Color.BLACK;

            // 우주배경 visible false
            this.scene.skyBox.show = false;
            this.scene.sun.show = false;
            this.scene.moon.show = false;

            // Entity 더블클릭 마기
            this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

            this._addVWorld();

            var scratchNormal = new Cesium.Cartesian3();
            var previousPosition = new Cesium.Cartesian3();
            var previousDirection = new Cesium.Cartesian3();
            var previousUp = new Cesium.Cartesian3();
            var previousRight = new Cesium.Cartesian3();
            var camera = this.scene.camera;

            var self = this;

            this.viewer.scene.postUpdate.addEventListener(function() {
                var normal = self.scene.globe.ellipsoid.geodeticSurfaceNormal(
                    camera.position,
                    scratchNormal
                );

                var dotProduct = Cesium.Cartesian3.dot(camera.direction, normal);

                if (dotProduct >= 0) {
                    camera.position = Cesium.Cartesian3.clone(previousPosition, camera.position);
                    camera.direction = Cesium.Cartesian3.clone(previousDirection, camera.direction);
                    camera.up = Cesium.Cartesian3.clone(previousUp, camera.up);
                    camera.right = Cesium.Cartesian3.clone(previousRight, camera.right);
                } else {
                    previousPosition = Cesium.Cartesian3.clone(camera.position, previousPosition);
                    previousDirection = Cesium.Cartesian3.clone(camera.direction, previousDirection);
                    previousUp = Cesium.Cartesian3.clone(camera.up, previousUp);
                    previousRight = Cesium.Cartesian3.clone(camera.right, previousRight);
                }
            });

            var rect = new Cesium.Rectangle(2.1021307198825316, 0.5645782169874046, 2.3394587243670193, 0.6777280917102821);
            // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = rect;
            // this.boundingSphere_ = Cesium.BoundingSphere.fromRectangle3D(rect, Cesium.Ellipsoid.WGS84, 300); // lux mean height is 300m

            this.viewer.entities.add({
                rectangle: {
                    coordinates: rect,
                    fill: false,
                    outline: true,
                    outlineColor: Cesium.Color.WHITE,
                },
            });
            // if (this.boundingSphere_) {
            //     this.scene.postRender.addEventListener(this._limitCameraToBoundingSphere.bind(this), this.scene);
            // } // Stop rendering Cesium when there is nothing to do. This drastically reduces CPU/GPU consumption.
        },

        // Controller 변경
        _setChangeControl: function() {
            // Mouse Controller 변경
            this.scene.screenSpaceCameraController.tiltEventTypes = [
                Cesium.CameraEventType.RIGHT_DRAG, Cesium.CameraEventType.PINCH,
                {eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL},
                {eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL}
            ];

            // Mouse Zoom Controller 변경
            this.scene.screenSpaceCameraController.zoomEventTypes = [
                Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH
            ];
        },

        _limitCameraToBoundingSphereRatio: function (height) {
            return height > 3000 ? 9 : 3;
        },

        _limitCameraToBoundingSphere: function() {
            var self = this;

            if (this.boundingSphere_ && !this.blockLimiter_) {
                var position = this.scene.camera.position;
                var carto = Cesium.Cartographic.fromCartesian(position);
                var ratio = this._limitCameraToBoundingSphereRatio(carto.height);

                if (Cesium.Cartesian3.distance(this.boundingSphere_.center, position) > this.boundingSphere_.radius) {
                    var currentlyFlying = camera.flying;

                    if (currentlyFlying === true) {
                        // There is a flying property and its value is true
                        return;
                    } else {
                        this.blockLimiter_ = true;

                        var unblockLimiter = function unblockLimiter() {
                            return self.blockLimiter_ = false;
                        };

                        camera.flyToBoundingSphere(this.boundingSphere_, {
                            complete: unblockLimiter,
                            cancel: unblockLimiter
                        });
                    }
                }
            }
        },

        _setLimitExtnet: function() {

            this.viewer.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;

            // Max Zoom Level
            this.scene.screenSpaceCameraController.maximumZoomDistance = 1100000;

            var self = this;
            var obj = document.querySelector("#compassObj");

            // var cartographic = new Cesium.Cartographic();
            // var camera = this.viewer.scene.camera;
            // var ellipsoid = this.viewer.scene.mapProjection.ellipsoid;

            this.scene.camera.percentageChanged = 0.01;
            this.scene.camera.changed.addEventListener(function() {

                // 카메라 방향 값
                var heading = ( self.viewer.camera.heading * 180 / Math.PI ).toFixed(1);

                // 나침반
                obj.contentDocument.querySelector("svg").style.transform = 'rotate(' + self.viewer.camera.heading + 'rad)';

                var windowPosition = new Cesium.Cartesian2(self.viewer.container.clientWidth / 2, self.viewer.container.clientHeight / 2);
                var pickRay = self.viewer.scene.camera.getPickRay(windowPosition);
                var pickPosition = self.viewer.scene.globe.pick(pickRay, self.scene);

                if(pickPosition) {
                    var pickPositionCartographic = self.viewer.scene.globe.ellipsoid.cartesianToCartographic(pickPosition);
                    var lon = (pickPositionCartographic.longitude * (180 / Math.PI)).toFixed(4);
                    var lat = (pickPositionCartographic.latitude * (180 / Math.PI)).toFixed(4);
                    $("#centerPos").text(`${lon} / ${lat}`);

                    //get Height
                    // ellipsoid.cartesianToCartographic(camera.positionWC, cartographic);
                    // self.centerPosition.lon = cartographic.longitude * (180 / Math.PI);
                    // self.centerPosition.lat = cartographic.latitude * (180 / Math.PI);
                    // self.centerPosition.height = cartographic.height;
                    // self.centerPosition.heading = self.viewer.camera.heading;
                    // self.centerPosition.pitch = self.viewer.camera.pitch
                    // self.centerPosition.roll = self.viewer.camera.roll
                    // console.log(cartographic.latitude * (180 / Math.PI));
                    // console.log(self.centerPosition.lat)
                }

            });
        },

        _setCenter: function() {
            // 화면공유용
            // if(hasParameterByName("share")) {
            //     this.viewer.camera.setView({
            //         destination: new Cesium.Cartesian3.fromDegrees(
            //             parseFloat(getParameterByName("lon")),
            //             parseFloat(getParameterByName("lat")),
            //             parseFloat(getParameterByName("height"))),
            //         orientation: {
            //             heading: parseFloat(getParameterByName("height")),
            //             pitch: parseFloat(getParameterByName("pitch")),
            //             roll: parseFloat(getParameterByName("roll"))
            //         }
            //     });
            // }else {
                // 전라남도청 위치
                this.viewer.camera.setView({
                    destination: new Cesium.Cartesian3.fromDegrees( 126.46407823345542, 34.81628129322431, 14000),
                });
            // }

        },

        _addVWorld: function(visible, map) {

            var layers = {
                Base: {layer : 'Base', tileType : 'png'},
                Gray: {layer : 'gray', tileType : 'png'},
                Midnight: {layer : 'midnight', tileType : 'png'},
                Hybrid: {layer : 'Hybrid', tileType : 'png'},
                Satellite: {layer : 'Satellite', tileType : 'jpeg'}
            }

            var vBase = new Cesium.WebMapTileServiceImageryProvider({
                url: PATH + `/map/proxy/proxyBackground.do?x={TileCol}&y={TileRow}&z={TileMatrix}&type=vworld`,
                layer : layers["Base"].layer,
                tileMatrixSetID: 'layers["Base"].layer',
                style : 'default',
                maximumLevel: 19,
                credit : new Cesium.Credit('VWorld Korea')
            });

            var vSatellite = new Cesium.WebMapTileServiceImageryProvider({
                url: PATH + `/map/proxy/proxyBackgroundSatellite.do?x={TileCol}&y={TileRow}&z={TileMatrix}&type=vworld`,
                layer : layers["Satellite"].layer,
                tileMatrixSetID: 'layers["Satellite"].layer',
                style : 'default',
                maximumLevel: 19,
                credit : new Cesium.Credit('VWorld Korea')
            });

            var vHybrid = new Cesium.WebMapTileServiceImageryProvider({
                url: PATH + `/map/proxy/proxyBackgroundHybrid.do?x={TileCol}&y={TileRow}&z={TileMatrix}&type=vworld`,
                layer : layers["Satellite"].layer,
                tileMatrixSetID: 'layers["Satellite"].layer',
                style : 'default',
                maximumLevel: 19,
                credit : new Cesium.Credit('VWorld Korea')
            });

            this.vWorld.vBase = new Cesium.ImageryLayer(vBase);
            this.vWorld.vSatellite = new Cesium.ImageryLayer(vSatellite);
            this.vWorld.vHybrid = new Cesium.ImageryLayer(vHybrid);

            this.scene.imageryLayers.add(this.vWorld.vBase);
            this.vWorld.vBase.show = false;
            this.scene.imageryLayers.add(this.vWorld.vSatellite);
            this.scene.imageryLayers.add(this.vWorld.vHybrid)
        },

        changeBaseMap: function(id) {
            switch(id) {
                case 'vworldMap':
                        this.vWorld.vBase.show = true;
                        this.vWorld.vSatellite.show = false;
                        this.vWorld.vHybrid.show = false;
                    break;

                case 'hybridMap':
                        this.vWorld.vBase.show = false;
                        this.vWorld.vSatellite.show = true;
                        this.vWorld.vHybrid.show = true;
                    break;

                default:
                    return;
            }
        },

        resetCamera: function() {
            this.viewer.camera.setView({
                orientation: {
                    heading: 0,
                    pitch: this.viewer.camera.pitch,
                    roll: this.viewer.camera.roll
                }
            });
        },

        zoomIn: function() {
            this.scene.camera.zoomIn();
        },

        zoomOut: function() {
            this.scene.camera.zoomOut();
        }
    };

})(window, jQuery);

