var Parse = require('parse-cloud-express').Parse;

// Send pushes block

Parse.Cloud.define("sendToDevice", function (request, response) {
    console.log('Run cloud function to forward message to user');
    // As with Parse-hosted Cloud Code, the user is available at: request.user
    // You can get the users session token with: request.user.getSessionToken()
    // Use the session token to run other Parse Query methods as that user, because
    //   the concept of a 'current' user does not fit in a Node environment.
    //   i.e.  query.find({ sessionToken: request.user.getSessionToken() })...

    var token = request.user.getSessionToken();
    //request.params.get
    var testObjectId = request.user.getSess;

    //response.success("Hello world! " + (request.params.a + request.params.b));

    Parse.Push.send({
        where: query,
        data: {
            alert: 'Check Send',
            badge: 1,
            sound: 'default'
        }
    }, {
        useMasterKey: true,
        success: function () {
            // Push sent!
            response.success("OK");
        },
        error: function (error) {
            // There was a problem :(
            response.success("Fail " + error);
        }
    });


});

Parse.Cloud.afterSave("ShowMatchWithUser", function (request) {

    //Create conversation with status active

    // For this user send push
    // NSDictionary *data=@{@"alert":[NSString stringWithFormat:@"You and %@ are a match!", [PFUser currentUser][@"firstName"]], @"badge":@"Increment", @"sound":@"default", @"WDPushType":@"WDPushTypeMatch"};

    //user == user.objectId

});


/*
 * Method to
 *
 * Android usage:
 HashMap<String,String> map = new HashMap<String, String>();
 map.put("PARAM1KEY","PARAM1VALUE");
 // here you can send parameters to your cloud code functions
 // such parameters can be the channel name, array of users to send a push to and more...

 ParseCloud.callFunctionInBackground("SendPush",map, new FunctionCallback<Object>() {

 @Override
 public void done(Object object, ParseException e) {
 // handle callback
 }
 });
 * */

Parse.Cloud.afterSave("SendPush", function (request) {

    var query = new Parse.Query(Parse.Installation);
    query.exists("deviceToken");
    //var itemQuery = new Parse.Query('Item');
    //itemQuery.equalTo('name', request.params.itemName);
    // here you can add other conditions e.g. to send a push to specific users or channel etc.

    var payload = {
        alert: "Message to device"
    };


    Parse.Push.send({
        data: payload,
        where: query
    }, {
        useMasterKey: true
    })
        .then(function () {
            response.success("Push Sent!");
        }, function (error) {
            response.error("Error while trying to send push " + error.message);
        });
});

/*
 * Method to send Message to all Android devices
 * Test from CURL
 * curl -X POST -H "X-Parse-Application-Id: 7IfmJE8zVqi6WkLgdku2wiw2JdaBa6qyBaExhTvt" -H "Content-Type: application/json" -d '{"action": "SEND_PUSH", "message": "Hello Android", "customData": "Android Data"}' https://weightsndates-server-dev.herokuapp.com:1337/parse/functions/pushChannelPipeTest
 * */
Parse.Cloud.define('pushChannelPipeTest', function (request, response) {

    // request has 2 parameters: params passed by the client and the authorized user
    var params = request.params;
    var user = request.user;

    // extract out the channel to send
    var action = params.action;
    var message = params.message;
    var customData = params.customData;

    // use to custom tweak whatever payload you wish to send
    var pushQuery = new Parse.Query(Parse.Installation);
    //pushQuery.equalTo("deviceType", "android");
    pushQuery.equalTo("objectId", "i4k7Y4m4d2");

    var payload = {
        "data": {
            "alert": message,
            "action": action,
            "customdata": customData
        }
    };

    // Note that useMasterKey is necessary for Push notifications to succeed.

    Parse.Push.send({
        data: payload,
        where: pushQuery,      // for sending to a specific channel                                                                                                                                 data: payload,
    }, {
        success: function () {
            console.log("PUSH OK");
        }, error: function (error) {
            console.log("PUSH ERROR" + error.message);
        }, useMasterKey: true
    });

    response.success('success');
});


Parse.Cloud.define("MatchWithUser", function (request) {

    var query = new Parse.Query(Parse.Installation);
    query.exists("deviceToken");
    //var itemQuery = new Parse.Query('Item');
    //itemQuery.equalTo('name', request.params.itemName);
    // here you can add other conditions e.g. to send a push to specific users or channel etc.

    var payload = {
        alert: "Message to device"
    };


    Parse.Push.send({
        data: payload,
        where: query
    }, {
        useMasterKey: true
    })
        .then(function () {
            response.success("Push Sent!");
        }, function (error) {
            response.error("Error while trying to send push " + error.message);
        });
});

Parse.Cloud.define("UsersRequest", function (request) {

    var query = new Parse.Query(Parse.Installation);
    query.exists("deviceToken");
    //var itemQuery = new Parse.Query('Item');
    //itemQuery.equalTo('name', request.params.itemName);
    // here you can add other conditions e.g. to send a push to specific users or channel etc.

    var payload = {
        alert: "Message to device"
    };


    Parse.Push.send({
        data: payload,
        where: query
    }, {
        useMasterKey: true
    })
        .then(function () {
            response.success("Push Sent!");
        }, function (error) {
            response.error("Error while trying to send push " + error.message);
        });
});


//CHAT BLOCK

//chat message on conversation on before save
Parse.Cloud.beforeSave("ProcessChatMessage", function(request, response) {
    var comment = request.object.get("message");

    //CHECK SIZE AND SET MESSAGE SHORTER if it so big before SAVE
    if (comment.length > 1000) {
        // Truncate and add a ...
        request.object.set("message", comment.substring(0, 999) + "...");
    }
    response.success();
});


//TEST BLOCK

Parse.Cloud.beforeSave('TestObject', function (request, response) {
    console.log('Ran beforeSave on objectId: ' + request.object.id);
    // if update the request object, we need to send it back with the response
    response.success(request.object);
});

Parse.Cloud.afterSave('TestObject', function (request, response) {
    console.log('Ran afterSave on objectId: ' + request.object.id);
});

Parse.Cloud.beforeDelete('TestObject', function (request, response) {
    console.log('Ran beforeDelete on objectId: ' + request.object.id);
    response.success();
});

Parse.Cloud.afterDelete('TestObject', function (request, response) {
    console.log('Ran afterDelete on objectId: ' + request.object.id);
});
