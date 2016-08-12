using System.Threading.Tasks;
using GameServer.Model;

namespace GameServer.Controllers
{
    /// <summary>
    /// Implement/Override your custom actionmethods, events etc in this real-time MVC controller
    /// </summary>
    public class LingCorController : RoomController
    {
        public async Task UpdateObjectInfo(ObjectInfo[] objs)
        {
            await this.InvokeToRoomMate(objs, LingCorTopic.UpdateObjectInfo);
        }

        public async Task DestroyObjects(ObjectInfo[] objs)
        {
            await this.InvokeToRoomMate(objs, LingCorTopic.DestroyObjects);
        }
    }
}
