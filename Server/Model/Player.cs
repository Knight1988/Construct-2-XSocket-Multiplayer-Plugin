using Newtonsoft.Json;

namespace GameServer.Model
{
    [JsonObject(MemberSerialization.OptIn)]
    public class Player 
    {
        public Player(long id, string name)
        {
            Id = id;
            Name = name;
        }

        /// <summary>
        /// Id ng chơi
        /// </summary>
        [JsonProperty("id")]
        public long Id { get; set; }
        /// <summary>
        /// Tên người chơi
        /// </summary>
        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
