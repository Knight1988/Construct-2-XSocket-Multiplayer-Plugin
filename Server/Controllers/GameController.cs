using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using GameServer.Model;
using XSockets.Core.XSocket;
using XSockets.Core.XSocket.Helpers;
using XSockets.Plugin.Framework.Attributes;

namespace GameServer.Controllers
{
    /// <summary>
    ///     Implement/Override your custom actionmethods, events etc in this real-time MVC controller
    /// </summary>
    public class GameController : XSocketController
    {
        private static readonly string Version = Assembly.GetAssembly(typeof(XSocketController)).GetName().Version.ToString();
        private static long _idCounter = 1;
        private static readonly List<Room> Rooms = new List<Room>();
        private Room _joinedRoom;
        private Player _me;

        public async Task<bool> LeaveRoom()
        {
            if (_joinedRoom != null)
            {
                // send leave room message
                await this.InvokeTo(p => p._joinedRoom == _joinedRoom && p._me != _me, "playerleaveroom");
                // remove player from room
                _joinedRoom.Players.Remove(_joinedRoom.Players.Single(p => p.Id == _me.Id));
                // remove room if player = 0
                if (_joinedRoom.Players.Count == 0) Rooms.Remove(_joinedRoom);
            }

            return true;
        }

        /// <summary>
        /// Join room
        /// </summary>
        /// <returns></returns>
        private async Task<JoinRoomResult> JoinRoom(Room room, string password)
        {
            if (room.Password != password) return new JoinRoomResult("Wrong password");

            if (room.MaxPlayer == room.Players.Count) return new JoinRoomResult("Room is full");

            var player = new Player(_me.Id, _me.Name);
            // add player to room
            room.Players.Add(player);
            // set current room
            _joinedRoom = room;
            // promote host
            await PromoteHost(player.Id);
            // send player joined room event
            await this.InvokeTo(p => p._joinedRoom == room && p._me.Id != _me.Id, player, "playerjoinedroom");

            return new JoinRoomResult(room);
        }

        public async Task PromoteHost(long playerId)
        {
            if (_joinedRoom == null) return;
            
            if (_joinedRoom.Players.Count == 1 || _joinedRoom.HostId == _me.Id)
            {
                _joinedRoom.HostId = playerId;
                await this.InvokeTo(p => p._me.Id == playerId, "promoteHost");
            }
        }

        /// <summary>
        /// Join a room, auto generate room name
        /// </summary>
        /// <param name="gameName">Game name</param>
        /// <param name="roomName">Room name</param>
        /// <param name="maxPlayers">Max players</param>
        /// <returns>Room info if success or message if failed</returns>
        public async Task<JoinRoomResult> AutoJoinRoom(string gameName, string roomName, int maxPlayers)
        {
            // find room with no password
            var room = Rooms.FirstOrDefault(p => p.Name == roomName && p.GameName == gameName && p.Password == string.Empty && !p.IsFull);

            // create new room if room not found or full
            if (room == null || room.IsFull) room = CreateRoom(gameName, GetUniqueRoomName(gameName, roomName), maxPlayers, string.Empty);

            // join the room
            return await JoinRoom(room, string.Empty);
        }

        /// <summary>
        /// Join a room, auto create room
        /// </summary>
        /// <param name="gameName"></param>
        /// <param name="roomName"></param>
        /// <param name="maxPlayers"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<JoinRoomResult> JoinOrCreateRoom(string gameName, string roomName, int maxPlayers, string password)
        {
            // find the room
            var room = Rooms.FirstOrDefault(p => p.Name == roomName && p.GameName == gameName)
                        // create room if not exist
                       ?? CreateRoom(gameName, roomName, maxPlayers, password);

            // Join the room
            return await JoinRoom(room, string.Empty);
        }

        /// <summary>
        /// Create room and join it
        /// </summary>
        /// <param name="gameName">Game name</param>
        /// <param name="roomName">Room name</param>
        /// <param name="maxPlayer">Max players</param>
        /// <param name="password">Room's password</param>
        /// <returns>Room info if success or message if failed</returns>
        private static Room CreateRoom(string gameName, string roomName, int maxPlayer,
            string password)
        {
            // Create room
            var room = new Room
            {
                GameName = gameName,
                Name = roomName,
                MaxPlayer = maxPlayer,
                Password = password
            };

            // Add to list
            Rooms.Add(room);

            return room;
        }

        /// <summary>
        /// Get unique room name
        /// </summary>
        /// <param name="gameName">Game name</param>
        /// <param name="roomName">Room name</param>
        /// <returns></returns>
        private static string GetUniqueRoomName(string gameName, string roomName)
        {
            var room = Rooms.Where(p => p.GameName == gameName && p.Name.StartsWith(roomName)).OrderByDescending(p => p).FirstOrDefault();

            if (room == null) return roomName;

            var match = Regex.Match(room.Name, @"(?<=(\D|^))\d+(?=\D*$)");
            if (match.Success)
            {
                var number = int.Parse(match.Value) + 1;
                return $"{room.Name.Substring(0, match.Index)}{number}{room.Name.Substring(match.Index + match.Length)}";
            }

            return roomName;
        }

        public async Task BroadCastMessage(string tag, object value)
        {
            if (_me.Id == 0) return;

            await this.InvokeTo(p => p._joinedRoom == _joinedRoom && p._me.Id != _me.Id, new PeerMessage(tag, value), "playermessage");
        }

        public async Task BroadCastPosition(Position position)
        {
            position.PlayerId = _me.Id;
            await this.InvokeTo(p => p._joinedRoom == _joinedRoom && p._me.Id != _me.Id, position, "playerposition");
        }

        public async Task BroadCastAngle(Angle angle)
        {
            angle.PlayerId = _me.Id;
            await this.InvokeTo(p => p._joinedRoom == _joinedRoom && p._me.Id != _me.Id, angle, "playerangle");
        }

        public async Task BroadCastPositionAndAngle(PositionAndAngle positionAndAngle)
        {
            positionAndAngle.PlayerId = _me.Id;
            await this.InvokeTo(p => p._joinedRoom == _joinedRoom && p._me.Id != _me.Id, positionAndAngle, "playerpositionandangle");
        }

        /// <summary>
        ///     Send message to a player in room
        /// </summary>
        /// <param name="playerId"></param>
        /// <param name="tag"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public async Task SendMessage(int playerId, string tag, object value)
        {
            if (_me.Id == 0 || playerId < 0) return;

            await
                this.InvokeTo(p => p._me.Id == playerId && p._joinedRoom == _joinedRoom, new PeerMessage(tag, value),
                    "playermessage");
        }

        public override async Task OnClosed()
        {
            await LeaveRoom();

            await base.OnClosed();
        }

        public override async Task OnOpened()
        {
            _me = new Player(_idCounter++, this.GetParameter("name"));
            await this.Invoke(new
            {
                me = _me,
                serverVersion = Version
            }, "connected");
            await base.OnOpened();
        }
    }
}