using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GameServer.Controllers;
using Newtonsoft.Json;

namespace GameServer.Model
{
    [JsonObject(MemberSerialization.OptIn)]
    public class Room
    {
        [JsonProperty("gameName")]
        public string GameName { get; set; }
        [JsonProperty("roomName")]
        public string Name { get; set; }
        [JsonProperty("maxPlayer")]
        public int MaxPlayer { get; set; }
        [JsonProperty("isFull")]
        public bool IsFull => Players.Count == MaxPlayer;
        public string Password { get; set; }
        [JsonProperty("players")]
        public List<Player> Players { get; } = new List<Player>();
    }
}
