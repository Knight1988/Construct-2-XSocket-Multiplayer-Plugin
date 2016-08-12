// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.xsockets_multiplayer = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.xsockets_multiplayer.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		var self = this;
		var client = self.client = new XSocketWrapper();

		client.onConnected = function (player) {
			self.runtime.trigger(cr.plugins_.xsockets_multiplayer.prototype.cnds.OnConnected, self);
		};

        client.onRoomJoined = function() {
            self.runtime.trigger(cr.plugins_.xsockets_multiplayer.prototype.cnds.OnRoomJoined, self);
        }

        client.onRoomLeft = function() {
            self.runtime.trigger(cr.plugins_.xsockets_multiplayer.prototype.cnds.OnRoomLeft, self);
        }

        client.onPlayerJoinedRoom = function() {
            self.runtime.trigger(cr.plugins_.xsockets_multiplayer.prototype.cnds.OnPlayerJoinedRoom, self);
        }

        client.onPlayerMessage = function (message) {
            self.tag = message.tag;
            self.message = message.value;
            self.runtime.trigger(cr.plugins_.xsockets_multiplayer.prototype.cnds.OnPlayerMessage, self);
        }
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// XSocket connected event
	Cnds.prototype.OnConnected = function ()
	{
		return true;
	};

    // room joined event
	Cnds.prototype.OnRoomJoined = function () {
	    return true;
	};

    // room joined event
	Cnds.prototype.OnRoomLeft = function () {
	    return true;
	};

    // player joined event
	Cnds.prototype.OnPlayerJoinedRoom = function () {
	    return true;
	};

    // check if player is host
	Cnds.prototype.IsHost = function () {
	    return this.client.room.hostId == this.client.me.id;
	};

    // on player message
	Cnds.prototype.OnPlayerMessage = function (tag) {
	    return this.tag == tag;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	// connect to server
	Acts.prototype.Connect = function (url, name)
	{
		this.client.connect(url, name);
	};
	
	// join room
	Acts.prototype.JoinRoom = function (gameName, roomName, maxPlayers, password)
	{
	    this.client.joinRoom(gameName, roomName, maxPlayers, password);
	};
	
	// auto join room
	Acts.prototype.AutoJoinRoom = function (gameName, roomName, maxPlayers)
	{
	    this.client.autoJoinRoom(gameName, roomName, maxPlayers);
	};
	
	// leave room
	Acts.prototype.LeaveRoom = function ()
	{
	    this.client.leaveRoom();
	};
	
	// Broadcast message
	Acts.prototype.BroadcastMessage = function (tag, message)
	{
	    this.client.broadcastMessage(tag, message);
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the connection url
	Exps.prototype.ConnectionUrl = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.client.connectionUrl);	// return our value
	};
	
	// the server version
	Exps.prototype.ServerVersion = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.client.serverVersion);	// return our value
	};
	
	// the api version
	Exps.prototype.ApiVersion = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.client.apiVersion);	// return our value
	};

    // The name for the current user.
	Exps.prototype.MyName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.client.me.name);	// return our value
	};

    // The current game name joined.
	Exps.prototype.CurrentGame = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.client.room.gameName);	// return our value
	};

    // The current room joined.
	Exps.prototype.CurrentRoom = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.client.room.name);	// return our value
	};

    // The current room joined.
	Exps.prototype.Message = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_any(this.message);	// return our value
	};
	
	pluginProto.exps = new Exps();

}());