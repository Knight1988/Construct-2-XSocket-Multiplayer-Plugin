using System.Threading.Tasks;
using GameServer.Model;
using XSockets.Core.XSocket;

namespace GameServer.Controllers
{
    /// <summary>
    /// Implement/Override your custom actionmethods, events etc in this real-time MVC controller
    /// </summary>
    public partial class LingCorController
    {
        public async Task PlayerMessage(string tag, object value)
        {
            await this.InvokeToRoomMate(new
            {
                tag,
                value
            }, Topic.PlayerMessage);
        }
    }
}