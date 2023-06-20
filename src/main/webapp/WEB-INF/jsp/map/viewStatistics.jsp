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

    <!-- lodash -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>

    <!-- sis -->
    <link href="${pageContext.request.contextPath}/css/sis/sisModal.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/sis/sisPagination.css" rel="stylesheet">
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisPagination.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/com/sisCommon.js"></script>

    <style>
        table td.th {
            background: #f9fafb;
            font-weight: bold;
        }

        .borderLeft {
            border-left: 1px solid rgba(34,36,38,.1) !important;
        }

        .borderBottom {
            border-bottom: 1px solid rgba(34,36,38,.1) !important;
        }

        thead tr:last-child td {
            border-bottom: 1px solid rgba(34,36,38,.1) !important;
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
            <h3 class="ui left floated header">일반현황</h3>

            <button id="m001" class="btnMenu ui primary button" style="float: right;margin-top:-6px;">
                엑셀저장
            </button>

            <div class="ui clearing divider"></div>

            <table id="tblUe101" class="ui grey celled table" style="text-align: center;">
                <thead>
                <tr>
                    <td rowspan="3" class="th borderBottom">시도</td>
                    <td rowspan="3" class="th borderBottom">구분</td>
                    <td rowspan="2" colspan="2" class="th">진흥지역</td>
                    <td colspan="6" class="th">농지현황</td>
                </tr>
                <tr>
                    <td colspan="2" class="th borderLeft">전</td>
                    <td colspan="2" class="th">답</td>
                    <td colspan="2" class="th">과</td>
                </tr>
                <tr>
                    <td class="th borderLeft">권역수(개수)</td>
                    <td class="th">면적(ha)</td>
                    <td class="th">필지수</td>
                    <td class="th">면적</td>
                    <td class="th">필지수</td>
                    <td class="th">면적</td>
                    <td class="th">필지수</td>
                    <td class="th">면적</td>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</body>
</html>

<script>
    var mnum = "${params.mnum}";
    var sido = "${params.sido}";
    var page = 1;
    var pagination;

    $(window).on("load", () => {
        $.ajax({
            url: "/selectStatistics.do",
            type: "post",
            data: {},
            beforeSend: () => {
                $(`.sisLoading`).show();
            },
            success: (res) => {
                var data = res.data;

                if(data) {
                    var gData = _.chain(data)
                        .groupBy("addr").value();

                    var tbody = $(`tbody`);
                    tbody.html("");

                    var str = ``;

                    $.each(gData, (key, v) => {
                        str = "";

                        if(v.length == 2) {
                            $.each(v, (idx, item) => {
                                str += `<tr>`;

                                if (idx == 0) {
                                    str += `<td rowspan="3">` + key + `</td>
                                        <td style="text-align: center;">` + item.uname + `</td>
                                        <td>` + numberWithCommas(item.wideAreaCnt) + `</td>
                                        <td>` + numberWithCommas(item.wideAreaSum) + `</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>`;
                                }
                                else {
                                    str += `<td class='borderLeft'>` + item.uname + `</td>
                                        <td>` + numberWithCommas(item.wideAreaCnt) + `</td>
                                        <td>` + numberWithCommas(item.wideAreaSum) + `</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>`;
                                }

                                str += `</tr>`;
                            });
                            str += `<tr>
                                    <td class='borderLeft'>-</td>
                                    <td>-</td>
                                    <td>-</td>
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
                                    str += `<td rowspan="3">` + key + `</td>
                                        <td style="text-align: center;">` + item.uname + `</td>
                                        <td>` + numberWithCommas(item.wideAreaCnt) + `</td>
                                        <td>` + numberWithCommas(item.wideAreaSum) + `</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>`;
                                }
                                else {
                                    str += `<td class='borderLeft'>` + item.uname + `</td>
                                        <td>` + numberWithCommas(item.wideAreaCnt) + `</td>
                                        <td>` + numberWithCommas(item.wideAreaSum) + `</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>`;
                                }

                                str += `</tr>`;
                            });
                        }

                        tbody.append(str);
                    });
                }

            },
            complete: () => {
                $(`.sisLoading`).hide();
            }
        });
    });
</script>
