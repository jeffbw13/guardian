(function () {
  //  not all that halal
  const api_key = "47d6b6aa-82d9-4f53-aeaa-f41b1c1f4800";
  const container = $(".container");
  const nav = $("nav");
  nav.addEventListener("click", clickedNav);
  const pagination = $(".pagination");
  pagination.addEventListener("click", clickedPag);
  const menuIcon = $(".menu-icon");
  menuIcon.addEventListener("click", clickedMenuIcon);
  let sections = "";
  let page = 1;

  //  set initial active menu item
  let ul = nav.querySelector("ul");
  ul.childNodes[1].className = "active";

  getPage(1);

  function $(selector, context) {
    return document.querySelector(selector);
  }

  function clickedNav(e) {
    //  remove "active" class from all menu items
    e.target.parentNode.childNodes.forEach((c) => {
      c.className = "";
    });
    sections = "";
    e.target.className += "active";
    const option = e.target.childNodes[0].nodeValue;
    switch (option) {
      case "All":
        break;
      case "U.S. News":
        sections = `section=us-news&`;
        break;
      case "World News":
        sections = `section=world&`;
        break;
      case "Sports":
        sections = `section=sport&`;
        break;
      case "Environment":
        sections = `section=environment&`;
        break;
      case "Books":
        sections = `section=books&`;
        break;
      default:
    }
    ul = nav.querySelector("ul");
    ul.className = "nav-ul-horiz";

    getPage(1, sections);
  }

  function clickedPag(e) {
    const page = e.target.childNodes[0].nodeValue;
    getPage(page, sections);
  }

  function clickedMenuIcon(e) {
    e.stopPropagation();
    ul = nav.querySelector("ul");
    if (ul.className === "nav-ul-horiz") {
      ul.className = "nav-ul-vert";
    } else {
      ul.className = "nav-ul-horiz";
    }
  }

  function getPage(page, sections = "") {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    //  remove unsightly pagination also
    while (pagination.firstChild) {
      pagination.removeChild(pagination.firstChild);
    }
    let atts = {
      class: "cont-inner",
    };
    const contInner = addChild(container, "div", "", atts);
    fetch(
      `https://content.guardianapis.com/search?api-key=${api_key}&type=article&page-size=20&page=${page}&${sections}show-fields=trailText,thumbnail`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        stories = data.response.results;
        stories.forEach((s) => {
          let atts = {
            class: "card",
          };
          const story = addChild(contInner, "div", "", atts);
          atts = {
            src: s.fields.thumbnail,
            class: "card--avatar",
          };
          const img = addChild(story, "img", "", atts);
          atts = {
            class: "card--title",
            href: s.webUrl,
          };
          const head = addChild(story, "a", "", atts);
          head.innerHTML = s.webTitle;
          atts = {
            class: "card--text",
          };
          const teaser = addChild(story, "p", "", atts);
          teaser.innerHTML = s.fields.trailText;
        });

        pag(page);
      })
      .catch((err) => {
        console.log("blah, blah");
        atts = {
          class: "card--title",
        };
        const teaser = addChild(contInner, "p", "", atts);
        teaser.innerHTML = "No connection to server";
      });
  }

  function pag(page) {
    //  page should be in middle of pagination if possible
    let atts = {
      class: "pag-inner",
    };
    let pagInner = addChild(pagination, "div", "", atts);
    const start = page - 4 > 0 ? page - 4 : 1;
    for (let x = start; x <= start + 8; x++) {
      let atts = {
        class: "pag",
      };
      let pag = addChild(pagInner, "div", "", atts);
      pag.innerHTML = x;
    }
  }

  function addChild(parent, child, childText, attributes) {
    if (typeof child == "string") {
      childNode = document.createElement(child);
    } else {
      childNode = child;
    }
    if (typeof childText == "string") {
      childTextNode = document.createTextNode(childText);
      childNode.appendChild(childTextNode);
    }
    if (attributes) {
      for (var att in attributes) {
        childNode.setAttribute(att, attributes[att]);
      }
    }
    parent.appendChild(childNode);
    return childNode;
  }
})();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/serviceWorker.js")
    .then(function (registration) {
      console.log("Service Worker Registered", registration);
    })
    .catch(function (err) {
      console.log("Service Worker Failed to Register", err);
    });
}
