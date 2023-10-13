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
    <title>농업진흥지역 DB구축 현황판</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/map/map.css?ver=1" type="text/css">

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

    <!-- Openlayers -->
    <link href="${pageContext.request.contextPath}/js/plugins/ol-v6.12.0/ol.css" rel="stylesheet">
<%--    <script src="${pageContext.request.contextPath}/js/plugins/ol-v6.12.0/ol.js"></script>--%>
    <script src="${pageContext.request.contextPath}/js/plugins/ol-v6.12.0/ol-4.6.5.js"></script>
    <script src="${pageContext.request.contextPath}/js/plugins/proj4/proj4.js"></script>

    <!-- Html2Canvas -->
    <script src="${pageContext.request.contextPath}/js/plugins/html2canvas/html2canvas.js"></script>

    <!-- lodash -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>

    <!-- sisMap -->
    <link href="${pageContext.request.contextPath}/css/sis/sisMeasure.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/sis/sisTree.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/sis/sisSelectbox.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/sis/sisModal.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/sis/sisPagination.css" rel="stylesheet">

    <script src="${pageContext.request.contextPath}/js/sis/com/sisCommon.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisMap.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisLayer.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisTree.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisOverlay.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisMeasure.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/2D/searchAddr.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/2D/sisPagination.js"></script>
    <script src="${pageContext.request.contextPath}/js/sis/com/sisSelectbox.js"></script>
    <script src="${pageContext.request.contextPath}/js/map/init.js?ver=1"></script>
    <script src="${pageContext.request.contextPath}/js/map/naju.js?ver=1"></script>

    <script src='https://unpkg.com/@turf/turf@6/turf.min.js'></script>

    <%-- 농어촌공사 OpenAPI --%>
    <script type="text/javascript" src="https://espacek.ekr.or.kr/eOpenAPI/krcgis.js?api_key=bfb9c989fbdb84c265e33a625005e07b"></script>

    <script>
        var PATH = "${pageContext.request.contextPath}";
    </script>

</head>
<body>
<%--    <div id="headerWrap">--%>
<%--        <div id="centerWrap">--%>
<%--            <div id="logoWrap">--%>
<%--                농업진흥지역 DB구축 현황판--%>
<%--            </div>--%>
<%--        </div>--%>
<%--    </div>--%>

<div id="mapWrap">
    <div id="posMoveWrap">
        <div id="searchBtnWrap" class="ui buttons">
            <button id="btnShowPlace" class="ui button">명칭</button>
            <div class="or"></div>
            <button id="btnShowJibun" class="ui primary button">지번</button>
        </div>
    </div>

    <div id="searchWrap">
        <div class="wrapToggle"></div>

        <div id="nonScrollWrap">
            <h3>농업진흥지역 DB구축 현황판</h3>

            <div id="selectMenu" class="itemGroup pri">
                <button id="m001" class="btnMenu ui primary button">
                    구획현황
                </button>
                <button id="m002" class="btnMenu ui button">
                    관리번호
                </button>
                <button id="m003" class="btnMenu ui button">
                    일반현황
                </button>
                <button id="m004" class="btnMenu ui button">
                    단절
                </button>
                <button id="m005" class="btnMenu ui button">
                    우량농지
                </button>
            </div>
        </div>


        <div id="scrollWrap">
            <form id="frm" method="post">
                <input type="hidden" name="mnum">
                <input type="hidden" name="page">
                <input type="hidden" name="code">
                <input type="hidden" name="wkt">

                <!-- ####### -->
                <!-- 구획현황 -->
                <!-- ####### -->
                <div class="itemGroup pri">
                    <span class="title">행정구역</span>
                    <div class="selectWrap">
                        <select id="left_sido" name="sido" parent="left" class="selectSido"
                                style="display: none;"></select>
                    </div>

                    <div class="selectWrap">
                        <select id="left_sgg" name="sgg" parent="left" class="selectSgg"
                                style="display: none;"></select>
                    </div>

                    <div class="selectWrap">
                        <select id="left_emd" name="emd" parent="left" class="selectEmd"
                                style="display: none;"></select>
                    </div>

                    <%--                    <div class="selectWrap">--%>
                    <%--                        <select id="left_li" name="li" parent="left" class="selectLi" style="display: none;"></select>--%>
                    <%--                    </div>--%>
                </div>

                <div class="itemGroup m003" style="display: none;">
                    <span class="title">구분</span>

                    <div class="ui form" style="padding: 10px 0 0 0px;">
                        <div class="block fields" style="display: block; margin: 0 -1em 0 0em;">
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input id="m003Type1" type="radio" name="m003Type" value="1" checked="checked"
                                           tabindex="0" class="hidden">
                                    <label>진흥지역 지목별 현황</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input id="m003Type2" type="radio" name="m003Type" value="2" tabindex="0"
                                           class="hidden">
                                    <label>진흥지역 이용현황</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input id="m003Type3" type="radio" name="m003Type" value="3" tabindex="0"
                                           class="hidden">
                                    <label>전체농지중 진흥지역 현황</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input id="m003Type4" type="radio" name="m003Type" value="4" tabindex="0"
                                           class="hidden">
                                    <label>용도지역별 진흥지역 현황</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="itemGroup">
                    <span class="title">진흥구분</span>

                    <div class="ui form" style="padding: 10px 0 0 0px;">
                        <div class="inline fields" style="display: inline-flex; margin: 0 -1em 0 .5em;">
                            <div class="field">
                                <div class="ui checkbox">
                                    <input id="uea110" type="checkbox" name="uea110" checked="checked">
                                    <label>진흥구역</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui checkbox">
                                    <input id="uea120" type="checkbox" name="uea120" checked="checked">
                                    <label>보호구역</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="itemGroup pri">
                    <span class="title">
                        구획면적(ha)
                        <div class="iconPopup m002" style="display: none;" data-html='
                            <table class="ui celled table" style="">
                                <thead>
                                <tr>
                                    <th>분류</th>
                                    <th>진흥면적</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>가급</td>
                                    <td>100ha 초과</td>
                                </tr>
                                <tr>
                                    <td>나급</td>
                                    <td>30ha 초과 100ha 이하</td>
                                </tr>
                                <tr>
                                    <td>다급</td>
                                    <td>10ha 초과 30ha 이하</td>
                                </tr>
                                <tr>
                                    <td>라급</td>
                                    <td>10ha 이하</td>
                                </tr>
                                </tbody>
                            </table>
                        '>
                            <i id="prmtRef" class="reference fa-solid fa-asterisk"
                               style="color: red; cursor: pointer;"></i>
                        </div>
                    </span>

                    <div class="ui input">
                        <input id="minArea" name="minArea" class="tm5 w106 numberOnly" type="text" placeholder="최소">
                    </div>
                    ~
                    <div class="ui input">
                        <input id="maxArea" name="maxArea" class="tm5 w106 numberOnly" type="text" placeholder="최대">
                    </div>
                </div>

                <div class="itemGroup pri m005" style="display: none;">
                    <span class="title">
                        버퍼설정(m)
                    </span>

                    <div class="ui input" style="width:100%">
                        <input id="bufferDis" name="bufferDis" class="tm5 w100p numberOnly" type="text"
                               placeholder="범위설정(기본값 300)">
                    </div>
                </div>

                <div class="itemGroup">
                    <span class="title">
                        수원공
                        <span style="color: red">※보호구역 선택시 활성화</span>
                    </span>

                    <div class="ui form" style="padding: 10px 0 0 0px;">
                        <div class="inline fields" style="display: inline-flex; margin: 0 -1em 0 .5em;">
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input id="includeWater" type="radio" name="includeWater" checked="checked">
                                    <label>포함</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input id="nonIncludeWater" type="radio" name="includeWater">
                                    <label>미포함</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="waterBufferWrap" class="ui selection dropdown disabled" style="margin-top: 10px;">
                        <input id="waterBuffer" type="hidden" name="gender">
                        <i class="dropdown icon"></i>
                        <div class="default text">반경선택</div>
                        <div class="menu">
                            <div class="item" data-value="100">100m</div>
                            <div class="item" data-value="200">200m</div>
                            <div class="item" data-value="300">300m</div>
                            <div class="item" data-value="400">400m</div>
                            <div class="item" data-value="500">500m</div>
                        </div>
                    </div>
                </div>

                <div class="itemGroup">
                    <span class="title">농지비율(%)</span>

                    <div class="ui input">
                        <input id="minFarmVal" name="minFarmVal" class="tm5 w106 numberOnly" type="text"
                               placeholder="최소">
                    </div>
                    ~
                    <div class="ui input">
                        <input id="maxFarmVal" name="maxFarmVal" class="tm5 w106 numberOnly" type="text"
                               placeholder="최대">
                    </div>
                </div>

                <div class="itemGroup">
                    <span class="title">비농지비율(%)</span>

                    <div class="ui input">
                        <input id="minUnFarmVal" name="minUnFarmVal" class="tm5 w106 numberOnly" type="text"
                               placeholder="최소">
                    </div>
                    ~
                    <div class="ui input">
                        <input id="maxUnFarmVal" name="maxUnFarmVal" class="tm5 w106 numberOnly" type="text"
                               placeholder="최대">
                    </div>
                </div>

                <div class="itemGroup m002" style="display: none;">
                    <span class="title">
                        생산기반율(%)
                        <div class="iconPopup" data-html='
                            <table class="ui celled table" style="">
                                <thead>
                                <tr>
                                    <th>분류</th>
                                    <th>비율</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>상급</td>
                                    <td>70% 초과</td>
                                </tr>
                                <tr>
                                    <td>중급</td>
                                    <td>40% 초과 70% 이해</td>
                                </tr>
                                <tr>
                                    <td>하급</td>
                                    <td>40% 이하</td>
                                </tr>
                                </tbody>
                            </table>
                        '>
                            <i class="reference fa-solid fa-asterisk" style="color: red; cursor: pointer;"></i>
                        </div>
                    </span>

                    <div class="ui input">
                        <input id="minRtPrdctn" name="minRtPrdctn" class="tm5 w106 numberOnly" type="text"
                               placeholder="최소">
                    </div>
                    ~
                    <div class="ui input">
                        <input id="maxRtPrdctn" name="maxRtPrdctn" class="tm5 w106 numberOnly" type="text"
                               placeholder="최대">
                    </div>
                </div>
            </form>
        </div>

        <button id="btnSearch" class="ui primary button">
            검색
        </button>
    </div>


    <div id="mapMenuWrap">
        <div id="originScreen" class="btn" style="display:none;">
            <i class="icon fa-solid fa-circle-xmark"></i>
            <span class="txt">전체화면 종료</span>
        </div>

        <div id="fullScreen" class="btn">
            <i class="icon fa-solid fa-maximize"></i>
            <span class="txt">전체화면</span>
        </div>

        <div id="roadView" class="btn">
            <i class="icon fa-solid fa-street-view"></i>
            <span class="txt">로드뷰</span>
        </div>

        <div class="btn">
            <div id="baseMapWrap" class="ui blue three item menu">
                <a id="baseMap" class="item">
                    일반지도
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
        <div class="iconWrap" id="information">
            <span>필지정보</span>
            <i class="fa-solid fa-circle-info icon"></i>
        </div>

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
    <div id="daumMap" style="display: none"></div>

    <div id="roadViewWrap"></div>
    <div class="sisMapWalker">
        <div class="angleBack"></div>
        <div class="figure"></div>
    </div>

    <div id="centerPos"></div>
</div>

<!-- 구획현황 모달 -->
<div id="m001Modal" class="modalWrap">
    <div class="modalTitleWrap">
        <span class="title">구획현황 검색결과</span>
        <div class="close"><i class="fa-solid fa-xmark fa-lg"></i></div>
        <div class="minimize"><i class="fa-solid fa-minus"></i></div>
        <div class="maximize"><i class="fa-regular fa-window-maximize"></i></div>
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
                    <th>수원공 포함여부</th>
                    <th>농지비율(%)</th>
                    <th>비농지비율(%)</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>

            <div id="m001PaginationWrap" class="paginationWrap">
                <div class="sisPagination"></div>
            </div>
        </div>
    </div>
</div>

<!-- 관리번호 모달 -->
<div id="m002Modal" class="modalWrap">
    <div class="modalTitleWrap">
        <span class="title">관리번호 검색결과</span>
        <div class="close"><i class="fa-solid fa-xmark fa-lg"></i></div>
        <div class="minimize"><i class="fa-solid fa-minus"></i></div>
        <div class="maximize"><i class="fa-regular fa-window-maximize"></i></div>
    </div>
    <div class="modalBody">
        <div class="ui segment sisLoading">
            <div class="ui active inverted dimmer">
                <div class="ui text loader">Loading</div>
            </div>
        </div>

        <div id="m002Ue101Wrap">
            <div style="text-align: right">
                <div style="text-align: right">
                    검색결과 <span id="m002TotalCount" style="color:red; font-weight:bold;">-</span>건 /
                    총 면적 <span id="m002TotalArea" style="color:red; font-weight:bold;">-</span>ha
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
                    <th>수원공 포함여부</th>
                    <th>농지비율(%)</th>
                    <th>비농지비율(%)</th>
                    <th>생산기반율(%)</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>

            <div id="m002PaginationWrap" class="paginationWrap">
                <div class="sisPagination"></div>
            </div>
        </div>

        <div id="m002LdregWrap" style="display: none;">
            <div style="text-align: right">
                <div style="float:left; cursor: pointer; padding-left: 1px; margin-top:-8px;">
                    <button class="ui primary button" style="padding: 3px 10px;"
                            onclick="javascript: $('#m002LdregWrap').hide(); $('#m002Ue101Wrap').show();">
                        <i class="fa-solid fa-arrow-left fa-2xl"></i>
                    </button>
                </div>
                <div style="text-align: right">
                    검색결과 <span id="m002TotalCount2" style="color:red; font-weight:bold;">-</span>건 /
                    총 면적 <span id="m002TotalArea2" style="color:red; font-weight:bold;">-</span>ha
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

            <div id="m002PaginationWrap2" class="paginationWrap">
                <div class="sisPagination"></div>
            </div>
        </div>
    </div>
</div>

<!-- 단절 모달 -->
<div id="m004Modal" class="modalWrap">
    <div class="modalTitleWrap">
        <span class="title">단절 검색결과</span>
        <div class="close"><i class="fa-solid fa-xmark fa-lg"></i></div>
        <div class="minimize"><i class="fa-solid fa-minus"></i></div>
        <div class="maximize"><i class="fa-regular fa-window-maximize"></i></div>
    </div>
    <div class="modalBody">
        <div class="ui segment sisLoading">
            <div class="ui active inverted dimmer">
                <div class="ui text loader">Loading</div>
            </div>
        </div>

        <div id="m004Ue101Wrap">
            <div style="text-align: right">
                <div style="text-align: right">
                    검색결과 <span id="m004TotalCount" style="color:red; font-weight:bold;">-</span>건 /
                    총 면적 <span id="m004TotalArea" style="color:red; font-weight:bold;">-</span>ha
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

            <div id="m004PaginationWrap" class="paginationWrap">
                <div class="sisPagination"></div>
            </div>
        </div>
    </div>
</div>

<!-- 우량농지 모달 -->
<div id="m005Modal" class="modalWrap">
    <div class="modalTitleWrap">
        <span class="title">우량농지 검색결과</span>
        <div class="close"><i class="fa-solid fa-xmark fa-lg"></i></div>
        <div class="minimize"><i class="fa-solid fa-minus"></i></div>
        <div class="maximize"><i class="fa-regular fa-window-maximize"></i></div>
    </div>
    <div class="modalBody">
        <div class="ui segment sisLoading">
            <div class="ui active inverted dimmer">
                <div class="ui text loader">Loading</div>
            </div>
        </div>

        <div id="m005Ue101Wrap">
            <div style="text-align: right">
                <div style="text-align: right">
                    검색결과 <span id="m005TotalCount" style="color:red; font-weight:bold;">-</span>건 /
                    총 면적 <span id="m005TotalArea" style="color:red; font-weight:bold;">-</span>ha
                </div>
            </div>

            <table class="ui celled table" style="">
                <thead>
                <tr>
                    <th>순번</th>
                    <th>관리번호</th>
                    <th>면적(ha)</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>

            <div id="m005PaginationWrap" class="paginationWrap">
                <div class="sisPagination"></div>
            </div>
        </div>
    </div>
</div>

<!-- 위치이동 모달 -->
<div id="searchPosModal" class="modalWrap">
    <div class="modalTitleWrap">
        <span class="title">위치이동</span>
        <div class="close"><i class="fa-solid fa-xmark fa-lg"></i></div>
    </div>
    <div class="modalBody" style="overflow: visible;">
        <!-- 명청검색 -->
        <div id="searchPlaceWrap">
            <div class="itemGroup pri">
                <span class="title">명칭검색</span>

                <div class="selectWrap">
                    <div class="ui search">
                        <div class="ui icon input">
                            <input id="keyword" class="tm5" type="text" placeholder="검색어를 입력하세요">
                            <i id="btnPlaceSearch" class="icon search tm5" style="cursor: pointer"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div id="placeResultWrap" class="itemGroup pri" style="margin-top: 10px;">
                <span class="title" style="text-align: right; margin-bottom: 5px;">
                    검색결과
                    <span id="count" class="count">45</span>건
                </span>

                <div id="searchResultWrap" style="display: block;">
                    <div id="itemsWrap" class="itemsWrap">
                    </div>
                </div>

                <div id="addrSearchPagination" class="paginationWrap">
                    <div class="sisPagination"></div>
                </div>
            </div>

            <button id="btnPlaceRefresh" class="ui primary button">
                초기화
            </button>
        </div>

        <!-- 지번검색 -->
        <div id="searchJibunWrap">
            <div class="itemGroup pri">
                <span class="title">행정구역</span>
                <div class="selectWrap">
                    <select id="m000_sido" class="selectSido" parent="m000" style="display: none;"></select>
                </div>

                <div class="selectWrap">
                    <select id="m000_sgg" class="selectSgg" parent="m000" style="display: none;"></select>
                </div>

                <div class="selectWrap">
                    <select id="m000_emd" class="selectEmd" parent="m000" style="display: none;"></select>
                </div>

                <div class="selectWrap">
                    <select id="m000_li" class="selectLi" parent="m000" style="display: none;"></select>
                </div>

                <div class="selectWrap" style="text-align: center;">
                    <div class="ui checkbox right" style="margin-right: 8px;">
                        <label>산</label>
                        <input id="san" type="checkbox" name="san">
                    </div>

                    <div class="ui input">
                        <input id="bon" class="w60 numberOnly" type="text" maxlength='4' placeholder="본번">
                    </div>
                    -
                    <div class="ui input">
                        <input id="bu" class="w60 numberOnly" type="text" maxlength='4' placeholder="부번">
                    </div>
                </div>
            </div>

            <button id="btnJibunSearch" class="ui primary button">
                위치이동
            </button>
        </div>

        <div id="jibunSearchLoading" class="ui segment">
            <div class="ui active inverted dimmer">
                <div class="ui text loader">Loading</div>
            </div>
        </div>
    </div>
</div>

<!-- 필지정보 모달 -->
<div id="inforModal" class="modalWrap">
    <div class="modalTitleWrap">
        <span class="title">필지정보</span>
        <div class="close"><i class="fa-solid fa-xmark fa-lg"></i></div>
        <div class="minimize"><i class="fa-solid fa-minus"></i></div>
        <div class="maximize"><i class="fa-regular fa-window-maximize"></i></div>
    </div>
    <div class="modalBody">
        <div class="ui segment sisLoading">
            <div class="ui active inverted dimmer">
                <div class="ui text loader">Loading</div>
            </div>
        </div>

        <div id="m009Ue101Wrap">
            <table class="ui celled table" style="">
                <thead>
                <tr>
                    <th rowspan="2">행정구역</th>
                    <th rowspan="2">산</th>
                    <th rowspan="2">지번</th>
                    <th rowspan="2">지목</th>
                    <th colspan="2">면적</th>
                    <th rowspan="2">소유구분</th>
                </tr>
                <tr>
                    <th style="border-left:1px solid rgba(34,36,38,.1)">공부면적(㎡)</th>
                    <th>공간면적(㎡)</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td id="inforAddr"></td>
                        <td id="inforSan"></td>
                        <td id="inforJibun"></td>
                        <td id="inforJimok"></td>
                        <td id="inforParea"></td>
                        <td id="inforGarea"></td>
                        <td id="inforOwnGbn"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<div id="mapLoading" class="ui segment">
    <div class="ui active inverted dimmer">
        <div class="ui text loader">Loading</div>
    </div>
</div>

</body>
</html>

<script>
    var PATH = "${pageContext.request.contextPath}";
</script>