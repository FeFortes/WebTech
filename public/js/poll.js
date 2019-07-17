function submitVote(pollId, vote) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var percentages = JSON.parse(this.responseText);
      document.getElementById("yes_id" + pollId).innerHTML = percentages.yes;
      document.getElementById("no_id" + pollId).innerHTML = percentages.no;
    }
  };
  xhttp.open("POST", "/submit-vote", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("pollId=" + pollId + "&vote=" + vote);
}

function loadPolls(numPollsSoFar) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("rt: "+ this.responseText)

      var extraPolls = JSON.parse(this.responseText);
      console.log("poll: " + extraPolls + " " + extraPolls[0]);

      for(i=0; i<extraPolls.length; i++) {

        var div = document.createElement('div');
        div.setAttribute('class', 'pollStrip');
        div.setAttribute('id', 'pollStrip' + extraPolls[0].id);
        div.innerHTML = '\
            <div class="selectVote">\
                <ul class="yesOrNo">\
                    <li class="yes" onclick="submitVote('+ extraPolls[i].id +', 1)" id="yes_id'+ extraPolls[i].id +'"><a>'+ extraPolls[i].yes +'</a></li>\
                    <li class="no" onclick="submitVote('+ extraPolls[i].id +', 0)" id="no_id'+ extraPolls[i].id +'"><a>'+ extraPolls[i].no +'</a></li>\
                </ul>\
            </div>\
            <div class="pollText">\
                <div class="circular--portrait">\
                    <img src="../img/Icons/ProfilePicture.png" id="profilePicture" alt="profilePicture"/>\
                </div> \
                <!--\
                <div id="usernameContent">\
                    <ul id="usernameContentList">\
                        <li>Username</li>\
                        <li>Date</li>\
                    </ul>\
                </div> */\
                -->\
                <p id="usernamePoll">'+ extraPolls[i].username +', '+ extraPolls[i].date +', id: '+ extraPolls[i].id +'</p>\
                <p class="textPoll">'+ extraPolls[i].text +'</p>\
            </div>\
            ';
        document.getElementById('pollsSpace').appendChild(div);
      }

      //document.getElementById("yes_id" + pollId).innerHTML = percentages.yes;
      //document.getElementById("no_id" + pollId).innerHTML = percentages.no;
    }
  };
  xhttp.open("POST", "/ask-more-polls", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("numPollsSoFar=" + numPollsSoFar);
}

function animationSelect(text_element, image_element) {
  console.log(text_element, image_element);
  document.getElementById(text_element).style.fontWeight= "bold";
  document.getElementById(text_element).style.textDecoration= "underline";
  document.getElementById(text_element).style.color= "rgb(47, 85, 151)";
  document.getElementById(image_element).style.opacity="1";
  if(text_element === "AnimatedPagesIcon") {
    document.getElementById("AnimatedPollsIcon").style.fontWeight= "normal";
    document.getElementById("AnimatedPollsIcon").style.textDecoration= "none";
    document.getElementById("AnimatedPollsIcon").style.color= "black";
    document.getElementById("AnimatedPollsImg").style.opacity="0.21";
  }
  if((text_element === "AnimatedPersoanalIcon")||(text_element === "AnimatedFriendsIcon")) {
    document.getElementById("AnimatedPublicIcon").style.fontWeight= "normal";
    document.getElementById("AnimatedPublicIcon").style.textDecoration= "none";
    document.getElementById("AnimatedPublicIcon").style.color= "black";
    document.getElementById("AnimatedPublicImg").style.opacity="0.21";
  }
}

function animationNotSelect(text_element, image_element) {
  console.log(text_element, image_element);
  document.getElementById(text_element).style.fontWeight= "normal";
  document.getElementById(text_element).style.textDecoration= "none";
  document.getElementById(text_element).style.color= "black";
  document.getElementById(image_element).style.opacity="0.21";

  document.getElementById("AnimatedPollsIcon").style.fontWeight= "bold";
  document.getElementById("AnimatedPollsIcon").style.textDecoration= "underline";
  document.getElementById("AnimatedPollsIcon").style.color= "rgb(47, 85, 151)";
  document.getElementById("AnimatedPollsImg").style.opacity="1";

  document.getElementById("AnimatedPublicIcon").style.fontWeight= "bold";
  document.getElementById("AnimatedPublicIcon").style.textDecoration= "underline";
  document.getElementById("AnimatedPublicIcon").style.color= "rgb(47, 85, 151)";
  document.getElementById("AnimatedPublicImg").style.opacity="1";
}