package com.hackathon.framework.utils;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.mockito.Mockito.*;

class ReportUtilTest {
    @Mock
    List<Result> resultList;
    @InjectMocks
    ReportUtil reportUtil;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testRecordResult() {
        ReportUtil.recordResult(new Result(0L, null, null));
    }

    @Test
    void testClearReport() {
        ReportUtil.clearReport();
    }

    @Test
    void testFeatureMatchForCaseTitle() {
        String result = ReportUtil.featureMatchForCaseTitle(Integer.valueOf(0), "result");
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testGenerateReportHtml() {
        Boolean result = ReportUtil.generateReportHtml("reportMode", "reportPath");
        Assertions.assertEquals(Boolean.TRUE, result);
    }

    @Test
    void testRunCaseFiles() {
        Result result = ReportUtil.runCaseFiles("srcJavaPath", "reportPath");
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }
}