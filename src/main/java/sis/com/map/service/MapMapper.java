package sis.com.map.service;

import org.apache.ibatis.jdbc.SQL;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Mapper("mapMapper")
public interface MapMapper {

    List<Map<String, Object>> selectSido() throws SQLException;

    List<Map<String, Object>> selectSgg(Map<String, Object> params) throws SQLException;

    List<Map<String, Object>> selectEmd(Map<String, Object> params) throws SQLException;

    List<Map<String, Object>> selectLi(Map<String, Object> params) throws SQLException;

    List<Map<String, Object>> selectLayers(Map<String, Object> params) throws SQLException;

    Map<String, Object> selectSect(Map<String, Object> params) throws SQLException;

    Map<String, Object> selectJijuk(Map<String, Object> params) throws SQLException;
}
