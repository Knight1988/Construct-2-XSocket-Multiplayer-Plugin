using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using GameServer.Model;
using XSockets.Core.XSocket;
using XSockets.Core.XSocket.Helpers;

namespace GameServer.Controllers
{
    /// <summary>
    /// Implement/Override your custom actionmethods, events etc in this real-time MVC controller
    /// </summary>
    public partial class LingCorController
    {
        protected static readonly List<Room> Rooms = new List<Room>();
        protected internal Room JoinedRoom;
        protected bool IsHost => JoinedRoom == null || JoinedRoom.HostId == Me.Id;

        private static Room CreateRoom(string gameName, string roomName, int maxPlayers, string password)
        {
            // Create room
            var room = new Room(gameName, roomName, maxPlayers, password);

            // Add to list
            Rooms.Add(room);

            return room;
        }

        public async Task<JoinRoomResult> JoinOrCreateRoom(string gameName, string roomName, int maxPlayers, string password)
        {
            var room = Rooms.SingleOrDefault(p => p.GameName == gameName && p.Name == roomName) ??
                       CreateRoom(gameName, roomName, maxPlayers, password);

            return await JoinRoom(room, password);
        }

        public async Task<JoinRoomResult> AutoJoinRoom(string gameName, string roomName, int maxPlayers)
        {
            var room = Rooms.SingleOrDefault(p => p.GameName == gameName && p.Name == roomName && p.Password == string.Empty) ??
                       CreateRoom(gameName, roomName, maxPlayers, string.Empty);

            if (room.IsFull) return await JoinOrCreateRoom(gameName, GetUniqueRoomName(gameName, roomName), maxPlayers, string.Empty);

            return await JoinRoom(room, string.Empty);
        }

        private async Task<JoinRoomResult> JoinRoom(Room room, string password)
        {
            if (room.Players.Count == room.MaxPlayer) return new JoinRoomResult("Room is full.");

            if (room.Password != password) return new JoinRoomResult("Incorrect password.");

            JoinedRoom = room;
            JoinedRoom.AddPlayer(this);

            // set first player as host
            if (JoinedRoom.HostId == 0) JoinedRoom.HostId = JoinedRoom.Players[0].Id;

            await this.InvokeToRoomMate(JoinedRoom, Topic.PlayerJoined);

            return new JoinRoomResult(room);
        }

        public async Task<JoinRoomResult> JoinRoom(string gameName, string roomName, string password)
        {
            if (JoinedRoom != null)
            {
                return new JoinRoomResult("User in room, must leave room first.");
            }

            var room = Rooms.SingleOrDefault(p => p.GameName == gameName && p.Name == roomName);

            if (room == null) return new JoinRoomResult("Room does not exist.");

            return await JoinRoom(room, password);
        }

        public async Task PromoteHost(long playerId)
        {
            if (JoinedRoom == null) return;

            if (IsHost)
            {
                var player = JoinedRoom.Players.SingleOrDefault(p => p.Id == playerId);
                if (player == null) return;

                JoinedRoom.HostId = playerId;
                await this.InvokeToRoom(JoinedRoom.HostId, Topic.HostChanged);
            }
        }

        /// <summary>
        /// Get unique room name
        /// </summary>
        /// <param name="gameName">Game name</param>
        /// <param name="roomName">Room name</param>
        /// <returns></returns>
        private static string GetUniqueRoomName(string gameName, string roomName)
        {
            var room = Rooms.Where(p => p.GameName == gameName && p.Name.StartsWith(roomName)).OrderByDescending(p => p.Name).FirstOrDefault();

            if (room == null) return roomName;

            var match = Regex.Match(room.Name, @"(?<=(\D|^))\d+(?=\D*$)");
            if (match.Success)
            {
                var number = int.Parse(match.Value) + 1;
                return $"{room.Name.Substring(0, match.Index)}{number}{room.Name.Substring(match.Index + match.Length)}";
            }

            return roomName;
        }

        public async Task<bool> LeaveRoom()
        {
            JoinedRoom.RemovePlayer(this);
            
            // set first player as host
            if (IsHost && JoinedRoom.Players.Count > 0) await PromoteHost(JoinedRoom.Players[0].Id);
            
            // remove empty room
            if (JoinedRoom.Players.Count == 0) Rooms.Remove(JoinedRoom);

            await this.InvokeToRoomMate(JoinedRoom, Topic.PlayerLeft);

            JoinedRoom = null;

            return true;
        }

        public override async Task OnClosed()
        {
            await LeaveRoom();
            await base.OnClosed();
        }
    }

    public static class RoomControllerExtension
    {
        public static async Task InvokeToRoomMate(this LingCorController controller, object obj, string name)
        {
            if (controller.JoinedRoom == null) return;

            foreach (var roomController in controller.JoinedRoom.PlayerControllers)
            {
                if (controller.Me == roomController.Me) continue;

                await roomController.Invoke(obj, name);
            }
        }

        public static async Task InvokeToRoomMate(this LingCorController controller, string name)
        {
            if (controller.JoinedRoom == null) return;

            foreach (var roomController in controller.JoinedRoom.PlayerControllers)
            {
                if (controller.Me == roomController.Me) continue;

                await roomController.Invoke(name);
            }
        }

        public static async Task InvokeToRoom(this LingCorController controller, object obj, string name)
        {
            if (controller.JoinedRoom == null) return;

            foreach (var roomController in controller.JoinedRoom.PlayerControllers)
            {
                await roomController.Invoke(obj, name);
            }
        }

        public static async Task InvokeToRoom(this LingCorController controller, string name)
        {
            if (controller.JoinedRoom == null) return;

            foreach (var roomController in controller.JoinedRoom.PlayerControllers)
            {
                await roomController.Invoke(name);
            }
        }
    }
}
