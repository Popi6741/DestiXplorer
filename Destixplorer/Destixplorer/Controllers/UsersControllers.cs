using Microsoft.AspNetCore.Mvc;
using Destixplorer.Services;
using Destixplorer.Models;
using System.ComponentModel.DataAnnotations;

namespace Destixplorer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly FirebaseService _firebaseService;

        public UsersController(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

        // GET: api/users/{userId} - Obtener perfil de usuario
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserProfile(string userId)
        {
            try
            {
                var user = await _firebaseService.GetUserProfileAsync<Users>(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                
                var userResponse = new
                {
                    user.Id,
                    user.Email,
                    user.Name,
                    user.CreatedAt,
                    user.FavoriteTrips
                    
                };

                return Ok(userResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener usuario", error = ex.Message });
            }
        }

        // PUT: api/users/{userId} - Actualizar perfil de usuario
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUserProfile(string userId, [FromBody] UpdateUserRequest request)
        {
            try
            {
                var existingUser = await _firebaseService.GetUserProfileAsync<Users>(userId);
                if (existingUser == null)
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                // Actualizar solo los campos permitidos
                existingUser.Name = request.Name;
                existingUser.FavoriteTrips = request.FavoriteCharacters;
               

                await _firebaseService.SaveUserProfileAsync(userId, existingUser);

                return Ok(new { message = "Perfil actualizado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al actualizar usuario", error = ex.Message });
            }
        }

        // GET: api/users/{userId}/favorites - Obtener favoritos del usuario
        [HttpGet("{userId}/favorites")]
        public async Task<IActionResult> GetUserFavorites(string userId)
        {
            try
            {
                var user = await _firebaseService.GetUserProfileAsync<Users>(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                var favorites = new
                {
                    FavoriteTrips = user.FavoriteTrips
                  
                };

                return Ok(favorites);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener favoritos", error = ex.Message });
            }
        }

        // POST: api/users/{userId}/favorites/characters - Añadir personaje favorito
        [HttpPost("{userId}/favorites/Trips")]
        public async Task<IActionResult> AddFavoriteTrips(string userId, [FromBody] FavoriteItemRequest request)
        {
            try
            {
                var user = await _firebaseService.GetUserProfileAsync<Users>(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                if (!user.FavoriteTrips.Contains(request.ItemName))
                {
                    user.FavoriteTrips.Add(request.ItemName);
                    await _firebaseService.SaveUserProfileAsync(userId, user);
                }

                return Ok(new { message = "Personaje añadido a favoritos" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al añadir favorito", error = ex.Message });
            }
        }




        // DELETE: api/users/{userId}/favorites/characters/{characterName} Eliminar viaje fav
        [HttpDelete("{userId}/favorites/Trips/{tripName}")]
        public async Task<IActionResult> RemoveFavoriteTrip(string userId, string tripName)
        {
            try
            {
                // Decodificar el nombre
                var decodedTripName = Uri.UnescapeDataString(tripName);
                Console.WriteLine($"Removing favorite: {decodedTripName} for user: {userId}");

                // Tu lógica para eliminar de Firebase
                var user = await _firebaseService.GetUserProfileAsync<Users>(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                if (user.FavoriteTrips.Contains(decodedTripName))
                {
                    user.FavoriteTrips.Remove(decodedTripName);
                    await _firebaseService.SaveUserProfileAsync(userId, user);
                    return Ok(new { message = "Viaje eliminado de favoritos" });
                }
                else
                {
                    return NotFound(new { message = "Viaje no encontrado en favoritos" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error removing favorite: {ex.Message}");
                return BadRequest(new { message = "Error al eliminar favorito", error = ex.Message });
            }
        }





        // GET: api/users - Obtener todos los usuarios 
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _firebaseService.GetAllUsersAsync();

                // No retornar información sensible
                var usersResponse = users.Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.Name,
                    u.CreatedAt,
                    FavoriteCharactersCount = u.FavoriteTrips.Count
                   
                });

                return Ok(usersResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener usuarios", error = ex.Message });
            }
        }
    }

    // Modelos para las requests
    public class UpdateUserRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public List<string> FavoriteCharacters { get; set; } = new List<string>();
       
    }

    public class FavoriteItemRequest
    {
        [Required]
        public string ItemName { get; set; } = string.Empty;
    }
}
