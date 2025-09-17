using Google.Cloud.Firestore;

namespace Destixplorer.Models
{
    [FirestoreData]
    public class FavoriteCountry
    {
        [FirestoreProperty]
        public string Id { get; set; } = string.Empty;

        [FirestoreProperty]
        public string UserId { get; set; } = string.Empty;

        [FirestoreProperty]
        public string CountryCode { get; set; } = string.Empty;

        [FirestoreProperty]
        public string CountryName { get; set; } = string.Empty;

        [FirestoreProperty]
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}
