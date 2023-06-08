(function (window, $) {
    'use strict'

    window.SisTree = function (map, props) {
        if (!map) {
            alert("Tree map를 설정해 주세요");
            return false;
        }

        this.map = map;
        this._init(props);
    };

    SisTree.prototype = {
        lstTree: [],
        props: {
            target: "tree"
        },

        _init: function (props) {
            this.extendProps(props);

            this.$target = $("#" + this.props.target);
            this.$target.addClass("layerTree");
            this.$target.html("");
            this.$target.append("<ul id='root' node='root' class='tree' tree='true'></ul>");
            var $root = this.$target.find("#root");

            $root.attr("node", "root");
        },

        extendProps: function (props) {
            this.props = $.extend({}, this.props, props);
        },

        createTree: function (lyrList) {
            var self = this;

            $.each(lyrList, function (key, value) {
                if (value.type == "group") {
                    if (value.load)
                        self.appendGroupNode(value);
                } else {
                    if (value.load) {
                        var layer;

                        if (value.type == "geoserver")
                            layer = sisLyr.addWmsLayer(value.lyrWmsNm, value, self.map, true);

                        if (value.type == 'api')
                            layer = sisLyr.addApiLayer(value.lyrWmsNm, value, self.map);

                        self.appendNode(value, layer);
                    }
                }
            });

            // var node = $($("div.node:last-child")[$("div.node:last-child").length - 1]);
            // $("span").removeClass("tree-expander-off-end");
            // $("span").removeClass("tree-expander-on-end");

            // while (self.findNode(node.attr("node")).attr("node") != "root") {
            //     if (node.children("div.wrap").children(".tree-expander").hasClass("tree-expander-off")) {
            //         node.children("div.wrap").children(".tree-expander").addClass("tree-expander-off-end");
            //     } else {
            //         node.children("div.wrap").children(".tree-expander").addClass("tree-expander-on-end");
            //     }
            //
            //     node = self.findNode(node.attr("parent"));
            // }
        },

        /**
         * 그룹 노드 생성
         * @param node
         * @date 2022.06.20
         * */
        appendGroupNode: function (node) {
            var expandClass = "plus";
            var checkboxClass = "";

            if (node.expand) expandClass = "minus";
            if (node.visibility) checkboxClass = "check";

            var nodeStr = "";
            nodeStr += `<li class="group node ${node.root ? 'root' : ""} ${node.id} ${node.expand ? 'expandOn' : 'expandOff'}" node="${node.id}" parent="${node.parent}">`;
            nodeStr += `    <i class="${expandClass} circle icon expander"></i>`;
            nodeStr += `    <i class="${checkboxClass} square outline icon checkbox"></i>`;
            nodeStr += `    <a class="layerName" title="${node.lyrKorNm}">${node.lyrKorNm}</a>`;
            nodeStr += `    <ul class="itemsWrap ${node.id}" style="display:${node.expand ? 'block' : 'none'};"></ul>`;
            nodeStr += `</li>`;

            var pNode = this.findNode(node.parent);

            // 노드 추가
            if (node.root) $(pNode).append(nodeStr); // 상위그룹이 루트일떄
            else $(pNode).children(".itemsWrap").append(nodeStr);

            var checkbox = pNode.find(`[node=${node.id}]`).children(".checkbox");
            var expander = pNode.find(`[node=${node.id}]`).children(".expander");
            var title = pNode.find(`[node=${node.id}]`).children(".layerName");
            var itemsWrap = pNode.find(`[node=${node.id}]`).children(".itemsWrap");

            // var rootWrap = $(`[node=${node.id}]`).find(".wrap.root");
            //

            if (!node.root) this.addCheckboxEvent(checkbox, title);
            else {
                $(title).on("click", () => {
                    $(expander).click();
                })
            }
            this.addExpanderEvent(expander);
        },

        /**
         * 노드 생성
         * @param node
         * @date 2022.06.20
         * */
        appendNode: function (node, layer) {
            var self = this;
            var checkboxClass = "";
            var expandClass = "plus";

            if (node.visibility) checkboxClass = "check";
            if (node.visibility) expandClass = "minus";


            var nodeStr =
                `<li style="display: list-item;" class="layer node ${node.visibility ? 'expandOn' : 'expandOff'}" node="${node.id}" parent="${node.parent}">
                    <i class="${expandClass} circle icon expander"></i>
                    <i class="${checkboxClass} square outline icon checkbox"></i>
                    <a class="layerName" title="${node.lyrKorNm}">${node.lyrKorNm}</a>
                    <ul class="itemsWrap" style="display:${node.visibility ? 'block' : 'none'};">
                        <li class="node"><div id="${node.id}" name="${node.id}" class='treeSlider'></div></li>
                    </ul>
                </li>`;

            var pNode = this.findNode(node.parent);

            // 노드 추가
            $(pNode).children(".itemsWrap").append(nodeStr);

            var checkbox = pNode.find(`[node=${node.id}]`).children(".checkbox");
            var expander = pNode.find(`[node=${node.id}]`).children(".expander");
            var title = pNode.find(`[node=${node.id}]`).children(".layerName");

            // 범례 이벤트
            var legendWrap = pNode.find(`[node=${node.id}]`).children(".itemsWrap");
            var $slider = $(legendWrap).find(".treeSlider");

            $slider.slider({
                value: 100,
                slide: function (evt, ui) {
                    var opacity = ui.value / 100;
                    var id = evt.target.id;

                    var lyr = null;
                    self.map.getLayers().forEach(function (item, idx) {
                        if (item.get("id") == id)
                            lyr = item;
                    });

                    if (lyr)
                        lyr.setOpacity(opacity);
                }
            });

            if (node.visibility) {
                self.getLegend(node, checkbox);
            }

            // 체크박스 이벤트
            this.addCheckboxEvent(checkbox, title, node);
            // 익스팬더 이벤트
            this.addExpanderEvent(expander, node);

            // 상위그룹 체크박스 변경
            this._parentNodeCheck($(pNode));
        },

        /**
         * Checkbox 이벤트
         * @param checkbox
         * @param checkboxSpan
         * @date 2022.06.20
         * */
        addCheckboxEvent: function (checkbox, checkboxSpan, node) {
            var self = this;
            var $checkboxSpan = $(checkboxSpan);
            var $checkbox = $(checkbox);
            var $node = $checkbox.parent();
            var isGrp = $node.hasClass("group");

            var parent = $node.attr("parent");
            var $pNode = self.findNode(parent);

            $checkboxSpan.on("click", () => {
                $checkbox.click();
            })

            $checkbox.on("click", () => {
                var isChecked = "";

                $checkbox.removeClass("minus");

                if ($checkbox.hasClass("check")) {
                    $checkbox.removeClass("check");

                    if (!isGrp) {
                        $node.children(".itemsWrap").slideUp(500);
                        $node.removeClass("expandOn");
                        $node.addClass("expandOff");
                    }

                    isChecked = false;
                } else {
                    $checkbox.addClass("check");

                    if (!isGrp) {
                        $node.children(".itemsWrap").slideDown(500);
                        $node.removeClass("expandOff");
                        $node.addClass("expandOn");
                        self.getLegend(node, checkbox);
                    }

                    isChecked = true;
                }

                if ($node.hasClass("layer")) {
                    var id = $node.attr("node");

                    sisLyr.wms[id].setVisible(isChecked);
                }

                // 하위 항목 모두 체크변경
                $.each($node.find(".checkbox"), function (idx, target) {
                    var $node = $(target).parent();
                    var id = $node.attr("node");
                    var isLyr = $node.hasClass("layer");

                    if (idx > 0) {
                        if ($(target).hasClass("check") != isChecked) {
                            var lyr = null;

                            // 범례 일경우 setVisible 실행 안함
                            if (!$(target).hasClass("layerItem") && !$node.hasClass("group")) {
                                self.map.getLayers().forEach(function (item, idx) {
                                    if (item.get("id") == id) {
                                        lyr = item;
                                        node = lyr.getProperties();
                                    }
                                });

                                lyr.setVisible(isChecked);
                            }

                            if (isChecked) {
                                $(target).addClass("check");

                                if (isLyr) {
                                    $node.children(".itemsWrap").slideDown(500);
                                    $node.removeClass("expandOff");
                                    $node.addClass("expandOn");
                                    self.getLegend(node, target);
                                }
                            } else {
                                $(target).removeClass("check");

                                if (isLyr) {
                                    $node.children(".itemsWrap").slideUp(500);
                                    $node.removeClass("expandOn");
                                    $node.addClass("expandOff");
                                }
                            }
                        }
                    }
                });

                // 상위 항목 모두 체크 변경
                self._parentNodeCheck($pNode);
            });
        },

        /**
         * Expander 이벤트
         * @param expander
         * @date 2022.06.20
         * */
        addExpanderEvent: function (expander, node) {
            var self = this;
            var $expander = $(expander);

            $expander.on("click", function (evt) {
                if (self.sliding)
                    return false;
                self.sliding = true;

                var t = $expander.parent().children("ul.itemsWrap");

                var toggleClass = () => {
                    self.sliding = false
                }

                if ($(t).is(":hidden")) $(t).slideDown(500, () => {
                    toggleClass();

                    if(!$expander.parent().hasClass("group")) self.getLegend(node, expander)
                });
                else $(t).slideUp(500, () => {
                    toggleClass();
                });

                $expander.parent().toggleClass("expandOn");
                $expander.parent().toggleClass("expandOff");

                $expander.toggleClass("minus");
                $expander.toggleClass("plus");

                return false;
            });
        },

        getLegend: function(node, item) {
            if(node.lyrWmsNm == "lsmd_cont_ldreg") node.lyrWmsNm += "_26_202301";
            if(node.lyrWmsNm == "lsmd_cont_ue101") node.lyrWmsNm += "_26";

            // var legendJsonUrl = `${PATH}/map/proxy/wms.do?LAYER=${node.lyrWmsNm}&request=GetLegendGraphic&format=image/png&width=40&LEGEND_OPTIONS=forceLabels:off`;
            var legendJsonUrl = `${PATH}/map/proxy/wms.do?LAYER=${node.lyrWmsNm}&request=GetLegendGraphic&format=application/json&`;
            var styles = {};
            var legendWrap = $(item).closest(".layer").children(".itemsWrap");

            // if(legendWrap.find(".legendItem").length == 0) {
            //     legendWrap.append(
            //         `<li class="node legendItem">
            //         <img src="${legendJsonUrl}" />
            //         <div style="display:inline-block;vertical-align: top;" class="legendTitle">${node.lyrKorNm}</div>
            //     </li>`
            //     );
            // }

            if($(legendWrap).find(".legendItem").length == 0) {
                // 범례 추가
                $.ajax({
                    url: legendJsonUrl,
                    // async: false,
                    success: (res) => {
                        if (res.Legend) {
                            var json = res.Legend[0];

                            json.rules.reverse();

                            $.each(json.rules, (idx, item) => {
                                // item.name = node.lyrKorNm;

                                if(item.name) {
                                    item.name = item.name.replace("_over", "");

                                    if (!styles[item.name]) styles[item.name] = {};

                                    if (item.symbolizers) {
                                        $.each(item.symbolizers, (i, style) => {
                                            if (style.Polygon) {
                                                if (!styles[item.name].Polygon) {
                                                    styles[item.name].Polygon = {};
                                                }

                                                if (style.Polygon["graphic-fill"]) {
                                                    styles[item.name].Polygon.graphicFill = style.Polygon["graphic-fill"];
                                                } else {
                                                    styles[item.name].Polygon = $.extend({}, styles[item.name].Polygon, style.Polygon);
                                                }
                                            } else if (style.Text) {
                                                styles[item.name].Text = style.Text;
                                            }
                                        });
                                    }
                                }
                            });

                            $.each(styles, (key, style) => {
                                var polygon = style.Polygon;

                                if(polygon) {
                                    const hexToRgb = hex => {
                                        if (!hex) return "";
                                        return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
                                            , (m, r, g, b) => '#' + r + r + g + g + b + b)
                                            .substring(1).match(/.{2}/g)
                                            .map(x => parseInt(x, 16))
                                    };

                                    var stroke = hexToRgb(polygon.stroke) || [43, 43, 43];
                                    var strokeWidth = Math.round(polygon["stroke-width"]) || 1;
                                    var strokeOpacity = polygon["stroke-opacity"] || 1;
                                    var strokeDasharray = polygon["stroke-dasharray"] ? "dashed" : "solid";
                                    var fill = hexToRgb(polygon.fill);
                                    var opacity = polygon["fill-opacity"] || 1;
                                    var fillGraphic = polygon.graphicFill;

                                    if (fillGraphic) strokeOpacity = 1;

                                    var str = "";

                                    if (stroke) str += `border: ${strokeWidth}px ${strokeDasharray} rgba(${stroke.toString()},${strokeOpacity});`;
                                    if (fill) str += `background-color:rgba(${fill.toString()},${opacity});`;
                                    if (fillGraphic) str += `background-image:url(${fillGraphic.url})`;

                                    legendWrap.append(
                                        `<li class="node legendItem">
                                            <div style="${str}" class="legendImage"></div>
                                            <div style="display:inline-block;" class="legendTitle">${key}</div>
                                        </li>`
                                    );
                                }
                            });


                        }
                    }
                });
            }
        },

        /**
         * Root div 클릭 이벤트
         * @param expander
         * @date 2022.06.20
         * */
        addRootWrapEvent: function (wrap) {
            var self = this;
            var $wrap = $(wrap);

            $wrap.on("click", function (e) {
                if (self.sliding)
                    return false;
                self.sliding = true;

                if ($(e.target).hasClass("arrow") || $(e.target).hasClass("tree-group-title")) {
                    self.sliding = false;
                    $(e.target).parent().click();

                    return false;
                }

                $(e.target).toggleClass("expand-on").toggleClass("expand-off");
                if ($(e.target).hasClass("expand-on")) {
                    $(e.target).parent().css("padding", "0 0 10px 0");
                } else {
                    $(e.target).parent().css("padding", "0");
                }

                self.sliding = false
                $wrap.find("span.tree-expander").click();

                // setTimeout(() this.sliding = false, 500);
            });
        },

        findNode: function (id) {
            return this.$target.find("[node='" + id + "']");
        },

        _parentNodeCheck: function ($node) {
            var checkedAllLength = $node.children("ul.itemsWrap").find(".checkbox").length;
            var checkedLegnth = $node.children("ul.itemsWrap").find(".check").length;

            $node.children(".checkbox").removeClass("check");
            $node.children(".checkbox").removeClass("minus");

            if (checkedLegnth > 0) {
                if (checkedAllLength == checkedLegnth) {
                    $node.children(".checkbox").addClass("check");
                } else if (checkedAllLength < checkedLegnth) {
                    $node.children(".checkbox").addClass("check");
                } else {
                    $node.children(".checkbox").addClass("minus");
                }
            }

            if ($node.attr("parent")) {
                var $pNode = this.findNode($node.attr("parent"));
                if ($pNode.attr("node") == "root")
                    return;
                else
                    this._parentNodeCheck(this.findNode($node.attr("parent")));
            }
        }
    };
})(window, jQuery);