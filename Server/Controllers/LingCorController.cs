using System.Threading.Tasks;
using GameServer.Model;
using XSockets.Core.XSocket;

namespace GameServer.Controllers
{
    /// <summary>
    /// Implement/Override your custom actionmethods, events etc in this real-time MVC controller
    /// </summary>
    public partial class LingCorController : XSocketController
    {
        public async Task UpdateObjectInfo(ObjectInfo[] objs)
        {
            await this.InvokeToRoomMate(objs, LingCorTopic.UpdateObjectInfo);
        }
        public async Task UpdateObjectVariable(ObjectVariable[] objs)
        {
            await this.InvokeToRoomMate(objs, LingCorTopic.UpdateObjectVariable);
        }

        public async Task DestroyObjects(ObjectInfo[] objs)
        {
            await this.InvokeToRoomMate(objs, LingCorTopic.DestroyObjects);
        }
    }
}
