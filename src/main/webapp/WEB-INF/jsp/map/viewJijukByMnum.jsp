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
</head>
<body>
<div id="m001Modal" class="modalWrap" style="display: block;">
    <div class="modalTitleWrap">
        <span class="title">구획현황 검색결과</span>
        <div class="close"><i class="fa-solid fa-xmark fa-lg"></i></div>
    </div>
    <div class="modalBody">
        <div class="ui segment sisLoading">
            <div class="ui active inverted dimmer">
                <div class="ui text loader">Loading</div>
            </div>
        </div>

        <div id="m001Ue101Wrap">
            <div style="text-align: right">
                <div style="text-align: right">
                    검색결과 <span id="m001TotalCount" style="color:red; font-weight:bold;">-</span>건 /
                    총 면적 <span id="m001TotalArea" style="color:red; font-weight:bold;">-</span>ha
                </div>
            </div>

            <table class="ui celled table" style="">
                <thead>
                <tr>
                    <th>순번</th>
                    <th>진흥지역코드(mnum)</th>
                    <th>시군구</th>
                    <th>진흥구분</th>
                    <th>면적(ha)</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>

            <div id="m001PaginationWrap" class="paginationWrap">
                <div class="sisPagination"></div>
            </div>
        </div>

        <div id="m001LdregWrap" style="display: none;">
            <div style="text-align: right">
                <div style="float:left; cursor: pointer; padding-left: 1px; margin-top:-8px;">
                    <button class="ui primary button" style="padding: 3px 10px;"
                            onclick="javascript: $('#m001LdregWrap').hide(); $('#m001Ue101Wrap').show();">
                        <i class="fa-solid fa-arrow-left fa-2xl"></i>
                    </button>
                </div>
                <div style="text-align: right">
                    검색결과 <span id="m001TotalCount2" style="color:red; font-weight:bold;">-</span>건 /
                    총 면적 <span id="m001TotalArea2" style="color:red; font-weight:bold;">-</span>ha
                </div>
            </div>

            <table class="ui celled table" style="">
                <thead>
                <tr>
                    <th>순번</th>
                    <th>PNU</th>
                    <th>주소</th>
                    <%--                    <th>진흥구분</th>--%>
                    <th>면적(㎡)</th>
                    <%--                    <th>지목</th>--%>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>

            <div id="m001PaginationWrap2" class="paginationWrap">
                <div class="sisPagination"></div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
