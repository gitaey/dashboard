package sis.com.map.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.egovframe.rte.psl.dataaccess.util.EgovMap;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import sis.com.map.service.JsonVO;
import sis.com.map.service.MapService;
import sis.com.map.service.NoticeVO;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
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

}
