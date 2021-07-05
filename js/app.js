// register page variables
const reg_fname = document.querySelector("#register_fname");
const reg_lname = document.querySelector("#register_lname");
const reg_email = document.querySelector("#register_email");
const reg_pass1 = document.querySelector("#register_pass1");
const reg_pass2 = document.querySelector("#register_pass2");
const reg_news = document.querySelector("#register_newsletter");
const reg_terms = document.querySelector("#register_terms");
const reg_submit = document.querySelector("#button_register");
const reg_error = document.querySelector("#register_error");

const log_email = document.querySelector("#log_email");
const log_pass = document.querySelector("#log_pass");
const log_submit = document.querySelector("#log_button");
const log_error = document.querySelector("#log_error");

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const pass_regex = /\D{1,}[!_#&]\D{1,}/;

const messages = {
  fname_required: "First name is required.",
  lname_required: "Last name is required.",
  fname_length: "First name must be at least 3 characters.",
  lname_length: "Last name must be at least 3 characters.",
  email_required: "E-mail address is required.",
  email_invalid: "Invalid e-mail address.",
  pass_length: "Password must be at least 8 characters",
  pass_match: "Passwords do not match.",
  pass_invalid: "Password must contain one special character: !, _, #, &",
  terms_accepted: "You must agree to the terms and conditions.",
};

const BASE_URL = "https://backend-curs.herokuapp.com";
const ENDPOINTS = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
};

const validateInput = (el, err, mesaj) => {
  el.style.border = "1px solid red";
  err.innerText = mesaj;
  setTimeout(() => {
    el.style.border = "unset";
    err.innerText = "";
  }, 3000);
};

if (reg_submit !== null) {
  console.log("reg_submit found.");
  reg_submit.addEventListener("click", (e) => {
    // anulam functia de submit (e de la event)
    e.preventDefault();
    console.log("reg_submit clicked and prevented.");

    if (reg_fname.value === "") {
      validateInput(reg_fname, reg_error, messages.fname_required);
      // return ne scoate din functie daca avem camp cu erori
      return;
    }

    if (reg_lname.value === "") {
      validateInput(reg_lname, reg_error, messages.lname_required);
      return;
    }

    if (reg_fname.value.length < 3) {
      validateInput(reg_fname, reg_error, messages.fname_length);
      return;
    }

    if (reg_lname.value.length < 3) {
      validateInput(reg_lname, reg_error, messages.lname_length);
      return;
    }

    if (reg_email.value === "") {
      validateInput(reg_email, reg_error, messages.email_required);
      return;
    }

    if (emailRegex.test(reg_email.value) === false) {
      validateInput(reg_email, reg_error, messages.email_invalid);
      return;
    }

    if (reg_pass1.value.length < 8 || reg_pass2.value.length < 8) {
      validateInput(reg_pass1, reg_error, messages.pass_length);
      return;
    }

    if (reg_pass1.value !== reg_pass2.value) {
      validateInput(reg_pass1, reg_error, messages.pass_match);
      return;
    }

    if (pass_regex.test(reg_pass1.value) === false) {
      validateInput(reg_pass1, reg_error, messages.pass_invalid);
      return;
    }

    if (reg_terms.checked === false) {
      validateInput(reg_terms, reg_error, messages.terms_accepted);
      return;
    }

    try {
      fetch(BASE_URL + ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: reg_fname.value.trim(),
          last_name: reg_lname.value.trim(),
          email: reg_email.value.trim(),
          password: reg_pass1.value,
        }),
      })
        .then((response) => response.json())
        .then((prevResponse) => {
          if (prevResponse.id !== undefined) {
            alert("Account created. Please log in.");
          } else {
            validateInput(reg_error, reg_error, prevResponse.message);
          }
        });
    } catch (err) {
      validateInput(reg_error, reg_error, err.message);
    }
  });
}

if (log_submit !== null) {
  log_submit.addEventListener("click", (event) => {
    event.preventDefault();

    if (log_email.value === "") {
      validateInput(log_email, log_error, messages.email_required);
      return;
    }

    if (emailRegex.test(log_email.value) === false) {
      validateInput(log_email, log_error, messages.email_invalid);
      return;
    }

    if (log_pass.value === "" && log_pass.value.length < 8) {
      validateInput(log_pass, log_error, messages.pass_length);
      return;
    }

    const request_data = {
      email: log_email.value.trim(),
      password: log_pass.value,
    };

    fetch(BASE_URL + ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_data),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.message !== undefined) {
          validateInput(log_error, log_error, json.message);
        } else {
          localStorage.setItem("token", json.token);
          localStorage.setItem("account", JSON.stringify(json.user));
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      });
  });
}

// newsfeed logic
const newsfeed_check = document.querySelector("#newsfeed");
const header_user_info = document.querySelector("#header_user_info");
const all_header_dropdowns = document.querySelectorAll(".has_dropdown");
const notification_badge = document.querySelector("#notification_badge");
const messages_badge = document.querySelector("#messages_badge");
const notifications_dropdown = document.querySelector(
  "#notifications_dropdown"
);
const friends_sidebar = document.querySelector("#friendsList");
const messages_dropdown = document.querySelector("#messages_dropdown");
const main_content = document.querySelector("main");

const user_messages = [
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Lorem ipsum 1?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe 2",
    message: "Lorem ipsum 2?",
  },
  {
    avatar: "https://source.unsplash.com/42x42",
    full_name: "John Doe 3",
    message: "Lorem ipsum 3?",
  },
];

const user_notifications = [
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
  {
    avatar: "https://source.unsplash.com/41x41",
    full_name: "John Doe",
    message: "Lorem ipsum?",
  },
  {
    avatar: "https://source.unsplash.com/40x40",
    full_name: "John Doe 1",
    message: "Wanna eat?",
  },
];
function downloadFile() {
  window.location.href = "../downloads/curs.pdf";
}
if (localStorage.token !== undefined) {
  document.querySelector("body").innerHTML +=
    "<span onclick='downloadFile()'>download file</span>";
}
const friends_list = [
  {
    avatar: "https://source.unsplash.com/60x60",
    full_name: "Full Name 1",
    online: true,
    last_online: "2021-06-24T15:57:40.191Z",
  },
  {
    avatar: "https://source.unsplash.com/60x60",
    full_name: "Full Name 2",
    online: true,
    last_online: "2021-06-24T15:57:40.191Z",
  },
  {
    avatar: "https://source.unsplash.com/60x60",
    full_name: "Full Name 3",
    online: false,
    last_online: "2021-06-21T15:57:40.191Z",
  },
  {
    avatar: "https://source.unsplash.com/60x60",
    full_name: "Full Name 4",
    online: true,
    last_online: "2021-06-01T15:57:40.191Z",
  },
  {
    avatar: "https://source.unsplash.com/60x60",
    full_name: "Full Name 5",
    online: true,
    last_online: "2021-06-12T15:57:40.191Z",
  },
];

function generateFriendCard({ avatar, full_name, online, last_online }) {
  const onlineDate = new Date(last_online);
  const day = onlineDate.getDay();
  const month = onlineDate.getMonth();

  return ` 
  <div class="friend">
  <div class="profile-image">
    <img src=" ${avatar}" />
    <div class="status ${online && "online"}"></div>
  </div>
  <div class="user-details">
    <p>${full_name}</p>
    <p>${online ? "Online" : `Last Online ${day}${month}`}</p>
  </div>
</div>
`;
}
const generatePost = ({ content, comments, likes, shares, author, date }) => {
  const d = new Date(date);
  const day = d.getDay();
  const monnth = d.getMonth();
  const full_date = `${day}/${monnth}`;
  return `
  <!-- start single post -->
  <div class="single-post">
    <div class="post-header">
      <div class="author">
        <img src="https://source.unsplash.com/40x40" alt="${author}" />
        <p>${author}/p>
      </div>
      <div class="post-date">${full_date}</div>
    </div>
    <div class="post-content">
     ${
       content.image.length > 0 &&
       content.image.map((img) => `<img src="${img}"`)
     }
     ${content.video !== "" && `<video>source src="&{content.video}"</video>`}
    </div>
    <div class="post-footer">
      <div class="buttons">
        <div class="button">
          <i class="far fa-heart"></i>
          <span class="label">Like</span>
          <span class="count">${likes.length > 0 && `(${likes.lenght})`}</span>
        </div>
        <div class="button">
          <i class="far fa-comments"></i>
          <span class="label">Comments</span>
          <span class="count">(${
            comments.length > 0 && `(${comments.lenght})`
          })</span>
        </div>
        <div class="button">
          <i class="far fa-share-square"></i>
          <span class="label">Share</span>
          <span class="count">(${
            shares.length > 0 && `(${shares.lenght})`
          })</span>
        </div>
      </div>
      <div class="comments">
       
        <div class="comment">
          <img src="https://source.unsplash.com/30x30" />
          <div>
            <p>Nume Prenume</p>
            <p>Nice pictures.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end single post -->
  <!-- start single post -->
  <div class="single-post">
    <div class="post-header">
      <div class="author">
        <img src="https://source.unsplash.com/40x40" />
        <p>Nume Prenume</p>
      </div>
      <div class="post-date">2h</div>
    </div>
    <div class="post-content">
      <p>Am scapat de marea criza de cafea!</p>
      <video controls autoplay muted>
        <source src="video/video.webm" type="video/webm" />
        <source src="video/video.mp4" type="video/mp4" />
        Your browser does not support HTML5 videos.
      </video>
    </div>
    <div class="post-footer">
      <div class="buttons">
        <div class="button">
          <i class="far fa-heart"></i>
          <span class="label">Like</span>
          <span class="count">(21)</span>
        </div>
        <div class="button">
          <i class="far fa-comments"></i>
          <span class="label">Comments</span>
          <span class="count">(7)</span>
        </div>
        <div class="button">
          <i class="far fa-share-square"></i>
          <span class="label">Share</span>
          <span class="count">(3)</span>
        </div>
      </div>
      <div class="comments">
        <div class="comment">
          <img src="https://source.unsplash.com/30x30" />
          <div>
            <p>Nume Prenume</p>
            <p>Nice pictures.</p>
          </div>
        </div>
        <div class="comment">
          <img src="https://source.unsplash.com/30x30" />
          <div>
            <p>Nume Prenume</p>
            <p>Nice pictures.</p>
          </div>
        </div>
        <div class="comment">
          <img src="https://source.unsplash.com/30x30" />
          <div>
            <p>Nume Prenume</p>
            <p>Nice pictures.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end single post -->
  <!-- start single post -->
  <div class="single-post">
    <div class="post-header">
      <div class="author">
        <img src="https://source.unsplash.com/40x40" />
        <p>Nume Prenume</p>
      </div>
      <div class="post-date">2h</div>
    </div>
    <div class="post-content">
      <p>Am scapat de marea criza de cafea!</p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Distinctio dolorum a ducimus, aliquam inventore pariatur, suscipit
        officia error in natus dicta neque vero numquam voluptates rerum
        magnam? Consequatur nemo animi, reprehenderit odio est iusto
        dolorem, voluptatem earum vel suscipit pariatur?
      </p>
    </div>
    <div class="post-footer">
      <div class="buttons">
        <div class="button">
          <i class="far fa-heart"></i>
          <span class="label">Like</span>
          <span class="count">(21)</span>
        </div>
        <div class="button">
          <i class="far fa-comments"></i>
          <span class="label">Comments</span>
          <span class="count">(7)</span>
        </div>
        <div class="button">
          <i class="far fa-share-square"></i>
          <span class="label">Share</span>
          <span class="count">(3)</span>
        </div>
      </div>
      <div class="comments">
        <div class="comment">
          <img src="https://source.unsplash.com/30x30" />
          <div>
            <p>Nume Prenume</p>
            <p>Nice pictures.</p>
          </div>
        </div>
        <div class="comment">
          <img src="https://source.unsplash.com/30x30" />
          <div>
            <p>Nume Prenume</p>
            <p>Nice pictures.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end single post -->
  <!-- start single post -->
  <div class="single-post">
    <div class="post-header">
      <div class="author">
        <img src="https://source.unsplash.com/40x40" />
        <p>Nume Prenume</p>
      </div>
      <div class="post-date">2h</div>
    </div>
    <div class="post-content">
      <video controls autoplay muted>
        <source src="video/video.webm" type="video/webm" />
        <source src="video/video.mp4" type="video/mp4" />
        Your browser does not support HTML5 videos.
      </video>
    </div>
    <div class="post-footer">
      <div class="buttons">
        <div class="button">
          <i class="far fa-heart"></i>
          <span class="label">Like</span>
          <span class="count">(21)</span>
        </div>
        <div class="button">
          <i class="far fa-comments"></i>
          <span class="label">Comments</span>
          <span class="count">(7)</span>
        </div>
        <div class="button">
          <i class="far fa-share-square"></i>
          <span class="label">Share</span>
          <span class="count">(3)</span>
        </div>
      </div>
      <div class="comments">
        <div class="comment">
          <img src="https://source.unsplash.com/30x30" />
          <div>
            <p>Nume Prenume</p>
            <p>Nice pictures.</p>
          </div>
        </div>
        <div class="comment">
          <img src="https://source.unsplash.com/30x30" />
          <div>
            <p>Nume Prenume</p>
            <p>Nice pictures.</p>
          </div>
        </div>
        <div class="comment">
          <img src="https://source.unsplash.com/30x30" />
          <div>
            <p>Nume Prenume</p>
            <p>Nice pictures.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end single post -->`;
};
if (newsfeed_check !== null) {
  // logica de newsfeed
  const user_data = JSON.parse(localStorage.account);

  header_user_info.innerHTML = `
    <a href="${
      user_data.profile_URL
    }" style="display: flex; align-items: center; color: #fafafa">
      <img src="${user_data.avatar}" alt="${
    user_data.first_name + " " + user_data.last_name
  }" />
      <span>${user_data.first_name + " " + user_data.last_name}</span>
    </a>
  `;

  all_header_dropdowns.forEach((dropdownParent) => {
    dropdownParent.addEventListener("click", () => {
      // prima data inchidem toate dropdowns
      for (let i = 0; i < all_header_dropdowns.length; i++) {
        all_header_dropdowns[i].querySelector(".dropdown").style.display =
          "none";
      }
      // dupa ce am inchis toate, deschidem doar cel pe care am dat click

      if (dropdownParent.querySelector(".dropdown").style.display === "none") {
        dropdownParent.querySelector(".dropdown").style.display = "block";
      } else {
        dropdownParent.querySelector(".dropdown").style.display = "none";
      }
    });
  });

  notification_badge.innerText = user_notifications.length;
  messages_badge.innerText = user_messages.length;

  user_notifications.map((notification) => {
    notifications_dropdown.innerHTML += `
      <li>
        <div class="image">
          <img src="${notification.avatar}" />
        </div>
        <div class="content">
          <p class="title">${notification.full_name}</p>
          <p class="excerpt">${notification.message}</p>
        </div>
      </li>
    `;
  });

  user_messages.map((message) => {
    messages_dropdown.innerHTML += `
      <li>
        <div class="image">
          <img src="${message.avatar}" />
        </div>
        <div class="content">
          <p class="title">${message.full_name}</p>
          <p class="excerpt">${message.message}</p>
        </div>
      </li>
    `;
  });
  friends_list.map((friend) => {
    friends_sidebar.innerHTML += generateFriendCard(friend);
  });
}

// logout
const logOutButton = document.querySelector("#logOut");

if (logOutButton !== null) {
  logOutButton.addEventListener("click", () => {
    localStorage.clear();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  });
}
