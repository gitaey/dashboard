package sis.com.map.service;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface MapService {

    List<Map<String, Object>> selectSido() throws SQLException;

    List<Map<String, Object>> selectSgg(Map<String, Object> params) throws SQLException;

    List<Map<String, Object>> selectEmd(Map<String, Object> params) throws SQLException;

    List<Map<String, Object>> selectLi(Map<String, Object> params) throws SQLException;

    List<Map<String, Object>> selectLayers(Map<String, Object> params) throws SQLException;

    Map<String, Object> selectSect(Map<String, Object> params) throws SQLException;

    Map<String, Object> selectJijuk(Map<String, Object> params) throws SQLException;

    List<Map<String, Object>> selectUe101(Map<String, Object> params) throws SQLException;

    List<Map<String, Object>> selectJijukByMnum(Map<String, Object> params) throws SQLException;
}
