var videos = [];
var currentVideo = {};

function search() {  
  var q = $('#query').val();  
  var link = `https://www.googleapis.com/youtube/v3/search?maxResults=5&type=video&order=relevance&q=${q}&key=AIzaSyDIOVCAngpI-xPkb30W5c6ee0PSBV9KbF8&part=id%2Csnippet`;
  //console.log(link);  
  $.ajax({
    method:"GET",
    url:link,
    success:function(data){
      console.log(data);
      render(data);
    }
  })
}

$("#query").keyup(function(){search();});


function render(data){

  var results = data.items;

  var videosRaw = results.filter(function(v){
    return (v.id.kind === "youtube#video");
  });

  var videosParsed = videosRaw.map(function(v){
    video = {
      "title" : v.snippet.title,
      "videoId": v.id.videoId,
      "description": v.snippet.description,
      "thumbnail" : v.snippet.thumbnails.default.url,
      "channelId" : v.snippet.channelId,
      "channelTitle" : v.snippet.channelTitle,
      "publishedAt" : v.snippet.publishedAt
    }; 
    return video;
  });

  var html = "";
  videosParsed.forEach(function(v, i){
    html += `
    <div class="media">
      <div class="media-left">       
        <img class="media-object" src="${v.thumbnail}" alt="">
        <button class="btn btn-default custom-btn next-video" data-video="${v.videoId}">
          <span class="glyphicon glyphicon-play"></span>
        </button>        
      </div>
      <div class="media-body">
        <p class="media-heading video-title" data-video="${v.videoId}">
        <a href="#" class="next-video" data-video="${v.videoId}"> ${v.title} </a>
        </p>
        <label class="channel">${v.channelTitle}</label>              
      </div>
  </div>
  `;
  })

  $("#searches").html(html);  
  applyEvents();
  videos = videosParsed;
  loadVideo(videosParsed[0].videoId);
}

function getVideo(id){
  var vid;
  videos.forEach(function(v, i){
    console.log(v.videoId);
    if(v.videoId === id){      
      vid = v; 
    }
  });  
  return vid;
}

function loadVideo(id){
  currentVideo = getVideo(id);
  console.log(currentVideo);
  $("#current-video-title").text(currentVideo.title);
  $("#current-video-description").text(currentVideo.description);

  $("p.video-title").removeClass("video-title-active");
  $("p.video-title[data-video='"+id+"']").addClass("video-title-active");
  
  $("#main-video").html(`
    <div class="embed-responsive embed-responsive-16by9">
       <iframe src="//www.youtube.com/embed/${id}?autoplay=1&cc_load_policy=1&controls=1&enablejsapi=1&iv_load_policy=3&showinfo=0&rel=0&loop=0" class="embed-responsive-item" frameborder="0" allowfullscreen>
        </iframe>
    </div>   
  `);
}


function applyEvents(){
  $(".next-video").click(function(){
    loadVideo($(this).attr("data-video"));
  });
}

search();

