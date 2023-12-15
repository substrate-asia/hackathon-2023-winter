using Microsoft.AspNetCore.Mvc.Testing;
using System.Text.Json;

namespace Substrate.Hexalem.WebAPI.Test
{
    public class ApiTests
    {
        private JsonSerializerOptions _serializeOptions;

        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            _serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var webAppFactory = new WebApplicationFactory<Program>();
            _httpClient = webAppFactory.CreateClient();
        }

        [TearDown]
        public void TearDown()
        {
            _httpClient?.Dispose();
        }

        [Test]
        public async Task GenesisRoute_GenesisTest()
        {
            var response = await _httpClient.GetAsync("/api/HexalemGame/Genesis");
            var stringResult = await response.Content.ReadAsStringAsync();
            Assert.That(stringResult, Is.Not.Empty);
        }

        [Test]
        public async Task BlockNumberRoute_BlockNumberTest()
        {
            var response = await _httpClient.GetAsync("/api/HexalemGame/BlockNumber");
            var stringResult = await response.Content.ReadAsStringAsync();
            Assert.That(stringResult, Is.Not.Empty);
            Assert.That(stringResult, Is.EqualTo("{\"value\":0,\"formatters\":[],\"contentTypes\":[],\"declaredType\":null,\"statusCode\":200}"));
        }

    }
}