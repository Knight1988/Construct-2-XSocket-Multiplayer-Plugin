using System.Reflection;
using System.Threading.Tasks;
using GameServer.Model;
using XSockets.Core.XSocket;
using XSockets.Core.XSocket.Helpers;

namespace GameServer.Controllers
{
    /// <summary>
    /// Implement/Override your custom actionmethods, events etc in this real-time MVC controller
    /// </summary>
    public class PlayerController : XSocketController
    {
        protected static readonly string Version = Assembly.GetAssembly(typeof(XSocketController)).GetName().Version.ToString();
        protected static long IdCounter = 1;
        protected internal Player Me;

        public override async Task OnOpened()
        {
            // create new id
            Me = new Player(IdCounter++, this.GetParameter("name"));
            // invoke connected event
            await this.Invoke(new
            {
                me = Me,
                serverVersion = Version
            }, "connected");
            await base.OnOpened();
        }
    }
}
