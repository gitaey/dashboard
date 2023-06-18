var m001Pagination, m001Pagination2;
var m002Pagination, m002Pagination2;
var m003Pagination;

// 구획현황 조회
var getDistrictStatus = (id) => {
    var codes = getValue();
    codes.id = id;

    var code = "";

    if(codes.sido == "-") {
        $(`#${id}Modal`).hide();
        alert("행정구역을 선택해 주세요");

        return ;
    } else {
        code = codes.sido;

        if(codes.sgg != "-") code = codes.sgg;
        if(codes.emd != "-") code = codes.emd;
        if(codes.li != "-") code = codes.li;

        codes.code = code;

        if(codes.minArea) {
            if(codes.maxArea > -1) {
                if (codes.minArea > codes.maxArea) {
                    alert("구획면적 최소면적이 최대면적보다 큽니다.");

                    $("#maxArea").focus();
                    return;
                }
            }
        }

        m001Pagination = new SisPagination({
            id: "m001PaginationWrap",
            viewCount: 10,
            totalCount: 0,
            onClick: function (p) {
                codes.page = p;
                selectUe101(codes);
            }
        });

        selectUe101(codes);
    }
}

var selectUe101 = (codes, page = 1) => {
    var createTable = (data) => {
        var tbody = $(`#${codes.id}Modal #${codes.id}Ue101Wrap tbody`);
        tbody.html("");

        $.each(data, (idx, item) => {
            item.sidoNm = item.sidoNm || "";
            item.sggNm = item.sggNm || "";

            var addr = item.sidoNm + " " + item.sggNm;
            if(addr.trim() == "") addr = "-";

            tbody.append(`
                        <tr id="${item.mnum}">
                            <td>${item.idx}</td>
                            <td>${item.mnum}</td>
                            <td>${addr}</td>
                            <td>${item.uname}</td>
                            <td>${item.garea || "-"}</td> 
                        </tr>
                    `);
        });

        var tr = $(`#${codes.id}Modal #${codes.id}Ue101Wrap tbody tr`);
        tr.off("click");
        tr.on("click", (evt) => {
            getJijukByMnum(evt, codes)
        })
    };

    $.ajax({
        url: "selectUe101.do",
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

                    $(`#${codes.id}TotalCount`).text(numberWithCommas(totalCount));
                    $(`#${codes.id}TotalArea`).text(numberWithCommas(totalArea));
                    $(`#${codes.id}Modal`).show();

                    createTable(data);

                    if(codes.id == "m001") m001Pagination.setDataCount(totalCount);
                    if(codes.id == "m002") m002Pagination.setDataCount(totalCount);
                    if(codes.id == "m003") m003Pagination.setDataCount(totalCount);
                }
            }
        },
        complete: () => {
            $(`#${codes.id}Modal .sisLoading`).hide();
        }
    });
}

// 관리번호 조회
var getMngNo = (id) => {
    var codes = getValue();
    codes.id = id;

    var code = "";

    if(codes.sido == "-") {
        $(`#${id}Modal`).hide();
        alert("행정구역을 선택해 주세요");

        return ;
    } else {
        code = codes.sido;

        if(codes.sgg != "-") code = codes.sgg;
        if(codes.emd != "-") code = codes.emd;
        if(codes.li != "-") code = codes.li;

        codes.code = code;

        if(codes.minArea) {
            if(codes.maxArea > -1) {
                if (codes.minArea > codes.maxArea) {
                    alert("구획면적 최소면적이 최대면적보다 큽니다.");

                    $("#maxArea").focus();
                    return;
                }
            }
        }

        m002Pagination = new SisPagination({
            id: "m002PaginationWrap",
            viewCount: 10,
            totalCount: 0,
            onClick: function (p) {
                codes.page = p;
                selectUe101(codes);
            }
        });

        selectUe101(codes);
    }
}

// 일반현황 조회
var getStatistics = (id) => {
    var codes = getValue();
    codes.id = id;

    var code = "-";

    code = codes.sido;

    if (codes.sgg != "-") code = codes.sgg;
    if (codes.emd != "-") code = codes.emd;
    if (codes.li != "-") code = codes.li;

    codes.code = code;

    if (codes.minArea) {
        if (codes.maxArea > -1) {
            if (codes.minArea > codes.maxArea) {
                alert("구획면적 최소면적이 최대면적보다 큽니다.");

                $("#maxArea").focus();
                return;
            }
        }
    }

    $.ajax({
        url: "/selectStatistics.do",
        type: "post",
        data: codes,
        beforeSend: () => {
            $(`#${codes.id}Modal .sisLoading`).show();
        },
        success: (res) => {
            console.log(res);

            var data = res.data;

            if(data) {
                var gData = _.chain(data)
                    .groupBy("addr").value();

                var tbody = $(`#${codes.id}Modal #${codes.id}Ue101Wrap tbody`);
                tbody.html("");

                var str = ``;

                $.each(gData, (key, v) => {
                    str = "";

                    if(v.length == 2) {
                        $.each(v, (idx, item) => {
                            str += `<tr>`;

                            if (idx == 0) {
                                str += `<td rowspan="3">${key}</td>
                                        <td>${item.uname}</td>
                                        <td>${item.wideAreaCnt}</td>
                                        <td>${item.wideAreaSum}</td>  
                                        <td>전</td> 
                                        <td>답</td>
                                        <td>과</td>`;
                            }
                            else {
                                str += `<td>${item.uname}</td>
                                        <td>${item.wideAreaCnt}</td>
                                        <td>${item.wideAreaSum}</td>  
                                        <td>전</td> 
                                        <td>답</td>
                                        <td>과</td>`;
                            }

                            str += `</tr>`;
                        });
                        str += `<tr>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>`
                    }
                    else {
                        $.each(v, (idx, item) => {
                            str += `<tr>`;

                            if (idx == 0) {
                                str += `<td rowspan="3">${key}</td>
                                        <td>${item.uname}</td>
                                        <td>${item.wideAreaCnt}</td>
                                        <td>${item.wideAreaSum}</td>  
                                        <td>전</td> 
                                        <td>답</td>
                                        <td>과</td>`;
                            }
                            else {
                                str += `<td>${item.uname}</td>
                                        <td>${item.wideAreaCnt}</td>
                                        <td>${item.wideAreaSum}</td>  
                                        <td>전</td> 
                                        <td>답</td>
                                        <td>과</td>`;
                            }

                            str += `</tr>`;
                        });
                    }

                    tbody.append(str);
                });
            }

        },
        complete: () => {
            $(`#${codes.id}Modal .sisLoading`).hide();
        }
    });
}

// MNUM으로 필지 가져오기
var getJijukByMnum = (evt, codes) => {
    var mnum = $(evt.target).closest("tr").attr("id");
    codes.mnum = mnum;

    if(codes.id == "m001") {
        m001Pagination2 = new SisPagination({
            id: "m001PaginationWrap2",
            viewCount: 10,
            totalCount: 0,
            onClick: function (p) {
                codes.page = p;
                selectJijuk(codes);
            }
        });
    }
    else if(codes.id == "m002") {
        m002Pagination2 = new SisPagination({
            id: "m002PaginationWrap2",
            viewCount: 10,
            totalCount: 0,
            onClick: function (p) {
                codes.page = p;
                selectJijuk(codes);
            }
        });
    }

    selectJijuk(codes);
}

// 필지 조회
var selectJijuk = (codes) => {
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
                            <td>${item.garea || "-"}</td> 
                        </tr>
                    `);
        });

        var tr = $(`#${codes.id}Modal #${codes.id}LdregWrap tbody tr`);
        tr.off("click");
        tr.on("click", (evt) => {
            var pnu = $(evt.target).closest("tr").attr("id");
            getJijuk(pnu);
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
    return {
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
}