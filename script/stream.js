var channels = [];
var anim_win = false;
var currentstreamer = "";
var oldstream = "";
var chatstatus = false;
var LoggedUser = "";

function slideOut(win) {
    jQuery('.stream_htmls').addClass('animated slideInDown');
    anim_win = true;
}

function GetStreams() {
    var x = 0;
    var viewicon = "images/viewers.png";
    // Ask twitch for the status of all channels at once
    for (var i = 0; i < channels.length; i++) {
        $.ajax({
            type: 'GET',
            url: 'https://api.twitch.tv/kraken/streams/' + channels[i],
            headers: {
                'Client-ID': 'ibgi0jycf73wqfwn4cjs1zhcv5utn2g'
            },
            success: function(data) {              
                    console.log(data);
                    if (data.stream == null){
                        var display_name = data.display_name;
                        var user_name = data.name;
                        var large = data.preview.large;
                        var logo = data.logo;
                        var game = data.game;
                        var status = data.status;
                        var viewers = data.viewers;
                        var followers = data.followers;
                        var rows = '';
                        var row = '<div class="stream" id="' + x + '" onclick="openstream(' + x + ');">';
                        row += '<img id="thumbid" src="' + large + '" class="img-responsive" alt="Responsive image">';
                        row += '<div class="overlaybot"><img class="logoicon" src="' + logo + '"><div class="stream_title">' + display_name + '</div><div class="sttitle">' + status + '</div></div>';
                        row += '<div class="overlaytop"><div class ="viewer"><img src="' + viewicon + '">' + viewers + '</div><div class="sgame">' + game + '</div></div></div>';
                        row += '<input id="name' + x + '" value="' + user_name + '" type="hidden">';
                        row += '<input id="show_name' + x + '" value="' + display_name + '" type="hidden">';
                        row += '<input id="desc' + x + '" value="' + status + '" type="hidden">';
                        rows += row;
                        jQuery('#streams').append(row);
                        x++;
                    }
            }
        });
    }
}

function openstream(attrib) {
    var channel = document.getElementById("name" + attrib + "").value;
    var desc = document.getElementById("desc" + attrib + "").value;
    var show_name = document.getElementById("show_name" + attrib + "").value;
    var stream = ('<iframe class="videoplayer" src="http://player.twitch.tv/?channel=' + channel + '" height="95%" width="100%" frameborder="0" scrolling="no" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen=""></iframe>');
    jQuery("#mdl-layout__drawer").removeClass("is-visible");
    jQuery(".mdl-layout__obfuscator").removeClass("is-visible");
    currentstreamer = channel;
    if (chatstatus == true) {
        showchat();
    }
    document.getElementById('mdl-layout__drawer').setAttribute("aria-hidden", "true")
    document.getElementById('stream_window').innerHTML = ("");
    document.getElementById('stream_window').innerHTML = (stream);
    document.getElementById('stream_window_title').innerHTML = ("");
    document.getElementById('stream_window_title').innerHTML = ("<b><div class='t_title'>" + show_name + "</b></div>" + "<div class='t_desc'>" + desc + "</div>");
    document.getElementById('close').innerHTML = ('<i class="material-icons" onclick="closestream();">close</i>');
    document.getElementById('chat_icon').innerHTML = ('<i class="material-icons" onclick="showchat();">textsms</i>');
}

function closestream(attrib) {
    document.getElementById('stream_window_title').innerHTML = ("");
    document.getElementById('close').innerHTML = ("");
    document.getElementById('stream_chat').innerHTML = ("");
    if (chatstatus == true) {
        document.getElementById('stream_chat').innerHTML = ("");
        document.getElementById('chat_icon').innerHTML = ("");
        document.getElementById("chat_icon").style.color = "#fff";
        document.getElementById("stream_window").style.width = "100%";
        chatstatus = false;
    }
}

function update() {
    document.getElementById('streams').innerHTML = ("");
    twitch();
}

function showchat() {
    var chat = ('<iframe class="chat" src="https://www.twitch.tv/' + currentstreamer + '/chat?theme=dark" height="95%" width="20%" frameborder="0" scrolling="no"></iframe>');
    if (chatstatus == true && currentstreamer != oldstream) {
        document.getElementById('stream_chat').innerHTML = ("");
        document.getElementById('stream_chat').innerHTML = (chat);
        chatstatus = true;
        oldstream = currentstreamer;
    } else if (chatstatus == false && currentstreamer != oldstream) {
        document.getElementById("stream_window").style.width = "75%";
        document.getElementById("chat_icon").style.color = "#0E9000";
        document.getElementById('stream_chat').innerHTML = (chat);
        chatstatus = true;
        oldstream = currentstreamer;
    } else {
        document.getElementById('stream_chat').innerHTML = ("");
        document.getElementById("chat_icon").style.color = "#fff";
        document.getElementById("stream_window").style.width = "100%";
        chatstatus = false;
        oldstream = '';
    }
}

function twitch(){
    Twitch.api({
        method: 'user'
    }, function(error, user) {
        if (error) console.log("ERROR");
        var channel = "";
        Twitch.api({
            method: 'users/' + user.name + '/follows/channels/' + channel,
            limit: 50          
        }, function(error, response) {
            if (error) console.log(error);

            if (response){
                // GetChannels(user.name);
                document.getElementById('welcome').innerHTML = ('<b>Hallo ' + user.display_name + '!</b></br> Du kannst oben links auf den Menü Button klicken, um einen Stream auszuwählen!');
                for (var i = 0; i < response.follows.length; i++) {
                    channels.push(response.follows[i].channel.display_name)
                }
                GetStreams();
            } 
        });
    });
}

 jQuery('#exit_icon').click(function() {
    Twitch.logout();
    window.location = window.location.pathname
  })


jQuery(document).ready(function() {
    Twitch.init({
        clientId: "ibgi0jycf73wqfwn4cjs1zhcv5utn2g"
    }, function(error, status) {
        if (status.authenticated) {
            jQuery('.authenticate').addClass('hidden');
            document.getElementById('exit_icon').innerHTML = ('<i class="material-icons">exit_to_app</i>');
        } else {
            jQuery('.authenticate').removeClass('hidden');
        }
    });
    

    jQuery('.twitch-connect').click(function() {
        Twitch.login({
            scope: ['user_read', 'channel_read']
        });
    })
    twitch();
});
