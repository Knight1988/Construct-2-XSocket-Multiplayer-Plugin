function GetPluginSettings()
{
	return {
		"name":			"LingCor Multiplayer",	// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"lingcor_multiplayer",	// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0.3",						// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Create real-time multiplayer online games using XSocket Javascript V6.",
		"author":		"Squall Leonhart",
		"help url":		"http://lingcor.net",
		"category":		"Web",						// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",					// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	true,						// only used when "type" is "world".  Enables an angle property on the object.
		"dependency": "xsockets.latest.js;entities.js;client.js;room-client.js;game-client.js;lingcor-client.js",
		"flags":		0							// uncomment lines to enable flags...
						| pf_singleglobal			// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture				// object has a single texture (e.g. tiled background)
					//	| pf_position_aces			// compare/set/get x, y...
					//	| pf_size_aces				// compare/set/get width, height...
					//	| pf_angle_aces				// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces		// compare/set/get visible, opacity...
					//	| pf_tiling					// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations				// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces			// move to top, bottom, layer...
					//  | pf_nosize					// prevent resizing in the editor
					//	| pf_effects				// allow WebGL shader effects to be added
					//  | pf_predraw				// set for any plugin which draws and is not a sprite (i.e. does not simply draw
													// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name

// Connected
AddCondition(0, cf_trigger, "On connected", "Signalling", "On connected", "Triggered when successfully connected to the signalling server.", "OnConnected");

// Room joined
AddCondition(1, cf_trigger, "On joined room", "Signalling", "On joined room", "Triggered upon successfully joining a room.", "OnJoinedRoom");

// Leave room
AddCondition(2, cf_trigger, "On left room", "Signalling", "On left room", "Triggered upon successfully leaving a room.", "OnLeftRoom");

// Player connected
AddCondition(3, cf_trigger, "On player joined room", "Room", "On player joined room", "Triggered when a player joined room.", "OnPlayerJoinedRoom");

// Check if is host
AddCondition(4, cf_none, "Is host", "Room", "Is host", "True if host of the current room.", "IsHost");

// on message received
AddStringParam("Tag", "The tag to identify the message type.");
AddCondition(5, cf_trigger, "On player message", "Room", "On player message <i>{0}</i>", "Triggered when received a message with a specific tag from a player.", "OnPlayerMessage");

// on player left room
AddCondition(7, cf_trigger, "On player left room", "Room", "On player left room", "Trigger when a player leave room.", "OnPlayerLeftRoom");

// on host changed
AddCondition(8, cf_trigger, "On room's host is changed", "Room", "On room's host is changed", "Trigger when a player become new host.", "OnHostChanged");

// on object created
AddCondition(9, cf_trigger, "On object created", "Game", "On object created", "Trigger when an object created by this plugin.", "OnObjectCreated");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// Connect to server
AddStringParam("Server", "The signalling server URL to connect to.", "\"ws://localhost:4502\"");
AddStringParam("Name", "The desired name to use on the server.");
AddAction(0, af_none, "Connect", "Signalling", "Connect to signalling server <b>{0}</b> (name: <i>{1}<i>)", "Connect to a signalling server to be able to join rooms.", "Connect");

// Join room
AddStringParam("Game", "A string uniquely identifying this game on the server. To help ensure uniqueness, include your reverse domain, e.g. \"net.example.MyGame\".", "\"net.example.MyGame\"");
AddStringParam("Room", "The name of the room to request joining.");
AddNumberParam("Max players", "The maximum number of players that can join this room. Only the host's value is used. Leave 0 for unlimited.");
AddStringParam("Password", "Password to join room.");
AddAction(1, af_none, "Join room", "Room", "Join room <b>{1}</b> for game <i>{0}</i> (max peers: <i>{2}</i>, password: <i>{3}<i>)", "Once logged in, join a room to meet other players.", "JoinRoom");

// Auto join room
AddStringParam("Game", "A string uniquely identifying this game on the server. To help ensure uniqueness, include you or your company's name, e.g. \"net.example.MyGame\".", "\"net.example.MyGame\"");
AddStringParam("First room", "The name of the first room to request joining. If the room is full, subsequent rooms will be checked (\"room\", \"room2\", \"room3\"...).");
AddNumberParam("Max peers", "The number of peers per room. Once full, later peers will be sent to the next room.", "2");
AddAction(2, af_none, "Auto-join room", "Room", "Auto-join from room <b>{1}</b> for game <i>{0}</i> (max peers: <i>{2}</i>)", "Join the first room which is not full.", "AutoJoinRoom");

// Leave room
AddAction(3, af_none, "Leave room", "Room", "Leave room", "Request to leave the current room on the signalling server. Player connections are not affected.", "LeaveRoom");

// Broadcast message
AddStringParam("Tag", "A tag to identify this kind of message.");
AddAnyTypeParam("Message", "The message data to send.");
AddAction(4, af_none, "Broadcast message", "Room", "Broadcast tag <i>{0}</i> message <b>{1}</b>", "Send a message every player in the room.", "BroadcastMessage");

// Update object info
AddObjectParam("Object", "Object to update.")
AddAction(5, af_none, "Update object info", "Game", "Update object {0}", "Update object to other player.", "UpdateObjectInfo");

// Promote host
AddNumberParam("Player Id", "Id of player to promote.")
AddAction(6, af_none, "Promote a player into host", "Game", "Promote player {0}", "Promote a player into host.", "PromoteHost");

// Destroy object
AddObjectParam("Object", "Object to destroy.")
AddAction(7, af_none, "Destroy object", "Game", "Destroy object {0}", "Destroy object in both host and player.", "DestroyObject");

// Sync object
AddObjectParam("Object", "Object to sync.")
AddAction(8, cf_deprecated, "Sync object", "Game", "Sync object {0}", "Sync object to other player.", "SyncObject");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "", "Signalling", "ConnectionUrl", "The URL of the current connecting server.");
AddExpression(1, ef_return_string, "", "Signalling", "ServerVersion", "The version of the current connecting server.");
AddExpression(2, ef_return_string, "", "Signalling", "ApiVersion", "The version of the current api.");
AddExpression(3, ef_return_string, "", "Signalling", "MyName", "The name for the current user.");
AddExpression(4, ef_return_string, "", "Signalling", "CurrentGame", "The current game name joined.");
AddExpression(5, ef_return_string, "", "Signalling", "CurrentRoom", "The current room joined.");
AddExpression(6, ef_return_any, "", "Room", "Message", "The message received in a message trigger.");
AddExpression(7, ef_return_number, "", "Room", "MyId", "The id of me.");
AddExpression(8, ef_return_number, "", "Room", "MyName", "My name.");
AddExpression(9, ef_return_number, "", "Room", "LeftPlayerId", "The id of player who left room.");
AddExpression(10, ef_return_string, "", "Room", "LeftPlayerName", "The name of player who left room.");
AddExpression(11, ef_return_number, "", "Room", "JoinedPlayerId", "The id of player who joined room.");
AddExpression(12, ef_return_string, "", "Room", "JoinedPlayerName", "The name of player who joined room.");


////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	//new cr.Property(ept_integer, 	"My property",		77,		"An example property.")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}