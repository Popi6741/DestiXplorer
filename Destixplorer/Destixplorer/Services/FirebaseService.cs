using System.Security.Cryptography.X509Certificates;
using Destixplorer.Models;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Destixplorer.Models;

namespace Destixplorer.Services
{
    public class FirebaseService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly FirebaseAuth _firebaseAuth;

        public FirebaseService()
        {
            try
            {

                string[] possiblePaths = {
                    Path.Combine(Directory.GetCurrentDirectory(), "Config", "destixplorerbd-firebase-adminsdk-fbsvc-d7e4fe2cea.json"),
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Config", "destixplorerbd-firebase-adminsdk-fbsvc-d7e4fe2cea.json"),
                    "Config/destixplorerbd-firebase-adminsdk-fbsvc-d7e4fe2cea.json"
                };

                string credentialPath = "";
                foreach (string path in possiblePaths)
                {
                    if (File.Exists(path))
                    {
                        credentialPath = path;
                        Console.WriteLine($"Archivo encontrado en: {path}");
                    }
                }

                if (string.IsNullOrEmpty(credentialPath))
                {
                    throw new FileNotFoundException("Archivo no encontrado");
                }

                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialPath);

                var credential = GoogleCredential.FromFile(credentialPath);

                if (FirebaseApp.DefaultInstance == null)
                {
                    FirebaseApp.Create(new AppOptions()
                    {
                        Credential = credential,
                        ProjectId = "destixplorerbd"
                    });
                }

                _firestoreDb = new FirestoreDbBuilder
                {
                    ProjectId = "destixplorerbd",
                    Credential = credential
                }.Build();

                _firebaseAuth = FirebaseAuth.DefaultInstance;

                Console.WriteLine("Firebase inicializado correctamente.");

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inicializando Firebase: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        //Autenticacion
        public async Task<UserRecord> CreateUserAsync(string email, string password)
        {
            var userRecordArgs = new UserRecordArgs()
            {
                Email = email,
                Password = password,
                EmailVerified = false,
                Disabled = false
            };
            return await _firebaseAuth.CreateUserAsync(userRecordArgs);
        }

        public async Task<string?> VerifyTokenAsync(string idToken)
        {
            try
            {
                var decodedToken = await _firebaseAuth.VerifyIdTokenAsync(idToken);
                return decodedToken.Uid;
            }
            catch
            {
                return null;
            }
        }

        //Guardar el perfil
        public async Task SaveUserProfileAsync(string userId, object userData)
        {
            var docRef = _firestoreDb.Collection("users").Document(userId);
            await docRef.SetAsync(userData);
        }

        public async Task<T?> GetUserProfileAsync<T>(string userId) where T : class
        {
            var docRef = _firestoreDb.Collection("users").Document(userId);
            var snapshot = await docRef.GetSnapshotAsync();
            return snapshot.Exists ? snapshot.ConvertTo<T>() : null;
        }

        public async Task<List<Users>> GetAllUsersAsync()
        {
            var query = _firestoreDb.Collection("users");
            var snapshot = await query.GetSnapshotAsync();

            var users = new List<Users>();

            foreach (var document in snapshot.Documents)
            {
                users.Add(document.ConvertTo<Users>());
            }
            return users;
        }

        // Operaciones para viajes
        public async Task SaveTripAsync(Trip trip)
        {
            var docRef = _firestoreDb.Collection("trips").Document(trip.Id);
            await docRef.SetAsync(trip);
        }

        public async Task<List<Trip>> GetUserTripsAsync(string userId)
        {
            var query = _firestoreDb.Collection("trips").WhereEqualTo("UserId", userId);
            var snapshot = await query.GetSnapshotAsync();

            return snapshot.Documents.Select(doc => doc.ConvertTo<Trip>()).ToList();
        }

        public async Task<bool> DeleteTripAsync(string tripId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("trips").Document(tripId);
                await docRef.DeleteAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    
    // Operaciones para países favoritos
public async Task AddFavoriteCountryAsync(FavoriteCountry favorite)
        {
            var docRef = _firestoreDb.Collection("favorites").Document(favorite.Id);
            await docRef.SetAsync(favorite);
        }

        public async Task<List<FavoriteCountry>> GetUserFavoritesAsync(string userId)
        {
            var query = _firestoreDb.Collection("favorites").WhereEqualTo("UserId", userId);
            var snapshot = await query.GetSnapshotAsync();

            return snapshot.Documents.Select(doc => doc.ConvertTo<FavoriteCountry>()).ToList();
        }

        public async Task<bool> RemoveFavoriteCountryAsync(string favoriteId)
        {
            try
            {
                var docRef = _firestoreDb.Collection("favorites").Document(favoriteId);
                await docRef.DeleteAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> IsCountryFavoriteAsync(string userId, string countryCode)
        {
            var query = _firestoreDb.Collection("favorites")
                .WhereEqualTo("UserId", userId)
                .WhereEqualTo("CountryCode", countryCode);

            var snapshot = await query.GetSnapshotAsync();
            return snapshot.Documents.Any();
        }
    }
}
