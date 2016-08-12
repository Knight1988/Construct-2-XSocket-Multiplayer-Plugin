using Newtonsoft.Json;

namespace ServerController.Model
{
    [JsonObject(MemberSerialization.OptIn)]
    public class JoinRoomResult
    {
        /// <summary>
        /// Join room failed
        /// </summary>
        /// <param name="message"></param>
        public JoinRoomResult(string message)
        {
            Success = false;
            Message = message;
        }

        /// <summary>
        /// Join room success
        /// </summary>
        /// <param name="room"></param>
        public JoinRoomResult(Room room)
        {
            Success = true;
            Message = "Success";
            Room = room;
        }

        [JsonProperty("room")]
        public Room Room { get; set; }
        [JsonProperty("success")]
        public bool Success { get; set; }
        [JsonProperty("message")]
        public string Message { get; set; }
    }
}
