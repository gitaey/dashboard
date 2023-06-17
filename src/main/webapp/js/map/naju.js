
var m001Pagination, m001Pagination2;

// 구획현황 조회
var getDistrictStatus = (id) => {
    var codes = getValue(id);
    codes.id = id;

    var code = "";

    if(codes.sido == "-") {
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
        var tbody = $(`#${codes.id}Modal #ue101Wrap tbody`);
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

        var tr = $(`#${codes.id}Modal #ue101Wrap tbody tr`);
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
                    m001Pagination.setDataCount(totalCount);
                }
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

    m001Pagination2 = new SisPagination({
        id: "m001PaginationWrap2",
        viewCount: 10,
        totalCount: 0,
        onClick: function (p) {
            codes.page = p;
            selectJijuk(codes);
        }
    });

    selectJijuk(codes);
}

// 필지 조회
var selectJijuk = (codes) => {
    var createTable = (data) => {
        var tbody = $(`#${codes.id}Modal #ldregWrap tbody`);
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

        var tr = $(`#${codes.id}Modal #ldregWrap tbody tr`);
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
                    $(`#ue101Wrap`).hide();
                    $(`#ldregWrap`).show();

                    createTable(data);
                    m001Pagination2.setDataCount(totalCount);
                }
            }
        },
        complete: () => {
            $(`#${codes.id}Modal .sisLoading`).hide();
        }
    });
};

var getValue = function(id) {
    return {
        page: 1,
        sido: $(`#${id}_sido`).val(),
        sgg: $(`#${id}_sgg`).val(),
        emd: $(`#${id}_emd`).val(),
        li: $(`#${id}_li`).val(),
        uea110: $(`#${id}_uea110`).is(":checked"),
        uea120: $(`#${id}_uea120`).is(":checked"),
        minArea: $(`#minArea`).val() ? $(`#minArea`).val() : -1,
        maxArea: $(`#maxArea`).val() ? $(`#maxArea`).val() : -1,
    }
}