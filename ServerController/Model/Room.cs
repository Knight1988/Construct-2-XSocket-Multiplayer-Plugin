using System.Collections.Generic;
using Newtonsoft.Json;

namespace ServerController.Model
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

        [JsonProperty("playerJoined")]
        public Player PlayerJoined { get; set; }

        [JsonProperty("playerLeft")]
        public Player PlayerLeft { get; set; }

        public string Password { get; set; }

        [JsonProperty("players")]
        public List<Player> Players { get; } = new List<Player>();

        public List<RoomController> PlayerControllers { get; } = new List<RoomController>();

        public Room(string gameName, string roomName, int maxPlayers, string password)
        {
            GameName = gameName;
            Name = roomName;
            MaxPlayer = maxPlayers;
            Password = password;
        }

        public void AddPlayer(RoomController controller)
        {
            Players.Add(controller.Me);
            PlayerControllers.Add(controller);
            PlayerJoined = controller.Me;
        }

        public void RemovePlayer(RoomController controller)
        {
            Players.Remove(controller.Me);
            PlayerControllers.Remove(controller);
            PlayerLeft = controller.Me;
        }
    }
}