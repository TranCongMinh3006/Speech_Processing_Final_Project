const apiKey = "AIzaSyDAzTTFzcXJgc78HR6IlwfuxQ5pHOBvGfM";
const baseUrl = 'https://www.googleapis.com/youtube/v3/';

$(document).ready(function () {
  $('.preloader-wrapper').hide();
  $('#song_name').hide();
});

navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
    handlerFunction(stream)
});

const handleSearchTopVideo = (title = 'lalung') => {
  const url = `${baseUrl}search?key=${apiKey}&type=video&part=snippet&q=${title}&maxResults=5`;
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    cache: false,
    success: function(result) {
      console.log(result.items)
      $('.videos-wrapper').prepend(`<h3 class="text-center font-italic">Nghe thử bài hát</h3>`)
      result.items.forEach(item => {
        const video = `
        <iframe style="margin: 20px; border-radius: 5px;" width="400" height="200" src="https://www.youtube.com/embed/${item.id.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `
        $('#videos').append(video)
      })
    }
  })
}

const handleSearch = (title = 'lalung') => {
  const url = `${baseUrl}search?key=${apiKey}&type=video&part=snippet&q=${title}&maxResults=5`;
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    cache: false,
    success: function(result) {
      console.log(result.items)
      $('.videos-wrapper').prepend(`<h3 class="text-center font-italic">Nghe thử bài hát</h3>`)
      result.items.forEach(item => {
        const video = `
        <iframe style="margin: 20px; border-radius: 5px;" width="400" height="200" src="https://www.youtube.com/embed/${item.id.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `
        $('#videos').append(video)
      })
    }
  })
}

handleSearch('lalung')

function handlerFunction(stream) {
  rec = new MediaRecorder(stream);
  rec.ondataavailable = e => {
    audioChunks.push(e.data);
    if (rec.state == "inactive"){
      let blob = new Blob(audioChunks,{type:'audio/mp3'});
      sendData(blob)
    }
  }
}
function sendData(data) {
  let fd = new FormData();
  fd.append('data', data);
  $.ajax({
    type: 'POST',
    url: '/upload',
    data: fd,
    processData: false,
    contentType: false,
    cache: false,
    beforeSend: function(){
      $('.preloader-wrapper').show();
    },
    complete: function(){
      $('.preloader-wrapper').hide();
    },
    success: function (response) {
      if(response.success == false)
      {
        alert(response.error);
      }
      else
      {
        console.log(response.song_name);
        let song_name = response.song_name;
        let item = '<h2 class="font-italic text-center h2 my-5" id="song_name" style="color: #333" >' + song_name + '</h2>';
        $('#container-body').append(item);
        $('#song_name').show();
        handleSearch(song_name);
      }
    }
  }).done(function(data) {
    console.log(data);
  });
}

$('#record').on('click', function () {
  $('#song_name').remove();
  $('#record').disabled = true;
  $('#record')[0].classList.replace("btn-red", "btn-blue");
  $('#stop').disabled = false;
  audioChunks = [];
  rec.start();
});

$('#stop').on('click', function () {
  $('#record').disabled = false;
  $('#record')[0].classList.replace("btn-blue", "btn-red");
  $('#stop').disabled = true;
  rec.stop();
});



console.log('alo');