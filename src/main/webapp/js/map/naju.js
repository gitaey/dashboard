var m001Pagination, m001Pagination2;
var m002Pagination, m002Pagination2;
var m003Pagination;
var m004Pagination;
var m005Pagination;

var arrPop = [];

// 구획현황 조회
var getDistrictStatus = (id) => {
    var formData = new FormData($("#frm")[0]);
    formData.set("id", id);
    formData.set("page", 1);

    formData = check(formData);

    if (formData) {
        m001Pagination = new SisPagination({
            id: "m001PaginationWrap",
            viewCount: 10,
            totalCount: 0,
            onClick: function (p) {
                formData.set("page", p);
                selectUe101(formData);
            }
        });

        selectUe101(formData);
    }
}

var selectUe101 = (formData) => {
    var id = formData.get("id");
    var popIdx = 0;

    var createTable = (data, tData) => {
        var tbody = $(`#${id}Modal #${id}Ue101Wrap tbody`);
        tbody.html("");

        $.each(data, (idx, item) => {
            if (id == "m001")
                tbody.append(`
                            <tr id="${item.mnum}">
                                <td>${item.idx}</td>
                                <td>${item.mnum}</td>
                                <td>${item.jusoName}</td>
                                <td>${item.uname}</td>
                                <td>${item.area}</td>
                                <td>${item.swgYn}</td> 
                                <td>${item.njPrdctn || '-'}</td> 
                                <td>${item.etcPrdctn || '-'}</td>  
                            </tr>
                        `);
        });

        var tr = $(`#${id}Modal #${id}Ue101Wrap tbody tr`);
        tr.off("click");
        tr.on("click", (evt) => {
            tr.removeClass("active");
            $(evt.target).closest("tr").addClass("active");

            var mnum = $(evt.target).closest("tr").attr("id");
            var popId = "m001Pop" + popIdx;

            var nWidth = "900";
            var nHeight = "875";

            var curX = window.screenLeft;
            var curY = window.screenTop;
            var curWidth = document.body.clientWidth;
            var curHeight = document.body.clientHeight;

            var nLeft = curX + (curWidth / 2) - (nWidth / 2);
            var nTop = curY + (curHeight / 2) - (nHeight / 2);

            var pop = window.open("", popId, "toolbar=no, menubar=no, location=no, status=no,scrollbars=no, resizable=no," +
                "left=" + nLeft + ",top=" + nTop + ",width=" + nWidth + ",height=" + nHeight);

            var frm = $("#frm")[0];
            frm.mnum.value = mnum;
            frm.page.value = 1;
            frm.action = "/viewUe101Ldreg.do";
            frm.target = popId;
            frm.submit();

            arrPop.push(pop)

            $(window).off("beforeunload");
            $(window).on("beforeunload", () => {
                $.each(arrPop, (idx, item) => {
                    item.close();
                });

                arrPop = [];
            });

            popIdx++;
        })
    };

    $.ajax({
        url: "selectUe101.do",
        type: "post",
        data: Object.fromEntries(formData),
        beforeSend: () => {
            $(`#${id}Modal .sisLoading`).show();
        },
        success: (res) => {
            var data = res.data;
            var tData = res.total;

            if (data) {
                if (data.length > 0) {
                    var totalCount = tData["totalCount"];
                    var totalArea = tData["totalArea"];

                    $(`#${id}TotalCount`).text(numberWithCommas(totalCount));
                    $(`#${id}TotalArea`).text(numberWithCommas(totalArea));
                    $(`#${id}Modal`).show();

                    createTable(data, tData);

                    if (id == "m001") m001Pagination.setDataCount(totalCount);
                    if (id == "m002") m002Pagination.setDataCount(totalCount);
                    if (id == "m003") m003Pagination.setDataCount(totalCount);
                }
            }
        },
        complete: () => {
            $(`#${id}Modal .sisLoading`).hide();
        }
    });
}

var selectMngNo = (formData) => {
    var id = formData.get("id");
    var popIdx = 0;

    var createTable = (data, tData) => {
        var tbody = $(`#${id}Modal #${id}Ue101Wrap tbody`);
        tbody.html("");

        $.each(data, (idx, item) => {
            tbody.append(`
                        <tr id="${item.mnum}">
                            <td>${item.idx}</td>
                            <td>${item.mnum}</td>
                            <td>${item.jusoName}</td>
                            <td>${item.uname}</td>
                            <td>${item.area}</td>
                            <td>${item.swgYn}</td> 
                            <td>${item.njPrdctn || '-'}</td> 
                            <td>${item.etcPrdctn || '-'}</td>  
                            <td>${item.rtPrdctn || '-'}</td>  
                        </tr>
                    `);
        });

        var tr = $(`#${id}Modal #${id}Ue101Wrap tbody tr`);
        tr.off("click");
        tr.on("click", (evt) => {
            tr.removeClass("active");
            $(evt.target).closest("tr").addClass("active");

            var mnum = $(evt.target).closest("tr").attr("id");
            var popId = "m001Pop" + popIdx;

            var nWidth = "900";
            var nHeight = "875";

            var curX = window.screenLeft;
            var curY = window.screenTop;
            var curWidth = document.body.clientWidth;
            var curHeight = document.body.clientHeight;

            var nLeft = curX + (curWidth / 2) - (nWidth / 2);
            var nTop = curY + (curHeight / 2) - (nHeight / 2);

            var pop = window.open("", popId, "toolbar=no, menubar=no, location=no, status=no,scrollbars=no, resizable=no," +
                "left=" + nLeft + ",top=" + nTop + ",width=" + nWidth + ",height=" + nHeight);

            var frm = $("#frm")[0];
            frm.mnum.value = mnum;
            frm.page.value = 1;
            frm.code.value = formData.get("code");
            frm.action = "/viewUe101Ldreg.do";
            frm.target = popId;
            frm.submit();

            arrPop.push(pop)

            $(window).off("beforeunload");
            $(window).on("beforeunload", () => {
                $.each(arrPop, (idx, item) => {
                    item.close();
                });

                arrPop = [];
            });

            popIdx++;
        })
    };

    $.ajax({
        url: "selectMngCode.do",
        type: "post",
        data: Object.fromEntries(formData),
        beforeSend: () => {
            $(`#${id}Modal .sisLoading`).show();
        },
        success: (res) => {
            var data = res.data;
            var tData = res.total;

            if (data) {
                if (data.length > 0) {
                    var totalCount = tData["totalCount"];
                    var totalArea = tData["totalArea"];

                    $(`#${id}TotalCount`).text(numberWithCommas(totalCount));
                    $(`#${id}TotalArea`).text(numberWithCommas(totalArea));
                    $(`#${id}Modal`).show();

                    createTable(data, tData);

                    if (id == "m001") m001Pagination.setDataCount(totalCount);
                    if (id == "m002") m002Pagination.setDataCount(totalCount);
                    if (id == "m003") m003Pagination.setDataCount(totalCount);
                }
            }
        },
        complete: () => {
            $(`#${id}Modal .sisLoading`).hide();
        }
    });
}

// 관리번호 조회
var getMngNo = (id) => {
    var formData = new FormData($("#frm")[0]);
    formData.set("id", id);
    formData.set("page", 1);

    formData = check(formData);

    if (formData) {
        m002Pagination = new SisPagination({
            id: "m002PaginationWrap",
            viewCount: 10,
            totalCount: 0,
            onClick: function (p) {
                formData.set("page", p);
                selectMngNo(formData);
            }
        });

        selectMngNo(formData);
    }
}

// 일반현황 조회
var getStatistics = (id) => {
    var formData = new FormData($("#frm")[0]);
    formData.set("id", id);
    formData.set("page", 1);

    formData = check(formData);

    var popIdx = 0;

    if (formData) {
        var popId = "m002Pop" + popIdx;

        var nWidth = "1024";
        var nHeight = "875";

        var curX = window.screenLeft;
        var curY = window.screenTop;
        var curWidth = document.body.clientWidth;
        var curHeight = document.body.clientHeight;

        var nLeft = curX + (curWidth / 2) - (nWidth / 2);
        var nTop = curY + (curHeight / 2) - (nHeight / 2);

        var pop = window.open("", popId, "toolbar=no, menubar=no, location=no, status=no,scrollbars=no, resizable=no," +
            "left=" + nLeft + ",top=" + nTop + ",width=" + nWidth + ",height=" + nHeight);

        var frm = $("#frm")[0];
        frm.page.value = 1;
        frm.code.value = formData.get("code");
        frm.action = "/viewStatistics.do";
        frm.target = popId;
        frm.submit();

        arrPop.push(pop)

        $(window).off("beforeunload");
        $(window).on("beforeunload", () => {
            $.each(arrPop, (idx, item) => {
                item.close();
            });

            arrPop = [];
        });

        popIdx++;


    }
}

// 단절 조회
var getDiscon = (id) => {
    var formData = new FormData($("#frm")[0]);
    formData.set("id", id);
    formData.set("page", 1);

    formData = check(formData);

    if (formData) {
        m004Pagination = new SisPagination({
            id: "m004PaginationWrap",
            viewCount: 10,
            totalCount: 0,
            onClick: function (p) {
                formData.set("page", p);
                selectDiscon(formData);
            }
        });

        selectDiscon(formData);
    }
}

var selectDiscon = (formData) => {
    var id = formData.get("id");
    var popIdx = 0;

    var createTable = (data, tData) => {
        var tbody = $(`#${id}Modal #${id}Ue101Wrap tbody`);
        tbody.html("");

        $.each(data, (idx, item) => {
            tbody.append(`
                        <tr id="${item.mnum}-${item.totGarea}">
                            <td>${item.rnum}</td>
                            <td>${item.mnum}</td>
                            <td>${item.colAdmSe}</td>
                            <td>${item.ucode}</td>
                            <td>${numberWithCommas(item.totGarea.toFixed(2))}</td>
                        </tr>
                    `);
        });

        var tr = $(`#${id}Modal #${id}Ue101Wrap tbody tr`);
        tr.off("click");
        tr.on("click", (evt) => {
            tr.removeClass("active");
            $(evt.target).closest("tr").addClass("active");

            var mnum = $(evt.target).closest("tr").attr("id");
            var wkt;

            $.ajax({
                url: "selectDisconGeom.do",
                type: "post",
                data: {mnum},
                async: false,
                beforeSend: () => {
                    $(`#${id}Modal .sisLoading`).show();
                },
                success: (res) => {
                    var data = res.data;

                    if (data) {
                        wkt = data.geom;
                        var feature = sisLyr.createFeatureByWKT(wkt);

                        sisLyr.wfs.selectLayer.getSource().clear();
                        sisLyr.wfs.selectLayer.getSource().addFeature(feature);

                        sis.view.fit(feature.getGeometry().getExtent());

                        sis.view.setZoom(sis.view.getZoom() - 2);
                    }
                },
                complete: () => {
                    $(`#${id}Modal .sisLoading`).hide();
                }
            });

            var popId = "m004Pop" + popIdx;

            var nWidth = "900";
            var nHeight = "875";

            var curX = window.screenLeft;
            var curY = window.screenTop;
            var curWidth = document.body.clientWidth;
            var curHeight = document.body.clientHeight;

            var nLeft = curX + (curWidth / 2) - (nWidth / 2);
            var nTop = curY + (curHeight / 2) - (nHeight / 2);

            var pop = window.open("", popId, "toolbar=no, menubar=no, location=no, status=no,scrollbars=no, resizable=no," +
                "left=" + nLeft + ",top=" + nTop + ",width=" + nWidth + ",height=" + nHeight);

            var frm = $("#frm")[0];
            frm.mnum.value = mnum.split("-")[0];
            frm.wkt.value = wkt
            frm.page.value = 1;
            frm.action = "/viewDiscon.do";
            frm.target = popId;
            frm.submit();

            arrPop.push(pop)

            $(window).off("beforeunload");
            $(window).on("beforeunload", () => {
                $.each(arrPop, (idx, item) => {
                    item.close();
                });

                arrPop = [];
            });

            popIdx++;
        })
    };

    $.ajax({
        url: "/selectDiscon.do",
        type: "post",
        data: Object.fromEntries(formData),
        beforeSend: () => {
            $(`#${id}Modal .sisLoading`).show();
        },
        success: (res) => {
            var data = res.data;
            var tData = res.total;

            if (data) {
                var totalCount = tData["totalCount"];
                var totalArea = tData["totalArea"];

                $(`#${id}TotalCount`).text(numberWithCommas(totalCount));
                $(`#${id}TotalArea`).text(numberWithCommas(totalArea));
                $(`#${id}Modal`).show();

                createTable(data, tData);

                m004Pagination.setDataCount(totalCount);
            }
        },
        complete: () => {
            $(`#${id}Modal .sisLoading`).hide();
        }
    });
}

// 우량농지 조회
var getFarmland = (id) => {
    var formData = new FormData($("#frm")[0]);
    formData.set("id", id);
    formData.set("page", 1);

    formData = check(formData);

    if (formData) {
        m005Pagination = new SisPagination({
            id: "m005PaginationWrap",
            viewCount: 10,
            totalCount: 0,
            onClick: function (p) {
                formData.set("page", p);
                selectFarmland(formData);
            }
        });

        selectFarmland(formData);
    }
}

var selectFarmland = (formData) => {
    var id = formData.get("id");
    var popIdx = 0;

    var createTable = (data) => {
        var tbody = $(`#${id}Modal #${id}Ue101Wrap tbody`);
        tbody.html("");

        $.each(data, (idx, item) => {
            tbody.append(`
                        <tr id="${item.mngNo}" geom="${item.geom}">
                            <td>${item.idx}</td>
                            <td>${item.mngNm}</td>
                            <td>${numberWithCommas(item.area)}</td>  
                        </tr>
                    `);
        });

        var tr = $(`#${id}Modal #${id}Ue101Wrap tbody tr`);
        tr.off("click");
        tr.on("click", (evt) => {
            tr.removeClass("active");
            $(evt.target).closest("tr").addClass("active");

            var mnum = $(evt.target).closest("tr").attr("id");
            var wkt = $(evt.target).closest("tr").attr("geom");

            if (wkt) {
                var feature = sisLyr.createFeatureByWKT(wkt);

                sisLyr.wfs.selectLayer.getSource().clear();
                sisLyr.wfs.selectLayer.getSource().addFeature(feature);

                sis.view.fit(feature.getGeometry().getExtent());

                sis.view.setZoom(sis.view.getZoom() - 2);
            }

            var popId = "m001Pop" + popIdx;

            var nWidth = "900";
            var nHeight = "875";

            var curX = window.screenLeft;
            var curY = window.screenTop;
            var curWidth = document.body.clientWidth;
            var curHeight = document.body.clientHeight;

            var nLeft = curX + (curWidth / 2) - (nWidth / 2);
            var nTop = curY + (curHeight / 2) - (nHeight / 2);

            var pop = window.open("", popId, "toolbar=no, menubar=no, location=no, status=no,scrollbars=no, resizable=no," +
                "left=" + nLeft + ",top=" + nTop + ",width=" + nWidth + ",height=" + nHeight);

            var frm = $("#frm")[0];
            frm.mnum.value = mnum;
            frm.wkt.value = wkt;
            frm.page.value = 1;
            frm.action = "/viewFarmland.do";
            frm.target = popId;
            frm.submit();

            arrPop.push(pop)

            $(window).off("beforeunload");
            $(window).on("beforeunload", () => {
                $.each(arrPop, (idx, item) => {
                    item.close();
                });

                arrPop = [];
            });

            popIdx++;
        })
    };

    $.ajax({
        url: "selectFarmland.do",
        type: "post",
        data: Object.fromEntries(formData),
        beforeSend: () => {
            $(`#${id}Modal .sisLoading`).show();
        },
        success: (res) => {
            var data = res.data;
            var tData = res.total;

            if (data) {
                if (data.length > 0) {
                    var totalCount = data[0]["totalCount"];
                    var totalArea = data[0]["totalArea"];

                    $(`#${id}TotalCount`).text(numberWithCommas(totalCount));
                    $(`#${id}TotalArea`).text(numberWithCommas(totalArea));
                    $(`#${id}Modal`).show();

                    createTable(data);

                    m005Pagination.setDataCount(totalCount);
                }
            }
        },
        complete: () => {
            $(`#${id}Modal .sisLoading`).hide();
        }
    });
}

// 필지 조회 (팝업창에서 사용함)
var selectJijuk = (codes, page = 1) => {
    codes.page = page;

    var createTable = (data) => {
        var tbody = $(`#${codes.id}Modal #${codes.id}LdregWrap tbody`);
        tbody.html("");

        $.each(data, (idx, item) => {
            item.sidoNm = item.sidoNm || "";
            item.sggNm = item.sggNm || "";
            item.umdNm = item.umdNm || "";
            item.riNm = item.riNm || "";

            var bon = parseInt(item.pnu.substr(11, 4));
            var bu = parseInt(item.pnu.substr(15, 4));

            var addr = item.sidoNm + " " + item.sggNm + " " + item.umdNm + " " + item.riNm + " " + bon + "-" + bu;

            if (addr.trim() == "") addr = "-";

            tbody.append(`
                        <tr id="${item.pnu}">
                            <td>${item.idx}</td>
                            <td>${item.pnu}</td>
                            <td>${addr}</td>
                            <td>${item.garea}</td> 
                        </tr>
                    `);
        });

        var tr = $(`#${codes.id}Modal #${codes.id}LdregWrap tbody tr`);
        tr.off("click");
        tr.on("click", (evt) => {
            var pnu = $(evt.target).closest("tr").attr("id");
            getJijuk(pnu, page);
        })
    };

    $.ajax({
        url: "selectJijukByMnum.do",
        type: "post",
        data: codes,
        beforeSend: () => {
            $(`#${codes.id}Modal .sisLoading`).show();
        },
        success: (res) => {
            var data = res.data;

            if (data) {
                if (data.length > 0) {
                    var totalCount = data[0]["totalCount"];
                    var totalArea = data[0]["totalArea"];

                    $(`#${codes.id}TotalCount2`).text(numberWithCommas(totalCount));
                    $(`#${codes.id}TotalArea2`).text(numberWithCommas(totalArea));
                    $(`#${codes.id}Ue101Wrap`).hide();
                    $(`#${codes.id}LdregWrap`).show();

                    createTable(data);
                    if (codes.id == "m001") m001Pagination2.setDataCount(totalCount);
                    if (codes.id == "m002") m002Pagination2.setDataCount(totalCount);
                }
            }
        },
        complete: () => {
            $(`#${codes.id}Modal .sisLoading`).hide();
        }
    });
};

var getValue = function () {
    var data = {
        page: 1,
        sido: $(`#left_sido`).val(),
        sgg: $(`#left_sgg`).val(),
        emd: $(`#left_emd`).val(),
        li: $(`#left_li`).val(),
        uea110: $(`#uea110`).is(":checked"),
        uea120: $(`#uea120`).is(":checked"),
        minArea: $(`#minArea`).val() ? $(`#minArea`).val() : -1,
        maxArea: $(`#maxArea`).val() ? $(`#maxArea`).val() : -1,
    }

    return data
}

var check = function (formData) {
    var code = "";
    var id = formData.get("id");

    if (formData.get("sido") == "-") {
        $(`#${id}Modal`).hide();
        alert("행정구역을 선택해 주세요");

        return false;
    } else {
        code = formData.get("sido");

        if (formData.get("sgg") != "-") code = formData.get("sgg");
        if (formData.get("emd") != "-") code = formData.get("emd");
        // if(formData.get("li") != "-") code = formData.get("li");

        formData.set("code", code);

        var minArea = formData.get("minArea");
        var maxArea = formData.get("maxArea");

        if (minArea) {
            if (maxArea > -1 && maxArea != "") {
                if (minArea > maxArea) {
                    alert("구획면적 최소면적이 최대면적보다 큽니다.");

                    $("#maxArea").focus();
                    return false;
                }
            }
        }

        var bufferDis = formData.get("bufferDis");

        if (!bufferDis) formData.set("bufferDis", 300);
    }

    return formData;
}