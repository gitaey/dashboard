var lyrList = null;

$(window).on("load", function () {

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

    // 모달 zIndex 설정
    $(".modalWrap").on("mousedown", function () {
        $(".modalWrap").css("zIndex", 9999);
        $(this).css("zIndex", 99999);
    }).on("show", function () {
        $(".modalWrap").css("zIndex", 9999);
        $(this).css("zIndex", 99999);
    })

    $(".modalWrap").draggable({
        handle: ".modalTitleWrap",
        containment : 'parent'
        // drag: function (evt, ui) {
        //     $(this).css({
        //         left: "auto",
        //         right: window.innerWidth - ui.position.left - $(this).width()
        //     })
        // },
        // stop: function (evt, ui) {
        //     $(this).css({
        //         left: "auto",
        //         right: window.innerWidth - ui.position.left - $(this).width()
        //     })
        // }
    });

    // 메뉴 선택 이벤트
    $(".btnMenu").on("click", (evt) => {
        var id = evt.target.id;

        $(".btnMenu").removeClass("primary");
        $(evt.target).addClass("primary");

        if(id == "m001") {
            $(".itemGroup.m002").hide();
        }
        else if(id == "m002") {
            $(".itemGroup.m002").show();
        }
        else if(id == "m003") {
            $(".itemGroup.m002").hide();
        } else {
            $(".itemGroup.m002").hide();
        }
    });

    // 보호구역 선택 이벤트
    $("#m001_uea120").on("change", (evt) => {
        var checked = evt.target.checked;

        if(checked) {
            $("[name=includeWater]").attr("disabled", false);
        } else {
            $("[name=includeWater]").attr("disabled", true);
        }

    })

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

    // 위치이동 버튼 클릭
    $("#btnMovePos").on("click", () => {
        var code = "";

        var sidoCode = $("#sido").val();
        var sggCode = $("#sgg").val();
        var emdCode = $("#emd").val();
        var liCode = $("#li").val();
        var isSan =  $("#san").is(":checked") ? "2" : "1";
        var bon = $("#bon").val().lpad(4, "0");
        var bu = $("#bu").val().lpad(4, "0");

        if(sidoCode == "-") {
            alert("행정구역을 선택해주세요");

            return;
        }

        if(sidoCode != "-") code = sidoCode;
        if(sggCode != "-") code = sggCode;
        if(emdCode != "-") code = emdCode;
        if(liCode != "-") code = liCode;

        if(bon == "0000" && bu == "0000") {
            getSect(code);

            return ;
        }

        code = code.rpad(10, "0");
        code = code + isSan + bon + bu;

        getJijuk(code);
    });

    // pnu로 지적도 가져오기
    var getJijuk = (code) => {
        $.ajax({
            url: "/selectJijuk.do",
            data: {
                code
            },
            type: "post",
            success: (res) => {
                if(res.data) {
                    if(res.data.geom) {
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
            }
        });
    };

    // 코드로 행정구역 가져오기
    var getSect = (code) => {
        $.ajax({
            url: "/selectSect.do",
            data: {
                code
            },
            type: "post",
            success: (res) => {
                if(res.data) {
                    if(res.data.geom) {
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
            }
        });
    }

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

    // 거리측정
    $("#calDis").on("click", function (e) {
        if ($("#calHeight").hasClass("active")) {
            sisMeasure.stopMeasure();
        } else {
            sisMeasure.stopMeasure();
            sisMeasure.startMeasure("LineString")

            $("#calHeight").addClass("active");
        }
    });

    // 면적측정
    $("#calArea").on("click", function () {
        if ($("#calHeight").hasClass("active")) {
            sisMeasure.stopMeasure();
        } else {
            sisMeasure.stopMeasure();
            sisMeasure.startMeasure("Polygon")

            $("#calHeight").addClass("active");
        }
    });

    // 맵 초기화
    $("#clearMap").on("click", function () {
        sisMeasure._allClear();
        sisLyr.wfs.selectLayer.getSource().clear();
    });

    // 배경지도 변경
    $("#baseMap, #hybridMap, #noMap").on("click", (e) => {
        var id = e.target.id;

        $("#baseMapWrap a").removeClass("active");
        $(e.target).addClass("active");

        if(id == "hybridMap") {
            sis.vMap.setVisible(false);
            sis.vHybrid.setVisible(true);
            sis.vSatellite.setVisible(true);
        } else if(id == "baseMap") {
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
        prompt("Ctrl + C 버튼을 눌러 복사하세요.",
            'http://localhost:8081/mapMain.do?share=Y'
            + '&x=' + sis.view.getCenter()[0]
            + '&y=' + sis.view.getCenter()[1]
            + '&zoom=' + sis.view.getZoom()
        );
    });

    // Zoom In
    $("#zoomIn").on("click", function() {
        var zoom = sis.view.getZoom();
        sis.view.setZoom(zoom + 1);
    });

    $("#zoomOut").on("click", function() {
        var zoom = sis.view.getZoom();
        sis.view.setZoom(zoom - 1);
    });

});

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