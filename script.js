const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to the clicked tab
        tab.classList.add('active');
        
        // Hide all content sections
        contents.forEach(content => content.classList.remove('active'));
        
        // Show the corresponding content section
        const contentId = tab.getAttribute('data-content');
        document.getElementById(contentId).classList.add('active');
    });
});


//time
setInterval(() => {
  let dayTime12 = new Date();
  
  let hour = dayTime12.getHours();
  let minutes = dayTime12.getMinutes();
  let seconds = dayTime12.getSeconds();
  //time 12h
  let amPm = hour < 12 ? "AM" : "PM";
  hour = hour > 12 ? hour - 12 : hour;
  hour = hour === 0 ? hour = 12 : hour;
  //add digit 0
  hour = hour < 10 ? "0" + hour : hour;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  document.getElementById("clock-hour").innerHTML = hour;
  document.getElementById("clock-minute").innerHTML = minutes;
  document.getElementById("clock-second").innerHTML = seconds;
  document.querySelector(".clock-ampm").innerHTML = amPm;

}, 1000); //1000 milliseconds  = 1s 

document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.content');
  const createPostBtn = document.getElementById('create-post-btn');
  const modal = document.getElementById('post-form-modal');
  const closeModalBtn = document.querySelector('.close');
  const submitPostBtn = document.getElementById('submit-post-btn');

  tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          // Remove active class from all tabs
          tabs.forEach(t => t.classList.remove('active'));
          
          // Add active class to the clicked tab
          tab.classList.add('active');
          
          // Hide all content sections
          contents.forEach(content => content.classList.remove('active'));
          
          // Show the corresponding content section
          const contentId = tab.getAttribute('data-content');
          document.getElementById(contentId).classList.add('active');
      });
  });

  createPostBtn.addEventListener('click', () => {
      modal.style.display = "block";
  });

  closeModalBtn.addEventListener('click', () => {
      modal.style.display = "none";
  });

  window.addEventListener('click', (event) => {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  });

  submitPostBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to post?')) {
          alert('Post submitted!');
          modal.style.display = "none";
      }
  });
});
