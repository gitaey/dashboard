<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2023-06-19
  Time: 오후 6:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>

    <!-- jQuery -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/js/plugins/jQuery-ui-1.13.2/jquery-ui.min.css"
          type="text/css">
    <script src="${pageContext.request.contextPath}/js/plugins/jquery-3.6.0/jquery-3.6.0.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/plugins/jQuery-ui-1.13.2/jquery-ui.min.js"></script>

    <!-- semantic-ui -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/js/plugins/Semantic-UI-CSS-master/semantic.min.css"
          type="text/css">
    <script src="${pageContext.request.contextPath}/js/plugins/Semantic-UI-CSS-master/semantic.min.js"></script>

    <!-- font awesome -->
    <link href="${pageContext.request.contextPath}/js/plugins/fontawesome-free-6.4.0-web/css/all.min.css"
          rel="stylesheet"/>
    <script src="${pageContext.request.contextPath}/js/plugins/fontawesome-free-6.4.0-web/js/all.min.js"></script>

    <!-- sis -->
    <link href="${pageContext.request.contextPath}/css/sis/sisModal.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/sis/sisPagination.css" rel="stylesheet">
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisPagination.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/com/sisCommon.js"></script>

    <style>
        #tblLdreg tr:hover {
            cursor: pointer;
            background: #f9fafb;
        }

        table td.th {
            background: #f9fafb;
            font-weight: bold;
        }

    </style>
</head>
<body>
<div class="ui segment sisLoading" style="position: absolute;width: 100%;height: 100%;">
    <div class="ui active inverted dimmer">
        <div class="ui text loader">Loading</div>
    </div>
</div>

<div style="padding:15px;">
    <div class="ui segment">
        <h3 id="title" class="ui left floated header">필지정보</h3>
        <div class="ui clearing divider"></div>

        <table id="tblLdregProp" class="ui grey celled  table" style="text-align: center;">
            <tr>
                <td class="th" style="width:50%">필지수</td>
                <td class="th">편입면적(㎡)</td>
            </tr>
            <tr>
                <td id="totalCount">1</td>
                <td id="totalArea">1</td>
            </tr>
        </table>

        <div class="ui clearing divider"></div>

        <table id="tblLdreg" class="ui grey celled  table">
            <thead>
            <tr>
                <th>순번</th>
                <th>PNU</th>
                <th>논/밭적성도</th>
                <th>주소</th>
                <th>편입면적(㎡)</th>
                <th>지목</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>

        <div id="pagination" class="paginationWrap">
            <div class="sisPagination"></div>
        </div>

    </div>
</div>
</body>
</html>

<script>
    var mnum = "${params.mnum}";
    var sido = "${params.sido}";
    var disConWkt = "${params.wkt}";
    var page = 1;
    var pagination;
    var sisLyr = opener.sisLyr;

    $(window).on("load", () => {
        $("#title").text(`필지정보(${params.mnum})`)

        selectJijuk(mnum, sido, page);

        pagination = new SisPagination({
            id: "pagination",
            viewCount: 15,
            totalCount: 0,
            onClick: function (p) {
                selectJijuk(mnum, sido, p);
            }
        });

        pagination.setDataCount(${totalCount});
    });

    // 필지 조회
    var selectJijuk = (mnum, sido, page = 1) => {
        $.ajax({
            url: "selectJijukByMngNo.do",
            type: "post",
            data: {
                mnoNo: mnum,
                sido: sido,
                page: page,
                wkt: disConWkt,
                viewCount: 15
            },
            beforeSend: () => {
                $(`.sisLoading`).show();
            },
            success: (res) => {
                var data = res.data;
                var item = res.item;

                if (item) {
                    $("#mapJoin").text(item["mapJoin"]); // 관리번호

                    var wkt = item.geom;
                    var feature = sisLyr.createFeatureByWKT(wkt);

                    sisLyr.wfs.selectLayer.getSource().clear();
                    sisLyr.wfs.selectLayer.getSource().addFeature(feature);

                    opener.sis.view.fit(feature.getGeometry().getExtent());

                }

                if (data) {
                    if (data.length > 0) {
                        var totalCount = data[0]["totalCount"] || 0;
                        var totalArea = data[0]["totalArea"] || 0;

                        $("#totalCount").text(numberWithCommas(totalCount));
                        $("#totalArea").text(numberWithCommas(totalArea));

                        createTable(data);
                        pagination.setDataCount(totalCount);
                    }
                }
            },
            complete: () => {
                $(`.sisLoading`).hide();
            }
        });

        var createTable = (data) => {
            var tbody = $(`#tblLdreg tbody`);
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

                tbody.append(
                    "<tr id='" + item.pnu + "'>" +
                    "<td>" + item.idx + "</td>" +
                    "<td>" + item.pnu + "</td>" +
                    "<td>-</td>" +
                    "<td>" + addr + "</td>" +
                    "<td>" + numberWithCommas(item.garea) + "</td>" +
                    "<td>" + item.jimok + "</td>" +
                    "</tr>");
            });

            var tr = $(`#tblLdreg tr`);
            tr.off("click");
            tr.on("click", (evt) => {
                tr.removeClass('active');
                $(evt.target).closest("tr").addClass('active');
                var pnu = $(evt.target).closest("tr").attr("id");

                opener.getJijuk(pnu);
                opener.focus();

                var dFeature = sisLyr.createFeatureByWKT(disConWkt);
                sisLyr.wfs.selectLayer.getSource().addFeature(dFeature);
            })
        };
    };

</script>
