package sis.com.map.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import sis.com.map.service.MapService;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller
public class MapController {

    @Resource(name = "mapService")
    MapService mapService;

    @RequestMapping("/mapMain.do")
    public String mapPage(HttpServletRequest request, ModelMap model) throws Exception {

        return "/map/index";
    }

    @RequestMapping("/selectSido.do")
    public String selectSido(HttpServletRequest request, ModelMap model) throws Exception {

        List<Map<String, Object>> items = mapService.selectSido();

        model.put("data", items);

        return "jsonView";
    }

    @RequestMapping("/selectSgg.do")
    public String selectSgg(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        List<Map<String, Object>> items = mapService.selectSgg(params);

        model.put("data", items);

        return "jsonView";
    }

    @RequestMapping("/selectEmd.do")
    public String selectEmd(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        List<Map<String, Object>> items = mapService.selectEmd(params);

        model.put("data", items);

        return "jsonView";
    }

    @RequestMapping("/selectLi.do")
    public String selectLi(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        List<Map<String, Object>> items = mapService.selectLi(params);

        model.put("data", items);

        return "jsonView";
    }

    @RequestMapping("/selectLayers.do")
    public String selectLayers(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        List<Map<String, Object>> items = mapService.selectLayers(params);

        model.put("data", items);

        return "jsonView";
    }

    @RequestMapping("/selectSect.do")
    public String selectSect(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        Map<String, Object> item = mapService.selectSect(params);

        model.put("data", item);

        return "jsonView";
    }

    @RequestMapping("/selectJijuk.do")
    public String selectJijuk(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        Map<String, Object> item = mapService.selectJijuk(params);

        model.put("data", item);

        return "jsonView";
    }

    // 구획현황 > 진흥지역 조회
    @RequestMapping("/selectUe101.do")
    public String selectUe101(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        Map<String, Object> total = mapService.selectUe101Total(params);
        List<Map<String, Object>> item = mapService.selectUe101(params);

        model.put("total", total);
        model.put("data", item);

        return "jsonView";
    }

    // 관리번호 > 진흥지역 조회
    @RequestMapping("/selectMngCode.do")
    public String selectMngCode(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        Map<String, Object> total = mapService.selectUe101Total(params);
        List<Map<String, Object>> item = mapService.selectMngCode(params);

        model.put("total", total);
        model.put("data", item);

        return "jsonView";
    }

    // 일반현황 조회
    @RequestMapping("/selectStatistics.do")
    public String selectStatistics(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        List<Map<String, Object>> item = mapService.selectStatistics(params);
        List<Map<String, Object>> nj = mapService.selectStatisticsNj(params);

        model.put("data", item);
        model.put("nData", nj);

        return "jsonView";
    }

    // 구획 및 필지정보 조회
    @RequestMapping("/viewUe101Ldreg.do")
    public String viewUe101Ldreg(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        model.put("params", params);

        return "/map/viewJijukByMnum";
    }

    // 일반현황 뷰 호출
    @RequestMapping("/viewStatistics.do")
    public String selectUe101Ldreg(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        model.put("params", params);

        return "/map/viewStatistics";
    }

    // MNUM으로 지적도 조회
    @RequestMapping("/selectJijukByMnum.do")
    public String selectJijukByMnum(@RequestParam Map<String, Object> params, ModelMap model) throws Exception {

        Map<String, Object> ue101 = mapService.selectUe101ByMnum(params);
        List<Map<String, Object>> data = mapService.selectJijukByMnum(params);

        model.put("item", ue101);
        model.put("data", data);

        return "jsonView";
    }
}
