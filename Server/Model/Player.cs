using Newtonsoft.Json;

namespace GameServer.Model
{
    [JsonObject(MemberSerialization.OptIn)]
    public class Player 
    {
        public Player(long id, string name, bool isHost)
        {
            Id = id;
            Name = name;
            IsHost = isHost;
        }

        /// <summary>
        /// id
        /// </summary>
        [JsonProperty("id")]
        public long Id { get; set; }
        /// <summary>
        /// name
        /// </summary>
        [JsonProperty("name")]
        public string Name { get; set; }

        /// <summary>
        /// name
        /// </summary>
        [JsonProperty("isHost")]
        public bool IsHost { get; set; }
    }
}
