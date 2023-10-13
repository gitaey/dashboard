(function (window, $) {
    "use strict";

    window.SearchAddr = function (props = {}) {
        var self = this;

        this.keywordID = props.keywordID ? props.keywordID : "";
        this.resultID = props.resultID ? props.resultID : "";
        this.countID = props.countID ? props.countID : "";

        this.pagination = new SisPagination({
            id: "addrSearchPagination",
            totalCount: 0,
            viewCount: 15,
            onClick: function (evt) {
                self.searchName(evt);
            }
        });

        this.extendProps(props);
    };

    SearchAddr.prototype = {
        keywordID: "",
        resultID: "",
        countID: "",

        extendProps: function (props) {
            this.props = $.extend({}, this.props, props);
        },

        // 명칭검색 (카카오)
        searchName: function (page = 1) {
            var self = this;
            const size = 15;
            const query = $("#" + this.keywordID).val();

            var data = {
                page,
                size,
                query,
                request: "search",
                format: "json",
                type: "place",
                crs: "EPSG:4326",
            };

            // AJAX 주소 검색 요청
            $.ajax({
                url: "/map/proxy/vSearch.do",
                type: "get",
                dataType: "json",
                data: data, // 요청 변수 설정
                beforeSend: (xhr) => {
                    $("#jibunSearchLoading").show();
                    // xhr.setRequestHeader("Authorization", "KakaoAK baf884e4526f4f1d9f15d8b93b539c7d");
                },
                success: function (res) {
                    var res = res.response;

                    if (res.record.total > 0) {
                        const items = res.result.items || [];

                        $("#" + self.countID).text(numberWithCommas(res.record.total));
                        self.createTable(items, res.record.total);

                        self.pagination.setDataCount(res.record.total);
                    } else {
                        // 도로명주소 찾기
                        data.type = "address";
                        data.category = "road";

                        $.ajax({
                            url: "/map/proxy/vSearch.do",
                            type: "get",
                            dataType: "json",
                            data,
                            success: function (res) {
                                res = res.response;

                                if (res.record.total > 0) {
                                    const items = res.result.items || [];

                                    $("#" + self.countID).text(numberWithCommas(res.record.total));
                                    self.createTable(items, res.record.total, true);

                                    self.pagination.setDataCount(res.record.total);
                                } else {
                                    data.type = "address";
                                    data.category = "PARCEL";

                                    $.ajax({
                                        url: "/map/proxy/vSearch.do",
                                        type: "get",
                                        dataType: "json",
                                        data,
                                        success: function (res) {
                                            res = res.response;

                                            if (res.record.total > 0) {
                                                const items = res.result.items || [];

                                                $("#" + self.countID).text(numberWithCommas(res.record.total));
                                                self.createTable(items, res.record.total);

                                                self.pagination.setDataCount(res.record.total);
                                            } else {
                                                $("#" + self.countID).text(0);
                                                self.pagination.setDataCount(0);
                                            }
                                        },
                                    });
                                }
                            },
                        });
                    }

                    $("#placeResultWrap").show();
                    $("#jibunSearchLoading").hide();
                },
                error: function (xhr, status, error) {
                    $("#placeResultWrap").hide();
                    $("#jibunSearchLoading").hide();
                    alert("에러발생"); // AJAX 호출 에러
                },
            });
        },

        // 명칭검색 테이블 생성
        createTable: function (items, totalCount, isRoadAddr) {
            var self = this;
            $("#" + self.resultID).html("");

            items.map((row, idx) => {
                if (!isRoadAddr) {
                    var title = row.title || "-";
                    row.address.bldnm = row.address.bldnm || "";
                    row.address.bldnmdc = row.address.bldnmdc || "";

                    var addr = row.address.parcel || "-";
                    var road = row.address.road || "-";

                    if (title == "-") title = (row.address.bldnm + " " + row.address.bldnmdc) != " " ? row.address.bldnm + " " + row.address.bldnmdc : "-";
                    if (title == "-") title = addr || "-";
                    if (title == "-") title = road || "-";

                    var str = '<div id=addrSearch' + idx + ' class="item">';
                    str += '<span class="itemTitle">' + title + '</span>';
                    str += '<span class="itemRoadAddr">' + addr + '</span>';
                    str += '<span class="itemAddr">' + road + '</span>';
                    str += '</div>';

                    $("#" + self.resultID).append(str);

                    $("#addrSearch" + idx).on("click", function () {
                        self.movePoint(row);
                    });
                } else {
                    var title = row.title || "-";
                    row.address.bldnm = row.address.bldnm || "";
                    row.address.bldnmdc = row.address.bldnmdc || "";

                    var addr = row.address.parcel || "-";
                    var road = row.address.road || "-";

                    if (title == "-") title = (row.address.bldnm + " " + row.address.bldnmdc) != " " ? row.address.bldnm + " " + row.address.bldnmdc : "-";
                    if (title == "-") title = addr || "-";
                    if (title == "-") title = road || "-";

                    var str = '<div id=addrSearch' + idx + ' class="item">';
                    str += '<span class="itemTitle">' + title + '</span>';
                    str += '<span class="itemRoadAddr">' + addr + '</span>';
                    str += '<span class="itemAddr">' + road + '</span>';
                    str += '</div>';

                    $("#" + self.resultID).append(str);

                    $("#addrSearch" + idx).on("click", function () {
                        self.movePoint(row);
                    });
                }
            });
        },

        lpad: function (str, padLen, padStr) {
            if (padStr.length > padLen) {
                console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
                return str;
            }
            str += ""; // 문자로
            padStr += ""; // 문자로
            while (str.length < padLen) str = padStr + str;
            str = str.length >= padLen ? str.substring(0, padLen) : str;
            return str;
        },

        // 명칭검색 위치이동
        movePoint: function (data) {
            var title = data.title || "-";
            data.address.bldnm = data.address.bldnm || "";
            data.address.bldnmdc = data.address.bldnmdc || "";

            var addr = data.address.parcel || "-";
            var road = data.address.road || "-";

            if (title == "-") title = (data.address.bldnm + " " + data.address.bldnmdc) != " " ? data.address.bldnm + " " + data.address.bldnmdc : "-";
            if (title == "-") title = addr || "-";
            if (title == "-") title = road || "-";

            const x = parseFloat(data.x || data.point.x);
            const y = parseFloat(data.y || data.point.y);
            const coordinate = [x, y];

            if (this.overlay) sis.map.removeOverlay(this.overlay);
            const wrap = document.createElement("div");
            wrap.id = "searchOverlayWrap";
            wrap.innerText = title;
            document.body.appendChild(wrap);

            $(wrap).prepend('<i class="fa-solid fa-location-dot"></i>');

            this.overlay = new SisOverlay(`#searchOverlayWrap`, "bottom-center", [5, -10]);
            sis.map.addOverlay(this.overlay);

            sis.setCenter(coordinate, "EPSG:4326");
            // overlay.setPosition(sisMap.view.getCenter());
            // $("#searchOverlayWrap").show();

            var coord = sis.view.getCenter();
            this.overlay.setPosition(coord);
            this.getJijukByCoord(coord);

            sis.view.setZoom(sis.view.getZoom() - 2);
        },

        // pnu로 위치이동
        movePointByPnu: function (code, jibunAddr, roadAddr) {
            const self = this;
            const lyr = sisLyr.wfs.selectLayer;
            const source = lyr.getSource();

            let pnu = "";

            $.ajax({
                url: "/getJijukByPnu.do",
                type: "post",
                async: false,
                data: {
                    pnu: code,
                },
                success: (res) => {
                    if (res) {
                        let addr = "";
                        let addrToji = "";
                        let jibun = "";

                        if (res) {
                            source.clear();
                            const wkt = res.data.geom;


                            const feature = sisLyr.createFeatureByWKT(wkt);
                            // feature.getGeometry().transform("EPSG:5186", "EPSG:5186");
                            feature.setProperties(res);
                            // source.addFeature(feature);

                            if (self.overlay) sis.map.removeOverlay(self.overlay);
                            const wrap = document.createElement("div");
                            wrap.id = "searchOverlayWrap";
                            wrap.innerText = jibunAddr;
                            document.body.appendChild(wrap);

                            $(wrap).prepend('<i class="fa-solid fa-location-dot"></i>');

                            self.overlay = new SisOverlay(`#searchOverlayWrap`, "bottom-center", [5, -10]);
                            sis.map.addOverlay(self.overlay);

                            sis.view.fit(feature.getGeometry().getExtent());
                            self.overlay.setPosition(sis.view.getCenter());
                            sis.view.setZoom(8);

                            $("#searchOverlayWrap").show();
                        } else {
                            addr = "촬영지역 정보가 없습니다.";
                        }
                    } else {
                        alert("지번정보가 존재하지 않습니다.");
                        window.location.href = "../../..";
                    }
                },
            });
        },

        // 좌표로 지적도 찾기
        getJijukByCoord: function (coord) {
            const feature = sisLyr.getPropByCoordinate(coord, "LYR0017", false);
            // console.log(feature);

            if (feature) {
                sisLyr.wfs.selectLayer.getSource().clear();
                sisLyr.wfs.selectLayer.getSource().addFeature(feature);
            }
        },
    }
})(window, jQuery)