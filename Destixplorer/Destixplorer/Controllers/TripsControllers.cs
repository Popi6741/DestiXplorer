using Microsoft.AspNetCore.Mvc;
using Destixplorer.Services;
using Destixplorer.Models;

namespace Destixplorer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripsController : ControllerBase
    {
        private readonly FirebaseService _firebaseService;

        public TripsController(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTrip([FromBody] Trip trip)
        {
            try
            {
                trip.Id = Guid.NewGuid().ToString();
                await _firebaseService.SaveTripAsync(trip);
                return Ok(new { message = "Viaje planificado correctamente", tripId = trip.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al planificar viaje", error = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserTrips(string userId)
        {
            try
            {
                var trips = await _firebaseService.GetUserTripsAsync(userId);
                return Ok(trips);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al recibir viajes", error = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(string id)
        {
            try
            {
                Console.WriteLine($"Deleting trip with ID: {id}");

                var result = await _firebaseService.DeleteTripAsync(id);
                if (result)
                {
                    return Ok(new { message = "Viaje eliminado correctamente" });
                }
                else
                {
                    return NotFound(new { message = "Viaje no encontrado" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting trip: {ex.Message}");
                return StatusCode(500, new { message = "Error al eliminar viaje", error = ex.Message });
            }
        }
    }
}
