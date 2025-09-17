using Google.Cloud.Firestore;

namespace Destixplorer.Models
{
    [FirestoreData]
    public class Users
    {
        [FirestoreProperty]
        public string Id { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string Email { get; set; }

        [FirestoreProperty]
        public string Name { get; set; }

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }

        [FirestoreProperty]
        public List<string> FavoriteTrips { get; set; } = new List<string>();

       
        [FirestoreProperty]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
