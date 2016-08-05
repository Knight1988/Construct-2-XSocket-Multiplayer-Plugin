using System.Collections.Generic;
using Newtonsoft.Json;

namespace GameServer.Model
{
    [JsonObject(MemberSerialization.OptIn)]
    public class Room
    {
        [JsonProperty("gameName")]
        public string GameName { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("maxPlayer")]
        public int MaxPlayer { get; set; }

        [JsonProperty("isFull")]
        public bool IsFull => Players.Count == MaxPlayer;

        [JsonProperty("hostId")]
        public long HostId { get; set; }

        public string Password { get; set; }

        [JsonProperty("players")]
        public List<Player> Players { get; } = new List<Player>();
    }
}