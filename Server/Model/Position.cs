using Newtonsoft.Json;

namespace GameServer.Model
{
    [JsonObject(MemberSerialization.OptIn)]
    public abstract class SyncObjectBase
    {
        [JsonProperty("tag")]
        public string Tag { get; set; }
        [JsonProperty("playerId")]
        public long PlayerId { get; set; }

        public long RoomId { get; set; }
    }

    [JsonObject(MemberSerialization.OptIn)]
    public class Position : SyncObjectBase
    {
        [JsonProperty("x")]
        public double X { get; set; }
        [JsonProperty("y")]
        public double Y { get; set; }
    }

    [JsonObject(MemberSerialization.OptIn)]
    public class PositionAndAngle : SyncObjectBase
    {
        [JsonProperty("x")]
        public double X { get; set; }
        [JsonProperty("y")]
        public double Y { get; set; }
        [JsonProperty("angle")]
        public double Angle { get; set; }
    }

    public class Angle : SyncObjectBase
    {
        [JsonProperty("angle")]
        public double Value { get; set; }
    }
}
