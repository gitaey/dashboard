
var m001Pagination;

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

        if(codes.minArea > codes.maxArea) {
            alert("구획면적 최소면적이 최대면적보다 큽니다.");

            $("#maxArea").focus();
            return;
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
        var tbody = $(`#${codes.id}Modal tbody`);
        tbody.html("");

        $.each(data, (idx, item) => {
            tbody.append(`
                        <tr>
                            <td>${item.idx}</td>
                            <td>${item.mnum}</td>
                            <td>${item.sidoNm} ${item.sggNm}</td>
                            <td>${item.uname}</td>
                            <td>${item.garea}</td>
                        </tr>
                    `);
        });
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