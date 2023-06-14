<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);
    if (request.getProtocol().equals("HTTP/1.1"))
        response.setHeader("Cache-Control", "no-cache");
%>
<html>
<head>
    <title>3D 지도</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/map/map.css?ver=1" type="text/css">

    <!-- jQuery -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/js/plugins/jQuery-ui-1.13.2/jquery-ui.min.css" type="text/css">
    <script src="${pageContext.request.contextPath}/js/plugins/jquery-3.6.0/jquery-3.6.0.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/plugins/jQuery-ui-1.13.2/jquery-ui.min.js"></script>

    <!-- semantic-ui -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/js/plugins/Semantic-UI-CSS-master/semantic.min.css" type="text/css">
    <script src="${pageContext.request.contextPath}/js/plugins/Semantic-UI-CSS-master/semantic.min.js"></script>

    <!-- font awesome -->
    <link href="${pageContext.request.contextPath}/js/plugins/fontawesome-free-6.4.0-web/css/all.min.css" rel="stylesheet" />
    <script src="${pageContext.request.contextPath}/js/plugins/fontawesome-free-6.4.0-web/js/all.min.js"></script>

    <!-- Openlayers -->
    <link href="${pageContext.request.contextPath}/js/plugins/ol-v6.12.0/ol.css" rel="stylesheet">
    <script src="${pageContext.request.contextPath}/js/plugins/ol-v6.12.0/ol.js"></script>
    <script src="${pageContext.request.contextPath}/js/plugins/proj4/proj4.js"></script>

    <!-- Html2Canvas -->
    <script src="${pageContext.request.contextPath}/js/plugins/html2canvas/html2canvas.js"></script>

    <!-- sisMap -->
    <link href="${pageContext.request.contextPath}/css/sis/sisMeasure.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/sis/sisTree.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/sis/sisSelectbox.css" rel="stylesheet">

    <script src="${pageContext.request.contextPath}/js/sis/com/sisCommon.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisMap.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisLayer.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisTree.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisMeasure.js"></script>

    <script src="${pageContext.request.contextPath}/js/sis/com/sisSelectbox.js"></script>
    <script src="${pageContext.request.contextPath}/js/map/init.js"></script>

    <script src='https://unpkg.com/@turf/turf@6/turf.min.js'></script>

    <script>
        var PATH = "${pageContext.request.contextPath}";
    </script>

</head>
<body>
    <div id="headerWrap">
        <div id="centerWrap">
            <div id="logoWrap">
                농업진흥지역 DB구축 현황판
            </div>
        </div>
    </div>

    <div id="mapWrap">
        <div id="leftWrap">
            <div class="menuWrap">
                일반검색
            </div>

            <div class="menuWrap">
                관리번호
            </div>
        </div>
        <div id="searchWrap">
            <h3>검색</h3>

            <div class="itemGroup">
                <span class="title">행정구역</span>
                <div class="selectWrap">
                    <select id="sido" style="display: none;"></select>
                </div>

                <div class="selectWrap">
                    <select id="sgg" style="display: none;"></select>
                </div>

                <div class="selectWrap">
                    <select id="emd" style="display: none;"></select>
                </div>

                <div class="selectWrap">
                    <select id="li" style="display: none;"></select>
                </div>

                <div class="selectWrap" style="text-align: center;">
                    <div class="ui checkbox right" style="margin-right: 20px;">
                        <label>산</label>
                        <input id="san" type="checkbox" name="san">
                    </div>

                    <div class="ui input">
                        <input id="bon" class="jibun numberOnly" type="text" placeholder="본번">
                    </div>

                    -

                    <div class="ui input">
                        <input id="bu" class="jibun numberOnly" type="text" placeholder="부번">
                    </div>

                    <button id="btnMovePos" class="ui blue button">위치이동</button>
                </div>
            </div>

            <div class="itemGroup">
                <span class="title">관리번호</span>

                <div class="ui input">
                    <input id="mngNo" class="numberOnly" type="text" placeholder="관리번호" style="margin-top:5px; width: 156px;">
                </div>

                <button id="btnMngNo" class="ui blue button" style="margin: 5px 0 0 0;">검색</button>
            </div>

            <div class="itemGroup">
                <span class="title">농업진흥지역</span>

                <div class="selectWrap" style="width: 156px; display: inline-flex;">
                    <select id="ue101" style="display: none;">
                        <option value="1">진흥구역</option>
                        <option value="2">보호구역</option>
                    </select>
                </div>

                <button id="btnUe101" class="ui blue button" style="margin: 5px 0 0 0;">검색</button>
            </div>
        </div>

        <div id="mapMenuWrap">
            <div class="btn">
                <div id="baseMapWrap" class="ui blue three item menu">
                    <a id="baseMap" class="item">
                        브이월드
                    </a>
                    <a id="hybridMap" class="active item">
                        항공영상
                    </a>
                    <a id="noMap" class="item">
                        배경없음
                    </a>
                </div>
            </div>

            <div id="lyrWrap" class="btn">
                <i class="fa-solid fa-layer-group icon"></i>
                <span class="txt">레이어</span>
            </div>
        </div>

        <div id="tree"></div>

        <div id="mapControlWrap">
            <span class="split"></span>

            <div class="iconWrap" id="calDis">
                <span>거리측정</span>
                <i class="fa-solid fa-ruler-horizontal icon top"></i>
            </div>
<%--            <div class="iconWrap" id="calHeight">--%>
<%--                <span>표고측정</span>--%>
<%--                <i class="fa-solid fa-ruler-vertical icon center"></i>--%>
<%--            </div>--%>
            <div class="iconWrap" id="calArea">
                <span>면적측정</span>
                <i class="fa-solid fa-vector-square icon center"></i>
            </div>
            <div class="iconWrap" id="clearMap">
                <span>초기화</span>
                <i class="fa-solid fa-rotate-right icon bottom"></i>
            </div>
            <span class="split"></span>

            <div class="iconWrap" id="saveScreen">
                <span>화면저장</span>
                <i class="fa-solid fa-floppy-disk icon top"></i>
            </div>
            <div class="iconWrap" id="shareScreen">
                <span>화면공유</span>
                <i class="fa-solid fa-share-nodes icon bottom"></i>
            </div>
            <span class="split" style="height: 100px;"></span>

<%--            <i class="fa-solid fa-crosshairs icon"></i>--%>
            <span class="split"></span>

            <div class="iconWrap">
                <i class="fa-solid fa-plus icon top" id="zoomIn"></i>
            </div>
            <div class="iconWrap">
                <i class="fa-solid fa-minus icon bottom" id="zoomOut"></i>
            </div>
            <span class="split"></span>

        </div>
        <div id="map" class=""></div>
        <div id="centerPos"></div>
    </div>

</body>
</html>

<script>
    var PATH = "${pageContext.request.contextPath}";
</script>