using Google.Cloud.Firestore;

namespace Destixplorer.Models
{
    [FirestoreData]
    public class Trip
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
        public DateTime StartDate { get; set; }

        [FirestoreProperty]
        public DateTime EndDate { get; set; }

        [FirestoreProperty]
        public string Description { get; set; } = string.Empty;

        [FirestoreProperty]
        public int Rating { get; set; }

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
