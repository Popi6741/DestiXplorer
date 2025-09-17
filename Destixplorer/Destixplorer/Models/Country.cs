using System.Text.Json.Serialization;

namespace Destixplorer.Models
{
    public class Country
    {
        [JsonPropertyName("name")]
        public CountryName Name { get; set; } = new CountryName();

        [JsonPropertyName("capital")]
        public List<string> Capital { get; set; } = new List<string>();

        [JsonPropertyName("region")]
        public string Region { get; set; } = string.Empty;

        [JsonPropertyName("subregion")]
        public string Subregion { get; set; } = string.Empty;

        [JsonPropertyName("population")]
        public long Population { get; set; }

        [JsonPropertyName("flags")]
        public CountryFlags Flags { get; set; } = new CountryFlags();
    }

    public class CountryName
    {
        [JsonPropertyName("common")]
        public string Common { get; set; } = string.Empty;

        [JsonPropertyName("official")]
        public string Official { get; set; } = string.Empty;
    }

    public class CountryFlags
    {
        [JsonPropertyName("png")]
        public string Png { get; set; } = string.Empty;

        [JsonPropertyName("svg")]
        public string Svg { get; set; } = string.Empty;

        [JsonPropertyName("alt")]
        public string Alt { get; set; } = string.Empty;
    }
}