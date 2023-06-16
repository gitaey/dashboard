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
            };

            // AJAX 주소 검색 요청
            $.ajax({
                url: "https://dapi.kakao.com/v2/local/search/keyword.json", // 카카오 명칭검색
                type: "post",
                dataType: "json",
                data: data, // 요청 변수 설정
                async: true,
                beforeSend: (xhr) => {
                    $("#jibunSearchLoading").show();
                    xhr.setRequestHeader("Authorization", "KakaoAK baf884e4526f4f1d9f15d8b93b539c7d");
                },
                success: function (data) {
                    if (data.meta.total_count > 0) {
                        const items = data.documents ? data.documents : [];
                        if (data.meta.total_count > 45) data.meta.total_count = 45;

                        $("#" + self.countID).text(data.meta.total_count);
                        self.createTable(items, data.meta.total_count);

                        self.pagination.setDataCount(data.meta.total_count);
                    } else {
                        // 카카오 검색결과가 없을때
                        // 도로명주소 찾기
                        $.ajax({
                            url: "https://www.juso.go.kr/addrlink/addrLinkApiJsonp.do", //인터넷망
                            type: "post",
                            data: {
                                currentPage: 1,
                                countPerPage: 999,
                                resultType: "json",
                                confmKey: "U01TX0FVVEgyMDIxMDgwMjE0NTIyMjExMTQ3Nzc=",
                                keyword: query,
                            },
                            async: false,
                            dataType: "jsonp",
                            crossDomain: true,
                            success: function (data) {
                                var errCode = data.results.common.errorCode;
                                var errDesc = data.results.common.errorMessage;
                                if (errCode != "0") {
                                    alert(errCode + "=" + errDesc);
                                } else {
                                    if (data != null) {
                                        const items = data.results.juso ? data.results.juso : [];
                                        if (items.length > 45) items.length = 45;

                                        $("#" + self.countID).text(items.length);
                                        self.createTable(items, items.length, true);

                                        self.pagination.setDataCount(items.length);
                                    }
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
                if(!isRoadAddr) {
                    //const addr = row.address.parcel;
                    const addr = row.address_name;

                    var str = '<div id=addrSearch' + idx + ' class="item">';
                    str += '<span class="itemTitle">' + row["place_name"] + '</span>';
                    str += '<span class="itemRoadAddr">' + addr + '</span>';
                    str += '<span class="itemAddr">' + row["road_address_name"] + '</span>';
                    str += '</div>';

                    $("#" + self.resultID).append(str);

                    $("#addrSearch" + idx).on("click", function () {
                        self.movePoint(row);
                    });
                } else {
                    var roadAddr = row.roadAddrPart1;
                    var bdNm = row.bdNm;
                    var jibunAddr = row.jibunAddr.replace(bdNm, "");
                    var pnu = row.admCd + (row.mtYn == 0 ? "1" : "2") + self.lpad(row.lnbrMnnm, 4, "0") + self.lpad(row.lnbrSlno, 4, "0");

                    var str = '<div id=addrSearch' + idx + ' class="item">';
                    str += '<span class="itemTitle">' + (bdNm ? bdNm : "-") + '</span>';
                    str += '<span class="itemRoadAddr">' + jibunAddr + '</span>';
                    str += '<span class="itemAddr">' + roadAddr + '</span>';
                    str += '</div>';

                    $("#" + self.resultID).append(str);

                    $("#addrSearch" + idx).on("click", function () {
                        self.movePointByPnu(pnu, jibunAddr, roadAddr);
                    });
                }
            })
        },

        lpad: function(str, padLen, padStr) {
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
            const x = parseFloat(data.x);
            const y = parseFloat(data.y);
            const coordinate = [x, y];

            if (this.overlay) sis.map.removeOverlay(this.overlay);
            const wrap = document.createElement("div");
            wrap.id = "searchOverlayWrap";
            wrap.innerText = data["place_name"];
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
        movePointByPnu: function(code, jibunAddr, roadAddr) {
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
            const feature = sisLyr.getPropByCoordinate(coord, "LYR0019");
            // console.log(feature);

            if (feature) {
                sisLyr.wfs.selectLayer.getSource().clear();
                sisLyr.wfs.selectLayer.getSource().addFeature(feature);
            }
        },
    }
})(window, jQuery)