/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

// Calculate a rolling average for an array
function rollingAverage(arr, windowPeriod = 10) {
  // rolling averages array to return
  var averages = [];

  // Loop through all of the data
  for (var i = 0; i < arr.length - windowPeriod + 1; i++) {
    // calculate the average for a window of data
    var sum = 0;
    for (var j = 0; j < windowPeriod; j++) {
      sum += arr[i + j];
    }
    // calculate the average and push it to the averages array
    averages.push(sum / windowPeriod);
  }
  return averages;
}

// Calculate a rolling average for an array
function rollingAverage52(arr, windowPeriod = 52) {
  // rolling averages array to return
  var averages = [];

  // Loop through all of the data
  for (var i = 0; i < arr.length - windowPeriod + 1; i++) {
    // calculate the average for a window of data
    var sum = 0;
    for (var j = 0; j < windowPeriod; j++) {
      sum += arr[i + j];
    }
    // calculate the average and push it to the averages array
    averages.push(sum / windowPeriod);
  }
  return averages;
}

// Submit Button handler
function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input value from the form
  var stock = d3.select("#stockInput").node().value;
  console.log(stock);

  // clear the input value
  d3.select("#stockInput").node().value = "";

  // Build the plot with the new stock
  buildPlot(stock);
}

function buildPlot(stock) {
  var apiKey = "BWzUsp_J8Eky_itpwm8d";

  var url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=1950-10-01&end_date=2019-11-07&api_key=${apiKey}`;

  d3.json(url).then(function(data) {

    // Grab values from the response json object to build the plots
    var name = data.dataset.name;
    var stock = data.dataset.dataset_code;
    var startDate = data.dataset.start_date;
    var endDate = data.dataset.end_date;
    var dates = unpack(data.dataset.data, 0);
    var openingPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);
    var rollingPeriod30 = 30;
    var rollingAvgClosing30 = rollingAverage(closingPrices, rollingPeriod30);
    var rollingPeriod90 = 90;
    var rollingAvgClosing90 = rollingAverage52(closingPrices, rollingPeriod90);

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: closingPrices,
      line: {
        color: "#17BECF"
      }
    };

    // Candlestick Trace
    var trace2 = {
      type: "candlestick",
      x: dates,
      high: highPrices,
      low: lowPrices,
      open: openingPrices,
      close: closingPrices
    };

    // Rolling Averages Trace
    var trace3 = {
      type: "scatter",
      mode: "lines",
      name: "Rolling50",
      x: dates.slice(0, dates.length - rollingPeriod30),
      y: rollingAvgClosing30
    };

        // Rolling Averages Trace
        var trace4 = {
          type: "scatter",
          mode: "lines",
          name: "Rolling90",
          x: dates.slice(0, dates.length - rollingPeriod90),
          y: rollingAvgClosing90
        };

    var data = [trace1, trace2, trace3,trace4];

    var layout = {
      title: `${stock} closing prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      }
    };

    Plotly.newPlot("plot", data, layout);

  });
}

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);
