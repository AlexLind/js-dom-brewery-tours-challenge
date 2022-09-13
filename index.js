// Core criteria for brewery challenge:

let state = [];
let url = "";
let allowedTypes = ["micro", "regional", "brewpub"];
let allowedCities = [];

const addEventListeners = () => {
  document
    .querySelector("#select-state-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document
        .querySelector("#select-state")
        .value.replace(" ", "_")
        .toLowerCase();
      url = `https://api.openbrewerydb.org/breweries?by_state=${input}&per_page=50`;
      fetchAndRender(url);
    });

  document
    .querySelector("#filter-by-type-form")
    .addEventListener("change", (event) => {
      allowedTypes = event.target.value;
      fetchAndRender(url);
    });
};

const fetchAndRender = (url) => {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then((breweries) => {
      const newState = [...breweries];
      state = newState.filter((item) =>
        allowedTypes.includes(item.brewery_type)
      );
      render(state);
    });
};

const render = (input) => {
  document.querySelector("#breweries-list").innerHTML = "";
  document.querySelector("#filter-by-city-form").innerHTML = "";
  for (let i = 0; i < input.length; i++) {
    createElements(input[i]);
    createCityElements(input[i]);
  }
};

const createElements = (state) => {
  const list = document.querySelector("#breweries-list");
  const liEl = document.createElement("li");
  list.appendChild(liEl);
  const liH2 = document.createElement("h2");
  const liDiv = document.createElement("div");
  const liSecAddress = document.createElement("section");
  const firstSecH3 = document.createElement("h3");
  const firstSecParagraphOne = document.createElement("p");
  const firstSecParagraphTwo = document.createElement("p");
  const firstSecParagraphTwoStrong = document.createElement("strong");
  firstSecParagraphTwo.append(firstSecParagraphTwoStrong);
  liSecAddress.append(firstSecH3, firstSecParagraphOne, firstSecParagraphTwo);
  const liSecPhone = document.createElement("section");
  const secondSecH3 = document.createElement("h3");
  const secondSecParagraphOne = document.createElement("p");
  liSecPhone.append(secondSecH3, secondSecParagraphOne);
  const liSecLink = document.createElement("section");
  const thirdSecAnchor = document.createElement("a");
  liSecLink.append(thirdSecAnchor);
  liEl.append(liH2, liDiv, liSecAddress, liSecPhone, liSecLink);

  liH2.innerHTML = state.name;
  liDiv.className = "type";
  liDiv.innerHTML = state.brewery_type;
  liSecAddress.className = "address";
  firstSecH3.innerHTML = "Address:";
  firstSecParagraphOne.innerHTML = state.street;
  firstSecParagraphTwoStrong.innerHTML = `${state.city}, ${state.postal_code}`;
  liSecPhone.className = "phone";
  secondSecH3.innerHTML = "Phone:";
  secondSecParagraphOne.innerHTML = state.phone;
  liSecLink.className = "link";
  thirdSecAnchor.setAttribute("href", state.website_url);
  thirdSecAnchor.setAttribute("target", "_blank");
  thirdSecAnchor.innerHTML = "Visit Website";
};

const init = () => {
  addEventListeners();
  fetchAndRender(url);
};

init();

// Extensions

//Extension 1:

const searchFunction = (event) => {
  let input = event.target.value.toLowerCase();
  const newState = state.filter((item) =>
    item.name.toLowerCase().includes(input)
  );
  console.log(state, newState);
  render(newState);
};

// Extension 2:

const createCityElements = (input) => {
  const cityListInput = document.createElement("input");
  const cityListLabel = document.createElement("label");

  cityListInput.setAttribute("type", "checkbox");
  cityListInput.setAttribute("id", "filter-by-city-checkbox");
  cityListInput.setAttribute("name", "city-checkbox");
  cityListInput.setAttribute("value", input.city);
  cityListInput.addEventListener("change", (event) => {
    console.log(event.target.checked, event.target.value);
    if (event.target.checked) {
      let checkedCity = event.target.value.toLowerCase();
      console.log(checkedCity);
      allowedCities.push(checkedCity);
      console.log(allowedCities);
    }
    if (!event.target.checked) {
      let unCheckedCity = event.target.value.toLowerCase();
      console.log(unCheckedCity);
      allowedCities = allowedCities.filter((city) => city !== unCheckedCity);
      console.log(allowedCities);
    }
    console.log(allowedCities);
    const newState = state.filter((item) =>
      item.city.toLowerCase().includes(allowedCities)
    );
    console.log(state, newState);
    // render(newState);
  });

  cityListLabel.setAttribute("for", "filter-by-city-checkbox");
  cityListLabel.innerHTML = input.city;

  document
    .querySelector("#filter-by-city-form")
    .append(cityListInput, cityListLabel);
};
