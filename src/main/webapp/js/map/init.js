var lyrList = null;
var mapPropsOverlay = null;

(function ($) {
    $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });
})(jQuery);

$(window).on("load", function () {

    // 주소검색
    window.searchAddr = new SearchAddr({
        keywordID: "keyword",
        resultID: "itemsWrap",
        countID: "count",
    })

    // 2D Map Init
    window.sis = new SisMap("map", {
        baseMap: true
    });

    window.sisLyr = new SisLayer(sis.map, {
        crsCode: "EPSG:5186"
    });
    window.sisMeasure = new SisMeasure(sis.map);

    window.sisTree = new SisTree(sis.map, {
        target: "tree"
    });

    $('.ui.dropdown').dropdown();

    $('.iconPopup').popup({
        position: 'right center',
        hoverable: true,
        closable: false,
        on: 'click'
    });

    // input 숫자만 입력가능하게 설정
    $(".numberOnly").numberOnly();

    // 체크박스
    $('.ui.checkbox').checkbox();

    // 모달
    $(".modalWrap .close").on("click", (evt) => {
        var modal = $(evt.target).closest(".modalWrap");

        modal.attr("style", "");
        modal.hide();
    });

    // 모달 최소화
    $(".modalWrap .minimize").on("click", (evt) => {
        var modal = $(evt.target).closest(".modalWrap");

        modal.find(".modalBody").hide();
        modal.find(".minimize").hide();
        modal.find(".maximize").show();
    });

    // 모달 최대화
    $(".modalWrap .maximize").on("click", (evt) => {
        var modal = $(evt.target).closest(".modalWrap");

        modal.find(".modalBody").show();
        modal.find(".minimize").show();
        modal.find(".maximize").hide();
    });


    // 모달 zIndex 설정
    $(".modalWrap").on("mousedown", function () {
        $(".modalWrap").css("zIndex", 9999);
        $(this).css("zIndex", 99999);
    }).on("show", function () {
        $(".modalWrap").css("zIndex", 9999);
        $(this).css("zIndex", 99999);
    })

    // 모달 드래그
    $(".modalWrap").draggable({
        handle: ".modalTitleWrap",
        containment: 'parent'
    });

    $(".wrapToggle").on("click", (evt) => {
        $("#searchWrap, #posMoveWrap").toggleClass("close");
        $("#searchWrap .wrapToggle").toggleClass("close");
        $(".modalWrap").toggleClass("close");

    });

    // 메뉴 선택 이벤트
    $(".btnMenu").on("click", (evt) => {
        var id = evt.target.id;

        $(".btnMenu").removeClass("primary");
        $(evt.target).addClass("primary");

        $(".itemGroup:not(.pri)").show();

        if (id == "m001") {
            $(".itemGroup.m002, .iconPopup.m002").hide();
            $(".itemGroup.m003, .itemGroup.m005").hide();
        } else if (id == "m002") {
            $(".itemGroup.m002, .iconPopup.m002").show();
            $(".itemGroup.m003, .itemGroup.m005").hide();
        } else if (id == "m003") {
            // $("#left_sido").val("-").change();
            $(".itemGroup.m002, .iconPopup.m002, .itemGroup.m005").hide();
            $(".itemGroup.m003").show();
        } else if (id == "m005") {
            $(".itemGroup.m005").show();
            $(".itemGroup:not(.pri)").hide();
        } else {
            $(".itemGroup.m002, .iconPopup.m002").hide();
            $(".itemGroup.m003, .itemGroup.m005").hide();
        }
    });

    // 보호구역 선택 이벤트
    $("#uea120").on("change", (evt) => {
        var checked = evt.target.checked;

        if (checked) {
            $("[name=includeWater]").attr("disabled", false);
        } else {
            $("[name=includeWater]").attr("disabled", true);
        }
    });

    // 수원공 선택 이벤트
    $("[name=includeWater]").on("change", (evt) => {
        var id = evt.target.id;

        if (id == "nonIncludeWater") {
            $("#waterBufferWrap").removeClass("disabled");
        } else {
            $("#waterBufferWrap").addClass("disabled");
        }
    });

    // 레이어 불러오기
    $.ajax({
        url: PATH + "/selectLayers.do",
        type: "post",
        success: function (res) {
            lyrList = res.data;

            sisTree.createTree(lyrList);
        }
    });

    var selectSido = new SisSelectbox(".selectSido", {
        url: "/selectSido.do",
        defaultValue: "-",
        allField: false,
        fields: {
            text: "ctpKorNm",
            value: "ctprvnCd"
        }
    });

    var selectSgg = new SisSelectbox(".selectSgg", {
        url: "/selectSgg.do",
        allField: true,
        fields: {
            text: "sigKorNm",
            value: "sigCd"
        }
    });

    var selectEmd = new SisSelectbox(".selectEmd", {
        url: "/selectEmd.do",
        allField: true,
        fields: {
            text: "emdKorNm",
            value: "emdCd"
        }
    });

    var selectLi = new SisSelectbox(".selectLi", {
        url: "/selectLi.do",
        allField: true,
        fields: {
            text: "liKorNm",
            value: "liCd"
        }
    });

    $.each($(".selectSido"), (idx, item) => {
        var id = item.getAttribute("parent");

        selectSido.setConn({
            id: id + "_sido",
            onChange: function () {
                var val = $(this).val();
                var element = selectSgg.getElementById(`${id}_sgg`);
                selectSgg.setUrlParams({code: val});
                selectSgg.getDataByUrl(element, true);
            }
        });
    });

    $.each($(".selectSgg"), (idx, item) => {
        var id = item.getAttribute("parent");

        selectSgg.setConn({
            id: id + "_sgg",
            onChange: function () {
                var val = $(this).val();
                var element = selectEmd.getElementById(`${id}_emd`);
                selectEmd.setUrlParams({code: val});
                selectEmd.getDataByUrl(element, true);
            }
        });
    });

    $.each($(".selectEmd"), (idx, item) => {
        var id = item.getAttribute("parent");

        selectEmd.setConn({
            id: id + "_emd",
            onChange: function () {
                var val = $(this).val();
                var element = selectLi.getElementById(`${id}_li`);
                selectLi.setUrlParams({code: val});
                selectLi.getDataByUrl(element, true);
            }
        });
    });

    // 지번검색 버튼 클릭
    $("#btnShowJibun").on("click", (evt) => {
        $("#searchPosModal #searchPlaceWrap").hide();
        $("#searchPosModal #searchJibunWrap").show();
        $("#searchPosModal").show();
    });

    // 명칭검색 버튼 클릭
    $("#btnShowPlace").on("click", (evt) => {
        $("#searchPosModal #searchPlaceWrap").show();
        $("#searchPosModal #searchJibunWrap").hide();
        $("#searchPosModal").show();
    });

    // 명칭검색 조회하기
    $("#keyword").on("keypress", (evt) => {
        if (evt.key == "Enter") {
            addressSearch(1);
        }
    })

    // 명칭검색 초기화
    $("#btnPlaceRefresh").on("click", () => {
        $("#keyword").val("");
        $("#placeResultWrap").hide();
        if (searchAddr.overlay) sis.map.removeOverlay(searchAddr.overlay);
    });

    var addressSearch = function (page) {
        searchAddr.searchName(page);
    }

    // 지번검색 위치이동 버튼 클릭
    $("#btnJibunSearch").on("click", () => {
        var code = "";

        var sidoCode = $("#m000_sido").val();
        var sggCode = $("#m000_sgg").val();
        var emdCode = $("#m000_emd").val();
        var liCode = $("#m000_li").val();
        var isSan = $("#san").is(":checked") ? "2" : "1";
        var bon = $("#bon").val().lpad(4, "0");
        var bu = $("#bu").val().lpad(4, "0");

        if (sidoCode == "-") {
            alert("행정구역을 선택해주세요");

            return;
        }

        if (sidoCode != "-") code = sidoCode;
        if (sggCode != "-") code = sggCode;
        if (emdCode != "-") code = emdCode;
        if (liCode != "-") code = liCode;

        if (bon == "0000" && bu == "0000") {
            getSect(code);

            return;
        }

        code = code.rpad(10, "0");
        code = code + isSan + bon + bu;

        getJijuk(code);
    });

    // 진흥지역 검색
    $("#btnSearch").on("click", (e) => {
        var id = $("#selectMenu .btnMenu.primary").attr("id");

        var code = "";

        var sidoCode = $("#left_sido").val();
        var sggCode = $("#left_sgg").val();
        var emdCode = $("#left_emd").val();
        // var liCode = $("#m000_li").val();

        if (sidoCode != "-") code = sidoCode;
        if (sggCode != "-") code = sggCode;
        if (emdCode != "-") code = emdCode;
        // if(liCode != "-") code = liCode;

        if (id == "m001") {
            getSect(code);

            $(`#${id}Modal`).find(".maximize").hide();
            $(`#${id}Modal`).find(".minimize").show();
            $(`#${id}Modal`).find(".modalBody").show();
            $(`#${id}Modal`).show();

            $(`#${id}Ue101Wrap`).show();
            $(`#${id}LdregWrap`).hide();
            getDistrictStatus(id);
        } else if (id == "m002") {
            getSect(code);

            $(`#${id}Modal`).find(".maximize").hide();
            $(`#${id}Modal`).find(".minimize").show();
            $(`#${id}Modal`).find(".modalBody").show();
            $(`#${id}Modal`).show();

            getMngNo(id);
        } else if (id == "m003") {
            getStatistics(id);
        } else if (id == "m004") {
            getSect(code);
            $(`#${id}Modal`).find(".maximize").hide();
            $(`#${id}Modal`).find(".minimize").show();
            $(`#${id}Modal`).find(".modalBody").show();
            $(`#${id}Modal`).show();
            getDiscon(id);
        } else if (id == "m005") {
            getSect(code);
            $(`#${id}Modal`).find(".maximize").hide();
            $(`#${id}Modal`).find(".minimize").show();
            $(`#${id}Modal`).find(".modalBody").show();
            $(`#${id}Modal`).show();
            getFarmland(id);
        }
    });

    $("#mapMenuWrap #lyrWrap.btn").on("click", (e) => {
        var isActive = $(e.target).closest(".btn").hasClass("active");

        // 팝업안에 메뉴클릭했을때
        if ($(e.target).closest(".menuPop").length) return;

        $("#mapMenuWrap .btn").removeClass("active");
        $("#tree").hide();

        if (!isActive) {
            $(e.target).closest(".btn").toggleClass("active");
            $("#tree").toggle();
        }
    });

    // 전체화면
    $("#fullScreen").on("click", () => {
        $("#searchWrap").hide();
        $("#mapControlWrap").hide();
        $("#mapControlWrap").hide();
        $("#baseMapWrap, #lyrWrap, #fullScreen").hide();
        $("#posMoveWrap").hide();
        $("#roadView").hide();

        $("#originScreen").show();
    });

    // 전체화면 종료
    $("#originScreen").on("click", () => {
        $("#searchWrap").show();
        $("#mapControlWrap").show();
        $("#mapControlWrap").show();
        $("#baseMapWrap, #lyrWrap, #fullScreen").show();
        $("#posMoveWrap").show();
        $("#roadView").show();

        $("#originScreen").hide();
    });

    $("#roadView").on("click", (evt) => {
        sis.map.un("click", _getLayerInformation);
        
        $("#roadView").toggleClass("active");

        var visible = $("#roadView").hasClass("active");

        if (visible) {
            sis.daumRoadView.setVisible(true);

            var roadviewContainer = document.getElementById("roadViewWrap"); //로드뷰를 표시할 div
            sis.roadViewInit(roadviewContainer);
        } else {
            sis.daumRoadView.setVisible(false);
            sis.closeRoadView(roadviewContainer, true);
        }
    });

    // 필지정보
    $("#information").on("click", function (e) {
        if (!$("#information .icon").hasClass("active")) {
            $("#information .icon").addClass("active");

            sis.map.un("click", _getLayerInformation);
            sis.map.getViewport().removeEventListener("contextmenu", _stopLayerInformation);

            sis.map.on("click", _getLayerInformation);
            sis.map.getViewport().addEventListener("contextmenu", _stopLayerInformation);
        } else {
            $("#information .icon").removeClass("active");
            sis.map.getViewport().removeEventListener("contextmenu", _stopLayerInformation);

            sis.map.un("click", _getLayerInformation);
        }
    });

    var _stopLayerInformation = () => {
        $("#information .icon").removeClass("active");
        sis.map.un("click", _getLayerInformation);
    }

    var _getLayerInformation = (evt) => {
        var oriCoord = evt.coordinate;
        var coordinate = ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:5186");

        var x = coordinate[0];
        var y = coordinate[1];

        $.ajax({
            url: "selectJijukByCoord.do",
            type: "post",
            data: {
                x,
                y
            },
            beforeSend: () => {
                $("#mapLoading").show();
            },
            success: (res) => {
                var item = res.item;
                var data = res.data;

                var wkt = item.geom;
                var feature = sisLyr.createFeatureByWKT(wkt);

                sisLyr.wfs.selectLayer.getSource().clear();
                sisLyr.wfs.selectLayer.getSource().addFeature(feature);

                sis.view.fit(feature.getGeometry().getExtent());

                sis.view.setZoom(sis.view.getZoom() - 2);

                $("#inforModal").show();

                var bobn = data.bobn ? parseInt(data.bobn) : "";
                var bubn = data.bubn > 0 ? "-" + parseInt(data.bubn) : "";
                var jibun = bobn + bubn;

                $("#inforAddr").text(data.addr || "-");
                $("#inforSan").text(data.san || "-");
                $("#inforJibun").text(jibun || "-");
                $("#inforJimok").text(data.jimok || "-");
                $("#inforParea").text(numberWithCommas(data.parea) || "-");
                $("#inforGarea").text(numberWithCommas(item.area) || "-");
                $("#inforOwnGbn").text(data.ownGbn || "-");

                $("#mapLoading").hide();
            },
            error: () => {
                $("#mapLoading").hide();
            }
        });
    }

    // 거리측정
    $("#calDis").on("click", function (e) {
        sis.map.un("click", _getLayerInformation);

        sisMeasure.stopMeasure();
        sisMeasure.startMeasure("LineString")
    });

    // 면적측정
    $("#calArea").on("click", function () {
        sis.map.un("click", _getLayerInformation);

        sisMeasure.stopMeasure();
        sisMeasure.startMeasure("Polygon")
    });

    // 맵 초기화
    $("#clearMap").on("click", function () {
        sis.map.un("click", _getLayerInformation);
        sisMeasure._allClear();
        sisLyr.wfs.selectLayer.getSource().clear();
        if (searchAddr.overlay) sis.map.removeOverlay(searchAddr.overlay);
    });

    // 배경지도 변경
    $("#baseMap, #hybridMap, #noMap").on("click", (e) => {
        var id = e.target.id;

        $("#baseMapWrap a").removeClass("active");
        $(e.target).addClass("active");

        if (id == "hybridMap") {
            sis.vMap.setVisible(false);
            sis.vHybrid.setVisible(true);
            sis.vSatellite.setVisible(true);
        } else if (id == "baseMap") {
            sis.vMap.setVisible(true);
            sis.vHybrid.setVisible(false);
            sis.vSatellite.setVisible(false);
        } else {
            sis.vMap.setVisible(false);
            sis.vHybrid.setVisible(false);
            sis.vSatellite.setVisible(false);
        }
    });


    $(".menuPop .menuWrap").on("click", (e) => {
        var target = $(e.target).closest(".menuWrap");
        target.toggleClass("active");

        var id = target.attr("id");
        var visible = target.hasClass("active");

        if (id == "lsmd_adm_sect_sgg_jn") {
            boundary.show = visible;
        }
    })


    // Modal Hide
    $(".modal-close-btn").on("click", function (e) {
        sisLayer3d.removePickedFeatureColor();
        $("#info-modal").hide();
    });

    // 화면 저장
    $("#saveScreen").on("click", function (e) {
        sis.map.un("click", _getLayerInformation);

        // sis3d.viewer.render();
        html2canvas(document.querySelector("#map"), {
            allowTaint: false,
            useCORS: true,
        }).then(function (canvas) {
            var image = canvas.toDataURL('image/png', 1.0);
            downloadURI(image, "화면저장.png");
        })
    });

    // 화면 공유
    $("#shareScreen").on("click", function (e) {
        sis.map.un("click", _getLayerInformation);

        prompt("Ctrl + C 버튼을 눌러 복사하세요.",
            'http://localhost:8081/mapMain.do?share=Y'
            + '&x=' + sis.view.getCenter()[0]
            + '&y=' + sis.view.getCenter()[1]
            + '&zoom=' + sis.view.getZoom()
        );
    });

    // Zoom In
    $("#zoomIn").on("click", function () {
        var zoom = sis.view.getZoom();
        sis.view.setZoom(zoom + 1);
    });

    $("#zoomOut").on("click", function () {
        var zoom = sis.view.getZoom();
        sis.view.setZoom(zoom - 1);
    });

});

// pnu로 지적도 가져오기
var getJijuk = (code) => {
    $.ajax({
        url: "/selectJijuk.do",
        data: {
            code
        },
        async:false,
        type: "post",
        beforeSend: () => {
            $("#jibunSearchLoading").show();
            $("#mapLoading").show();
        },
        success: (res) => {
            if (res.data) {
                if (res.data.geom) {
                    var wkt = res.data.geom;
                    var format = new ol.format.WKT();
                    var feature = format.readFeature(wkt, {
                        dataProjection: 'EPSG:5186',
                        featureProjection: 'EPSG:3857'
                    });

                    sisLyr.wfs.selectLayer.getSource().clear();
                    sisLyr.wfs.selectLayer.getSource().addFeature(feature);

                    sis.view.fit(feature.getGeometry().getExtent());
                }
            }
        },
        complete: () => {
            $("#jibunSearchLoading").hide();
            $("#mapLoading").hide();
        },
        error: () => {
            $("#jibunSearchLoading").hide();
            $("#mapLoading").hide();
        }
    })
};

// 코드로 행정구역 가져오기
var getSect = (code) => {
    $.ajax({
        url: "/selectSect.do",
        data: {
            code
        },
        type: "post",
        beforeSend: () => {
            $("#mapLoading").show();
        },
        success: (res) => {
            if (res.data) {
                if (res.data.geom) {
                    var wkt = res.data.geom;
                    var format = new ol.format.WKT();
                    var feature = format.readFeature(wkt, {
                        dataProjection: 'EPSG:5186',
                        featureProjection: 'EPSG:3857'
                    });

                    sisLyr.wfs.selectLayer.getSource().clear();
                    sisLyr.wfs.selectLayer.getSource().addFeature(feature);

                    sis.view.fit(feature.getGeometry().getExtent());
                }
            }
        },
        complete: () => {
            $("#mapLoading").hide();
        },
        error: () => {
            alert("필지조회 오류");
            $("#mapLoading").hide();
        }
    });
}


function downloadURI(uri, name) {
    var anchor = document.createElement('a');
    anchor.setAttribute('href', uri); //path
    anchor.setAttribute('download', name); //file name
    document.body.appendChild(anchor);
    anchor.click(); //<a> tag click
    anchor.parentNode.removeChild(anchor);
}

function compassClickEvt() {
    sis3d.resetCamera();
}


(function (window, $) {
    /* Combobox 실행대기 후 실행 */
    $.waitForLazyRunners = function (callback) {
        var run = function () {
            if (!$.runner || $.runner <= 0) {
                clearInterval(interval);
                if (typeof callback === 'function') {
                    callback();
                }
            } else {
                //console.log("wait...");
            }
        };
        var interval = setInterval(run, 30);
    }
})(window, jQuery);