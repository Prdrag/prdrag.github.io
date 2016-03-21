var channels = [];
var anim_win = false;
var currentstreamer = "";
var oldstream = "";
var chatstatus = false;
function GetChannels(){
  var followURL = "https://api.twitch.tv/kraken/users/hndnisha/follows/channels?limit=100&callback=?";
  $.getJSON(followURL, function(f){
    for (var i = 0; i < f.follows.length; i++) {
      channels.push(f.follows[i].channel.display_name)
    }
    GetStreams();
  });
}

function slideOut(win){
    $('.stream_htmls').addClass('animated slideInDown');
    anim_win = true;
}


function GetStreams(){
  var x = 0;
  var viewicon = "images/viewers.png";
  // Ask twitch for the status of all channels at once
  $.ajax({
    url: "https://api.twitch.tv/kraken/streams",
    data: {"channel": channels.join(","), "limit": channels.length},
    cache: false,
    dataType: "jsonp"
    })
    .done(function (data) {
      // Build a hash of who's online for performance
      var streams = {};
      for (var i=0; i < data.streams.length; i++) {
      var channel = data.streams[i].channel;
      var stream = data.streams[i];
      var display_name = channel.display_name;
      var user_name = channel.name;
      var large = stream.preview.large;
      var logo = channel.logo;
      var game = stream.game;
      var status = channel.status;
      var viewers = stream.viewers;
      var followers = channel.followers;
      var rows = '';
      var row = '<div class="stream" id="' + x + '" onclick="openstream(' + x + ');">';
      row += '<img id="thumbid" src="' + large + '" class="img-responsive" alt="Responsive image">';
      row += '<div class="overlaybot"><img class="logoicon" src="' + logo + '"><div class="stream_title">' + display_name + '</div><div class="sttitle">' + status + '</div></div>';
      row += '<div class="overlaytop"><div class ="viewer"><img src="' + viewicon + '">' + viewers + '</div><div class="sgame">' + game + '</div></div></div>';
      row += '<input id="name' + x + '" value="' + user_name + '" type="hidden">'; 
      row += '<input id="show_name' + x + '" value="' + display_name + '" type="hidden">'; 
      row += '<input id="desc' + x + '" value="' + status + '" type="hidden">'; 
      rows += row;
      $('#streams').append(row);
      // $('#streams').slick('slickAdd', row);
      // var currentSlide = $('#streams').slick('slickCurrentSlide');
      x++;
    }
    })
    .fail(function () {
      // In the event of failure, wait 5 seconds and try again
      setTimeout(document.GetStreams, 5000);
    });
}

function openstream(attrib){
    var channel = document.getElementById("name" + attrib + "").value;
    var desc = document.getElementById("desc" + attrib + "").value;
    var show_name = document.getElementById("show_name" + attrib + "").value;
    var stream = ('<iframe class="videoplayer" src="http://player.twitch.tv/?channel=' + channel + '" height="95%" width="100%" frameborder="0" scrolling="no" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen=""></iframe>');   
    $("#mdl-layout__drawer").removeClass("is-visible");
    $(".mdl-layout__obfuscator").removeClass("is-visible");
    currentstreamer = channel;
    if(chatstatus == true){
      showchat();
    }
    document.getElementById('mdl-layout__drawer').setAttribute("aria-hidden","true")
    document.getElementById('stream_window').innerHTML = ("");
    document.getElementById('stream_window').innerHTML = (stream);
    document.getElementById('stream_window_title').innerHTML = ("");
    document.getElementById('stream_window_title').innerHTML = ("<b><div class='t_title'>" + show_name + "</b></div>" + "<div class='t_desc'>" + desc + "</div>");
    document.getElementById('close').innerHTML = ('<i class="material-icons" style="float: right; cursor: pointer; margin-top: 3px;" onclick="closestream();">close</i>');
    document.getElementById('chat_icon').innerHTML = ('<i class="material-icons" onclick="showchat();">textsms</i>');
}

function closestream(attrib){
    document.getElementById('stream_window').innerHTML = ("");
    document.getElementById('stream_window').innerHTML = ("<h1>Willkommen beim Streamtool!<h1><br/>Wähle rechts aus dem Menü einen Stream aus!");
    document.getElementById('stream_window_title').innerHTML = ("");
    document.getElementById('close').innerHTML = ("");
    document.getElementById('stream_chat').innerHTML = ("");
    if(chatstatus == true){
      document.getElementById('stream_chat').innerHTML = ("");
      document.getElementById('chat_icon').innerHTML = ("");
      document.getElementById("chat_icon").style.color = "#fff";
      document.getElementById("stream_window").style.width = "100%";
      chatstatus = false;
    }
}

function update(){
    document.getElementById('streams').innerHTML = ("");
    GetChannels();
}

function showchat(){
  var chat = ('<iframe class="chat" src="https://www.twitch.tv/'+ currentstreamer +'/chat?theme=dark" height="95%" width="20%" frameborder="0" scrolling="no"></iframe>');
  if (chatstatus == true && currentstreamer != oldstream){
    document.getElementById('stream_chat').innerHTML = ("");
    document.getElementById('stream_chat').innerHTML = (chat);
    chatstatus = true;
    oldstream = currentstreamer;
  }
  else if (chatstatus == false && currentstreamer != oldstream){
    document.getElementById("stream_window").style.width = "75%";
    document.getElementById("chat_icon").style.color = "#0E9000";
    document.getElementById('stream_chat').innerHTML = (chat);
    chatstatus = true;
    oldstream = currentstreamer;
  }
  else{
    document.getElementById('stream_chat').innerHTML = ("");
    document.getElementById("chat_icon").style.color = "#fff";
    document.getElementById("stream_window").style.width = "100%";
    chatstatus = false;
    oldstream = '';
  }
}

function twitchAUTH(){
  $.get( "https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=ibgi0jycf73wqfwn4cjs1zhcv5utn2g&redirect_uri=http://prdrag.github.io&scope=user_read", function( data ) {
    cosole.log(data);
  });
}



jQuery(document).ready(function() {
  twitchAUTH();
  GetChannels();
});
