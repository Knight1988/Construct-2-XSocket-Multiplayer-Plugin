using Newtonsoft.Json;

namespace GameServer.Model
{
    [JsonObject(MemberSerialization.OptIn)]
    public class PeerMessage
    {
        public PeerMessage(string tag, object value)
        {
            Tag = tag;
            Value = value;
        }

        [JsonProperty("tag")]
        public string Tag { get; set; }
        [JsonProperty("value")]
        public object Value { get; set; }
    }
}
