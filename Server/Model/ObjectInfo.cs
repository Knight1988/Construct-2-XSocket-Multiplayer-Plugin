using Newtonsoft.Json;

namespace GameServer.Model
{
    [JsonObject(MemberSerialization.OptIn)]
    public class ObjectInfo
    {
        [JsonProperty("syncId")]
        public int SyncId { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("x")]
        public double X { get; set; }
        [JsonProperty("y")]
        public double Y { get; set; }
        [JsonProperty("layer")]
        public string Layer { get; set; }
        [JsonProperty("visible")]
        public bool Visible { get; set; }
        [JsonProperty("tick")]
        public long Tick { get; set; }

    }
}
