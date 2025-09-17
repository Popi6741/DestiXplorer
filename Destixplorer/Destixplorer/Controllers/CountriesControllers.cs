using Microsoft.AspNetCore.Mvc;
using Destixplorer.Services;
using Destixplorer.Models;

namespace Destixplorer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CountriesController : ControllerBase
    {
        private readonly CountryService _countryService;

        public CountriesController(CountryService countryService)
        {
            _countryService = countryService;
        }

        //  Todos los países
        [HttpGet]
        public async Task<IActionResult> GetAllCountries()
        {
            try
            {
                var countries = await _countryService.GetAllCountriesAsync();
                return Ok(countries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving countries", error = ex.Message });
            }
        }

       
       

        // Países por región
        [HttpGet("region/{region}")]
        public async Task<IActionResult> GetCountriesByRegion(string region)
        {
            try
            {
                var countries = await _countryService.GetCountriesByRegionAsync(region);
                return Ok(countries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving countries by region", error = ex.Message });
            }
        }

       
        [HttpGet("name/{name}")]
        public async Task<IActionResult> GetCountriesByName(string name)
        {
            try
            {
                var countries = await _countryService.SearchCountriesAsync(name);
                return Ok(countries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error searching countries", error = ex.Message });
            }
        }
    }
}