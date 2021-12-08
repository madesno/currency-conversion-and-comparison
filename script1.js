//defining global variables
var allRates;
var userInput;
var userInputNew;
var userInputAmt;
//to fix the error "d3 is undefined"
var d3 = d3
//take amount input from user
function submitAmount() {
  userInputAmt = document.getElementById("amountInput").value;
}
var amountSubmit = document.getElementById("btn_amt");
  amountSubmit.addEventListener('click', submitAmount);

//get base currency based on user input
function submitCurrency() {
 userInput =  document.getElementById("userinput").value;
 getAPI();
 var output = document.getElementById("output");
  output.textContent = userInput + ": " + userInputAmt;
}
//display base currency
var submitPress = document.getElementById("btn_run");
  submitPress.addEventListener('click', submitCurrency);

//get new currency based on user input
function submitNewCurrency() {
 userInputNew =  document.getElementById("userinputNew").value;
 var outputNew = document.getElementById("outputNew");
//multiply new currency rate by amountInput and then round
  var unroundedCurrencyAmt = allRates[userInputNew] * userInputAmt;
  var newCurrencyAmt = Math.round(unroundedCurrencyAmt * 100)/100;
  outputNew.textContent = userInputNew + ": " + newCurrencyAmt;
}
//display new currency
var submitPressNew = document.getElementById("btn_run_new");
  submitPressNew.addEventListener('click', submitNewCurrency);



//function to grab 4 random currency rates and compare them to the base currency
function fourRandomElems(a) {
  // the first entry is the base currency
  const getFirst = Object.entries(a)[0];
   // Shuffle array
  const shuffled = Object.entries(a)
  //remove the base currency
    .slice(1, -1)
    .sort(() => 0.5 - Math.random());
  //add base currency to the beginning
  shuffled.splice(0, 0, getFirst);
  // Get sub-array of first 5 elements after shuffled
  const selected = shuffled.slice(0, 5);
  return selected;
}

//hide charts
//-- all currencielogarithmic
function showAllLogChart() {
  var x = document.getElementById("allLog");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}; 
//-- all currencies linear
function showAllLinChart() {
  var x = document.getElementById("all");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
};
//-- five currencies logarithmic
function showFiveLogChart() {
  var x = document.getElementById("fiveLog");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
};
//-- five currencies linear
function showFiveLinChart() {
  var x = document.getElementById("five");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
};

//fetch API
function getAPI() {
const settings = {
  async: true,
  crossDomain: true,
  url: "https://exchangerate-api.p.rapidapi.com/rapid/latest/" + userInput,
  method: "GET",
  headers: {
    "x-rapidapi-host": "exchangerate-api.p.rapidapi.com",
    "x-rapidapi-key": "265d673255msh83a0fed5f4eaf8ep17913bjsnadfe2d240948"
  }
};

//parse api response
$.ajax(settings).done(function(response) {
  //save response to a variable
  var wholeOb = $(response);
  //resultsBox.innerHTML = JSON.stringify(wholeOb);
  //save data keys and values to variables to populate x and y axis
  const rate = wholeOb["0"]["rates"];
  const currency = Object.keys(rate);
  const fourRatesArrays = fourRandomElems(rate);
  const fourRates = Object.fromEntries(fourRatesArrays);
  const fourKeys = Object.keys(fourRates);
  allRates =  wholeOb["0"]["rates"];
  
  //d3 chart all currencies log scale
  // -- format svg element
  var svg = d3.select("#allLog"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  // -- remove any previous content
    svg.selectAll('*').remove();
  // -- define x and y scale types and ranges
  var x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1),
    y = d3.scaleLog().rangeRound([height, 0]);
  // -- svg axis placement
  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // -- define x and y domains
  var keys = currency;
  x.domain(keys);
  const maxRate = d3.max(Object.values(rate));
  y.domain([0.01, maxRate]);
// -- format +create x axis
  g.append("g")
    .attr("class", "x_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickValues([""]));
// -- format +create y axis
  g.append("g")
    .attr("class", "y_axis")
    .call(d3.axisLeft(y));
// -- format bars
  g.selectAll(".bar")
    .data(keys)
    .enter()
    .append("rect")
    .attr("class", "bar")
  // -- rotate bars
    .attr("x", function(k) {
      return x(k);
    })
    .attr("y", function(k) {
      return y(rate[k]);
    })
    .attr("width", x.bandwidth())
    .attr("height", function(k) {
      return height - y(rate[k]);
    })
    // -- tooltip
    .append("title")
    .text(function (d) {
      return `currency: ${d}`;
    });
  
  //d3 chart all currencies scale linear
    // -- format svg element
   var svg = d3.select("#all"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
    // -- remove any previous content
    svg.selectAll('*').remove();
    // -- define x and y scale types and ranges
  var x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);
// -- svg axis placement
  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // -- define x and y domains
  var keys = currency;
  x.domain(keys);
  y.domain([0, maxRate]);
 // -- format +create x axis
  g.append("g")
    .attr("class", "x_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickValues([""]));
 // -- format +create y axis
  g.append("g")
    .attr("class", "y_axis")
    .call(d3.axisLeft(y));
 // -- format bars
  g.selectAll(".bar")
    .data(keys)
    .enter()
    .append("rect")
    .attr("class", "bar")
  // -- rotate bars
    .attr("x", function(k) {
      return x(k);
    })
    .attr("y", function(k) {
      return y(rate[k]);
    })
    .attr("width", x.bandwidth())
    .attr("height", function(k) {
      return height - y(rate[k]);
    })
     // -- tooltip
    .append("title")
    .text(function(d) {
      return `currency: ${d}`;
    });

  //d3 chart Five Currencies logarithmic scale
    // -- format svg element
  var svg = d3.select("#fiveLog"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
    // -- remove any previous content
    svg.selectAll('*').remove();
    // -- define x and y scale types and ranges
  var x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1),
    y = d3.scaleLog()
  .range([height, 0])
  ;
// -- svg axis placement
  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 // -- define x and y domains
  x.domain(fourKeys);
  const maxFourRate = d3.max(Object.values(fourRates));
  y.domain([0.01, maxFourRate]);
// -- format +create x axis
  g.append("g")
    .attr("class", "x_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
 // -- format +create y axis
  g.append("g")
    .attr("class", "y_axis")
    .call(d3.axisLeft(y));
 // -- format bars
  g.selectAll(".bar")
    .data(fourKeys)
    .enter()
    .append("rect")
    .attr("class", "bar")
  // -- rotate bars
    .attr("x", function(k) {
      return x(k);
    })
    .attr("y", function(k) {
      return y(rate[k]);
    })
    .attr("width", x.bandwidth())
    .attr("height", function(k) {
      return height - y(rate[k]);
    })
    //tooltip
    .append("title")
    .text(function(d) {
      return d;
    });
 
  //d3 chart Five Currencies linear
    // -- format svg element
  var svg = d3.select("#five"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
    // -- remove any previous content
    svg.selectAll('*').remove();
    // -- define x and y scale types and ranges
  var x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1),
    y = d3.scaleLinear()
  .rangeRound([height, 0])
  ;
// -- svg axis placement
  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   // -- define x and y domains
  x.domain(fourKeys);
  y.domain([0, maxFourRate]);
 // -- format +create x axis
  g.append("g")
    .attr("class", "x_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
 // -- format +create y axis
  g.append("g")
    .attr("class", "y_axis")
    .call(d3.axisLeft(y));
 // -- format bars
  g.selectAll(".bar")
    .data(fourKeys)
    .enter()
    .append("rect")
    .attr("class", "bar")
  // -- rotate bars
    .attr("x", function(k) {
      return x(k);
    })
    .attr("y", function(k) {
      return y(rate[k]);
    })
    .attr("width", x.bandwidth())
    .attr("height", function(k) {
      return height - y(rate[k]);
    })
   // -- tooltip
    .append("title")
    .text(function(d) {
      return d;
    });
}) 
};
//Thanks for reading. 