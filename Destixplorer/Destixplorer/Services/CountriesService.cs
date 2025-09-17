using System.Text.Json;
using Destixplorer.Models;

namespace Destixplorer.Services
{
    public class CountryService
    {
        private readonly HttpClient _httpClient;

        public CountryService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://restcountries.com/v3.1/");
        }

        //  Todos los países con campos específicos
        public async Task<List<Country>> GetAllCountriesAsync()
        {
            var response = await _httpClient.GetAsync("all?fields=name,capital,region,population,flags,cca3");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var countries = JsonSerializer.Deserialize<List<Country>>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return countries ?? new List<Country>();
        }

        //  País por código
        public async Task<Country> GetCountryByCodeAsync(string code)
        {
            var response = await _httpClient.GetAsync($"alpha/{code}?fields=name,capital,region,population,flags,cca3");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var countries = JsonSerializer.Deserialize<List<Country>>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return countries?.FirstOrDefault() ?? new Country();
        }

        // Países por región
        public async Task<List<Country>> GetCountriesByRegionAsync(string region)
        {
            var response = await _httpClient.GetAsync($"region/{region}?fields=name,capital,region,population,flags,cca3");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var countries = JsonSerializer.Deserialize<List<Country>>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return countries ?? new List<Country>();
        }

      
        public async Task<List<Country>> SearchCountriesAsync(string name)
        {
            var response = await _httpClient.GetAsync($"name/{name}?fields=name,capital,region,population,flags,cca3");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var countries = JsonSerializer.Deserialize<List<Country>>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return countries ?? new List<Country>();
        }
    }
}