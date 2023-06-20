var m001Pagination, m001Pagination2;
var m002Pagination, m002Pagination2;
var m003Pagination;

var arrPop = [];

// 구획현황 조회
var getDistrictStatus = (id) => {
    var formData = new FormData($("#frm")[0]);
    formData.append("id", id);
    formData.append("page", 1);

    if(check(formData)) {
        m001Pagination = new SisPagination({
            id: "m001PaginationWrap",
            viewCount: 10,
            totalCount: 0,
            onClick: function (p) {
                formData.append("page", p);
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
            item.sidoNm = item.sidoNm || "";
            item.sggNm = item.sggNm || "";

            var addr = item.sidoNm + " " + item.sggNm;
            if(addr.trim() == "") addr = "-";

            if(id == "m001")
                tbody.append(`
                            <tr id="${item.mnum}">
                                <td>${item.idx}</td>
                                <td>${item.mnum}</td>
                                <td>${addr}</td>
                                <td>${item.uname}</td>
                                <td>${item.garea}</td>
                                <td>-</td> 
                                <td>-</td> 
                                <td>-</td>  
                            </tr>
                        `);
            else
                tbody.append(`
                            <tr id="${item.mnum}">
                                <td>${item.idx}</td>
                                <td>${item.mnum}</td>
                                <td>${addr}</td>
                                <td>${item.uname}</td>
                                <td>${item.garea}</td>
                                <td>-</td> 
                                <td>-</td> 
                                <td>-</td>  
                                <td>-</td> 
                                <td>-</td>  
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

            if(data) {
                if(data.length > 0) {
                    var totalCount = tData["totalCount"];
                    var totalArea = tData["totalArea"];

                    $(`#${id}TotalCount`).text(numberWithCommas(totalCount));
                    $(`#${id}TotalArea`).text(numberWithCommas(totalArea));
                    $(`#${id}Modal`).show();

                    createTable(data, tData);

                    if(id == "m001") m001Pagination.setDataCount(totalCount);
                    if(id == "m002") m002Pagination.setDataCount(totalCount);
                    if(id == "m003") m003Pagination.setDataCount(totalCount);
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
    formData.append("id", id);
    formData.append("page", 1);

    if(check(formData)) {
        m002Pagination = new SisPagination({
            id: "m002PaginationWrap",
            viewCount: 10,
            totalCount: 0,
            onClick: function (p) {
                formData.append("page", p);
                selectUe101(formData);
            }
        });

        selectUe101(formData);
    }
}

// 일반현황 조회
var getStatistics = (id) => {
    var formData = new FormData($("#frm")[0]);
    formData.append("id", id);
    formData.append("page", 1);

    var popIdx = 0;

    if(check(formData)) {
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

            if(addr.trim() == "") addr = "-";

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

            if(data) {
                if(data.length > 0) {
                    var totalCount = data[0]["totalCount"];
                    var totalArea = data[0]["totalArea"];

                    $(`#${codes.id}TotalCount2`).text(numberWithCommas(totalCount));
                    $(`#${codes.id}TotalArea2`).text(numberWithCommas(totalArea));
                    $(`#${codes.id}Ue101Wrap`).hide();
                    $(`#${codes.id}LdregWrap`).show();

                    createTable(data);
                    if(codes.id == "m001") m001Pagination2.setDataCount(totalCount);
                    if(codes.id == "m002") m002Pagination2.setDataCount(totalCount);
                }
            }
        },
        complete: () => {
            $(`#${codes.id}Modal .sisLoading`).hide();
        }
    });
};

var getValue = function() {
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

var check = function(formData) {
    var code = "";

    if(formData.get("sido") == "-") {
        $(`#${id}Modal`).hide();
        alert("행정구역을 선택해 주세요");

        return  false;
    } else {
        code = formData.get("sido");

        if(formData.get("sgg") != "-") code = formData.get("sgg");
        if(formData.get("emd") != "-") code = formData.get("emd");
        if(formData.get("li") != "-") code = formData.get("li");

        formData.append("code", code);

        var minArea = formData.get("minArea");
        var maxArea = formData.get("maxArea");

        if(minArea) {
            if(maxArea > -1) {
                if (minArea > maxArea) {
                    alert("구획면적 최소면적이 최대면적보다 큽니다.");

                    $("#maxArea").focus();
                    return false;
                }
            }
        }
    }

    return true;
}