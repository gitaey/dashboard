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
    MapMapper mapMapper;

    @Override
    public List<Map<String, Object>> selectSido() throws SQLException {
        return mapMapper.selectSido();
    }

    @Override
    public List<Map<String, Object>> selectSgg(Map<String, Object> params) throws SQLException {
        return mapMapper.selectSgg(params);
    }

    @Override
    public List<Map<String, Object>> selectEmd(Map<String, Object> params) throws SQLException {
        return mapMapper.selectEmd(params);
    }

    @Override
    public List<Map<String, Object>> selectLi(Map<String, Object> params) throws SQLException {
        return mapMapper.selectLi(params);
    }

    @Override
    public List<Map<String, Object>> selectLayers(Map<String, Object> params) throws SQLException {
        return mapMapper.selectLayers(params);
    }

    @Override
    public Map<String, Object> selectSect(Map<String, Object> params) throws SQLException {
        return mapMapper.selectSect(params);
    }

    @Override
    public Map<String, Object> selectJijuk(Map<String, Object> params) throws SQLException {
        return mapMapper.selectJijuk(params);
    }
}
