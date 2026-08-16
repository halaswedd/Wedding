/* ============================================================
   WEDDING INVITATION
   FINAL FRONTEND PROTOTYPE
   ============================================================ */


/* ============================================================
   CONFIG
   ============================================================ */

const CONFIG = {

  coupleNames: {
    partner1: "Layal",
    partner2: "Karim"
  },

  weddingDateISO:
    "2027-06-12T17:00:00",

  venueName:
    "Villa Chanaa"

};


/* ============================================================
   ENVELOPE OPENING
   ============================================================ */

(function envelopeOpen(){

  const opening =
    document.getElementById("opening");

  const button =
    document.getElementById("envelope-btn");


  if(!opening || !button){
    return;
  }


  button.addEventListener(
    "click",
    () => {


      /* Prevent double click */

      if(
        opening.classList.contains(
          "is-opening"
        )
      ){
        return;
      }


      /* Start envelope animation */

      opening.classList.add(
        "is-opening"
      );


      /* Unlock page */

      document.body.classList.remove(
        "lock"
      );


      /* Completely hide opening */

      setTimeout(() => {

        opening.classList.add(
          "is-open"
        );

      },950);

    }
  );

})();


/* ============================================================
   SCROLL REVEAL
   ============================================================ */

(function scrollReveal(){

  const elements =
    document.querySelectorAll(
      ".reveal-on-scroll"
    );


  if(!elements.length){
    return;
  }


  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if(!entry.isIntersecting){
            return;
          }


          entry.target.classList.add(
            "is-visible"
          );


          observer.unobserve(
            entry.target
          );

        });

      },

      {
        threshold:.15
      }

    );


  elements.forEach(element => {

    observer.observe(element);

  });

})();


/* ============================================================
   COUNTDOWN
   ============================================================ */

(function countdown(){

  const target =
    new Date(
      CONFIG.weddingDateISO
    ).getTime();


  const grid =
    document.getElementById(
      "countdown-grid"
    );


  const passed =
    document.getElementById(
      "countdown-passed"
    );


  if(!grid){
    return;
  }


  const days =
    document.getElementById(
      "cd-days"
    );


  const hours =
    document.getElementById(
      "cd-hours"
    );


  const minutes =
    document.getElementById(
      "cd-mins"
    );


  const seconds =
    document.getElementById(
      "cd-secs"
    );


  const format =
    value =>
      String(value).padStart(
        2,
        "0"
      );


  let timer;


  function update(){

    const difference =
      target - Date.now();


    /*
      Wedding has passed
    */

    if(difference <= 0){

      grid.hidden = true;


      if(passed){

        passed.hidden = false;

      }


      clearInterval(timer);

      return;

    }


    const d =
      Math.floor(
        difference /
        86400000
      );


    const h =
      Math.floor(
        (difference % 86400000) /
        3600000
      );


    const m =
      Math.floor(
        (difference % 3600000) /
        60000
      );


    const s =
      Math.floor(
        (difference % 60000) /
        1000
      );


    days.textContent =
      format(d);


    hours.textContent =
      format(h);


    minutes.textContent =
      format(m);


    seconds.textContent =
      format(s);

  }


  update();


  timer =
    setInterval(
      update,
      1000
    );

})();


/* ============================================================
   MUSIC
   ============================================================ */

(function music(){

  const button =
    document.getElementById(
      "music-toggle"
    );


  const audio =
    document.getElementById(
      "bg-audio"
    );


  if(!button || !audio){
    return;
  }


  button.addEventListener(
    "click",
    async () => {


      const playing =
        button.getAttribute(
          "aria-pressed"
        ) === "true";


      /* Pause */

      if(playing){

        audio.pause();


        button.setAttribute(
          "aria-pressed",
          "false"
        );


        button.setAttribute(
          "aria-label",
          "Play background music"
        );


        return;

      }


      /* Play */

      try{

        await audio.play();


        button.setAttribute(
          "aria-pressed",
          "true"
        );


        button.setAttribute(
          "aria-label",
          "Pause background music"
        );

      }catch(error){

        console.log(
          "Audio could not start.",
          error
        );

      }

    }
  );

})();


/* ============================================================
   GOOGLE MAPS
   ============================================================ */

(function directions(){

  const link =
    document.getElementById(
      "directions-link"
    );


  if(!link){
    return;
  }


  const query =
    encodeURIComponent(
      CONFIG.venueName +
      ", Beit Mery, Mount Lebanon"
    );


  link.href =
    "https://www.google.com/maps/search/?api=1&query=" +
    query;

})();


/* ============================================================
   RSVP
   FRONTEND ONLY
   ============================================================ */

(function prototypeForm(){

  const form =
    document.getElementById(
      "rsvp-form"
    );


  if(!form){
    return;
  }


  const nameInput =
    document.getElementById(
      "rsvp-name"
    );


  const nameField =
    document.getElementById(
      "name-field"
    );


  const attendanceField =
    document.getElementById(
      "attendance-field"
    );


  const guestField =
    document.getElementById(
      "guest-count-field"
    );


  const submitButton =
    document.getElementById(
      "rsvp-submit"
    );


  const submitText =
    document.getElementById(
      "rsvp-submit-text"
    );


  const success =
    document.getElementById(
      "rsvp-success"
    );


  const successMessage =
    document.getElementById(
      "rsvp-success-msg"
    );


  /* ==========================================================
     ATTENDANCE
     ========================================================== */

  form
    .querySelectorAll(
      'input[name="attendance"]'
    )
    .forEach(input => {

      input.addEventListener(
        "change",
        () => {


          const attending =
            form.querySelector(
              'input[name="attendance"]:checked'
            )?.value === "yes";


          guestField.classList.toggle(
            "is-shown",
            attending
          );


          attendanceField.classList.remove(
            "has-error"
          );


          if(!attending){

            form
              .querySelectorAll(
                'input[name="guests"]'
              )
              .forEach(guest => {

                guest.checked =
                  false;

              });


            guestField.classList.remove(
              "has-error"
            );

          }

        }
      );

    });


  /* ==========================================================
     REMOVE ERRORS
     ========================================================== */

  nameInput.addEventListener(
    "input",
    () => {

      nameField.classList.remove(
        "has-error"
      );

    }
  );


  form
    .querySelectorAll(
      'input[name="guests"]'
    )
    .forEach(input => {

      input.addEventListener(
        "change",
        () => {

          guestField.classList.remove(
            "has-error"
          );

        }
      );

    });


  /* ==========================================================
     VALIDATION
     ========================================================== */

  function validate(){

    let valid = true;


    const name =
      nameInput.value.trim();


    const attendance =
      form.querySelector(
        'input[name="attendance"]:checked'
      );


    const guests =
      form.querySelector(
        'input[name="guests"]:checked'
      );


    /* Name */

    const invalidName =
      name.length === 0;


    nameField.classList.toggle(
      "has-error",
      invalidName
    );


    if(invalidName){

      valid = false;

    }


    /* Attendance */

    const invalidAttendance =
      !attendance;


    attendanceField.classList.toggle(
      "has-error",
      invalidAttendance
    );


    if(invalidAttendance){

      valid = false;

    }


    /* Guests */

    if(
      attendance &&
      attendance.value === "yes"
    ){

      const invalidGuests =
        !guests;


      guestField.classList.toggle(
        "has-error",
        invalidGuests
      );


      if(invalidGuests){

        valid = false;

      }

    }


    return valid;

  }


  /* ==========================================================
     SUBMIT
     ========================================================== */

  form.addEventListener(
    "submit",
    event => {


      /*
        IMPORTANT:

        Frontend prototype only.

        No backend.
        No email.
        No database.
        No API.
      */

      event.preventDefault();


      if(!validate()){

        return;

      }


      const attendance =
        form.querySelector(
          'input[name="attendance"]:checked'
        ).value;


      submitButton.classList.add(
        "is-loading"
      );


      submitButton.disabled = true;


      submitText.textContent =
        "Please wait";


      /* Fake submission */

      setTimeout(() => {


        form.classList.add(
          "is-hidden"
        );


        success.classList.add(
          "is-shown"
        );


        if(
          attendance === "yes"
        ){

          successMessage.textContent =
            "We can't wait to celebrate with you on June 12, 2027.";

        }else{

          successMessage.textContent =
            "We'll miss you — thank you for letting us know.";

        }


        success.setAttribute(
          "tabindex",
          "-1"
        );


        success.focus();


      },900);

    }
  );

})();