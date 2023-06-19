package sis.com.map.service.impl;

import org.springframework.stereotype.Service;
import sis.com.map.service.MapMapper;
import sis.com.map.service.MapService;

import javax.annotation.Resource;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Service("mapService")
public class MapServiceImpl implements MapService {

    @Resource(name = "mapMapper")
    MapMapper mapper;

    @Override
    public List<Map<String, Object>> selectSido() throws SQLException {
        return mapper.selectSido();
    }

    @Override
    public List<Map<String, Object>> selectSgg(Map<String, Object> params) throws SQLException {
        return mapper.selectSgg(params);
    }

    @Override
    public List<Map<String, Object>> selectEmd(Map<String, Object> params) throws SQLException {
        return mapper.selectEmd(params);
    }

    @Override
    public List<Map<String, Object>> selectLi(Map<String, Object> params) throws SQLException {
        return mapper.selectLi(params);
    }

    @Override
    public List<Map<String, Object>> selectLayers(Map<String, Object> params) throws SQLException {
        return mapper.selectLayers(params);
    }

    @Override
    public Map<String, Object> selectSect(Map<String, Object> params) throws SQLException {
        return mapper.selectSect(params);
    }

    @Override
    public Map<String, Object> selectJijuk(Map<String, Object> params) throws SQLException {
        return mapper.selectJijuk(params);
    }

    @Override
    public List<Map<String, Object>> selectUe101(Map<String, Object> params) throws SQLException {
        return mapper.selectUe101(params);
    }

    @Override
    public List<Map<String, Object>> selectJijukByMnum(Map<String, Object> params) throws SQLException {
        return mapper.selectJijukByMnum(params);
    }

    @Override
    public List<Map<String, Object>> selectMngCode(Map<String, Object> params) throws SQLException {
        return mapper.selectMngCode(params);
    }

    @Override
    public List<Map<String, Object>> selectStatistics(Map<String, Object> params) throws SQLException {
        return mapper.selectStatistics(params);
    }

    @Override
    public Map<String, Object> selectUe101Total(Map<String, Object> params) throws SQLException {
        return mapper.selectUe101Total(params);
    }
}
