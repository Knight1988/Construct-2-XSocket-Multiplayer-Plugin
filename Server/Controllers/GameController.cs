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
    ///     Implement/Override your custom actionmethods, events etc in this real-time MVC controller
    /// </summary>
    public class GameController : XSocketController
    {
        private static long _idCounter = 1;
        private static readonly List<Room> Rooms = new List<Room>();
        private Room _joinedRoom;
        private Player _me;

        public async Task LeaveRoom()
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
        }

        /// <summary>
        /// Join room
        /// </summary>
        /// <param name="gameName">Game name</param>
        /// <param name="roomName">Room name</param>
        /// <param name="password">Room's password</param>
        /// <returns></returns>
        public async Task<JoinRoomResult> JoinRoom(string gameName, string roomName, string password)
        {
            var room = Rooms.FirstOrDefault(p => p.Name == roomName && p.GameName == gameName);

            if (room == null) return new JoinRoomResult("Room not exist");

            if (room.Password != password) return new JoinRoomResult("Wrong password");

            if (room.MaxPlayer == room.Players.Count) return new JoinRoomResult("Room is full");

            var player = new Player(_me.Id, _me.Name);
            // add player to room
            room.Players.Add(player);
            // set current room
            _joinedRoom = room;
            // send player joined room event
            await this.InvokeTo(p => p._joinedRoom == room && p._me.Id != _me.Id, player, "playerjoinedroom");

            return new JoinRoomResult(room);
        }

        /// <summary>
        /// Join a room, auto create room
        /// </summary>
        /// <param name="gameName">Game name</param>
        /// <param name="roomName">Room name</param>
        /// <param name="maxPlayer">Max players</param>
        /// <returns>Room info if success or message if failed</returns>
        public async Task<JoinRoomResult> AutoJoinRoom(string gameName, string roomName, int maxPlayer)
        {
            var room = Rooms.FirstOrDefault(p => p.Name == roomName && p.GameName == gameName && p.Password == string.Empty && !p.IsFull);

            if (room == null || room.IsFull) return await CreateAndJoinRoom(gameName, GetUniqueRoomName(gameName, roomName), maxPlayer, string.Empty);

            return await JoinRoom(room.GameName, room.Name, string.Empty);
        }

        /// <summary>
        /// Create room and join it
        /// </summary>
        /// <param name="gameName">Game name</param>
        /// <param name="roomName">Room name</param>
        /// <param name="maxPlayer">Max players</param>
        /// <param name="password">Room's password</param>
        /// <returns>Room info if success or message if failed</returns>
        public async Task<JoinRoomResult> CreateAndJoinRoom(string gameName, string roomName, int maxPlayer,
            string password)
        {
            if (Rooms.Any(p => p.Name == roomName && p.GameName == gameName)) return new JoinRoomResult("Room is exist");

            var room = new Room
            {
                GameName = gameName,
                Name = roomName,
                MaxPlayer = maxPlayer,
                Password = password
            };

            Rooms.Add(room);

            return await JoinRoom(room.GameName, room.Name, password);
        }

        /// <summary>
        /// Get unique room name
        /// </summary>
        /// <param name="gameName">Game name</param>
        /// <param name="roomName">Room name</param>
        /// <returns></returns>
        private string GetUniqueRoomName(string gameName, string roomName)
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
            await this.Invoke(_me, "connected");
            await base.OnOpened();
        }
    }
}