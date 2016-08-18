using Newtonsoft.Json;

namespace GameServer.Model
{
    [JsonObject(MemberSerialization.OptIn)]
    public class ObjectVariable
    {
        [JsonProperty("syncId")]
        public int SyncId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("index")]
        public int Index { get; set; }

        [JsonProperty("value")]
        public object Value { get; set; }
    }
}