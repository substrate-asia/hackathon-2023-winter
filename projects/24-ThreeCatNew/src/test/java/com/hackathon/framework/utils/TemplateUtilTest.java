package com.hackathon.framework.utils;

import com.hackathon.framework.bean.SolBean;
import freemarker.template.TemplateException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;

class TemplateUtilTest {
    @Mock
    Map<String, List<String>> assertionMap;
    @InjectMocks
    TemplateUtil templateUtil;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testToTestTemplate() throws IOException {
        Result result = TemplateUtil.toTestTemplate("abiPath", "solPath", "saveFilePath");
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }

    @Test
    void testSaveTestFile() {
        Result result = TemplateUtil.saveTestFile(new SolBean(), "saveFilePath");
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }

    @Test
    void testJsonCheckToClass() throws IOException {
        String result = TemplateUtil.jsonCheckToClass("fileStr", new SolBean(), "solPath");
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testGetTestObject() throws IOException {
        String result = TemplateUtil.getTestObject("jsonString", new SolBean(), "solPath");
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testMain() throws TemplateException, IOException {
        TemplateUtil.main(new String[]{"args"});
    }
}
