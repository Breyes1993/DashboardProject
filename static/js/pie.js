// Bar Chart code for 3rd team project written by Brian Reyes


function buildCharts(year) {

  d3.json("/getData", data => {

    data.forEach(row => {
      if (row.year == year) {
        if (row.leading_causes == "Stroke") {
          stroke_value = row.age_adjusted_death_rate
        }
        if (row.leading_causes == "Cancer") {
          cancer_value = row.age_adjusted_death_rate
        }
        if (row.leading_causes == "Heart Disease") {
          heart_value = row.age_adjusted_death_rate
        }
        if (row.leading_causes == "Accidents") {
          accidents_value = row.age_adjusted_death_rate
        }
        if (row.leading_causes == "Influenza and Pneumonia") {
          influenza_value = row.age_adjusted_death_rate
        }
      }
    });

    var values = [stroke_value, cancer_value, heart_value, accidents_value, influenza_value]
    var labels = ['Stroke', 'Cancer', 'Heart Disease', 'Accidents', 'Influenza and Pneumonia']


    var layout = {
      title: "",
      height: 600,
      width: 980
    }

    var pie_chart = [{
      values: values,
      labels: labels,
      marker: {
        'colors': [
          'rgb(215, 11, 11)', //Stroke - Red
          'rgb(240, 88, 0)', // Cancer - Orange
          'rgb(118, 17, 195)', // Heart Disease - Purple
          'rgb(0, 204, 0)', // Accidents - Green
          'rgb(0, 48, 240)', // Influenza - Blue
        ]
      },
      sort: false,
      type: "pie"
    }];
    Plotly.newPlot('pie', pie_chart, layout);

  });
};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/getData", deathData => {
    var flatData = transposeData(deathData)

    flatData.forEach((item) => {
      // if item.cause == stroke, execute code below
      selector
        .append("option")
        .text(item.Year)
        .property("value", item.Year);
    });

    // Use the first sample from the list to build the initial plots
    const firstYear = deathData[0].year;
    buildCharts(firstYear);
    //   buildMetadata(firstYear);
  });
}


// Combine drop down menu (combines years for each cause of death)

function transposeData(data) {
  var yearLimits = d3.extent(data, d => +d.year);
  var flatData = [];

  for (i = yearLimits[0]; i <= yearLimits[1]; i++) {

    var yearData = data.filter(d => d.year == i);

    var strokeRate = yearData.filter(d =>
      d.leading_causes == "Stroke")[0].age_adjusted_death_rate;
    var fluRate = yearData.filter(d =>
      d.leading_causes == "Influenza and Pneumonia")[0].age_adjusted_death_rate;
    var accidentRate = yearData.filter(d =>
      d.leading_causes == "Accidents")[0].age_adjusted_death_rate;
    var heartRate = yearData.filter(d =>
      d.leading_causes == "Heart Disease")[0].age_adjusted_death_rate;
    var cancerRate = yearData.filter(d =>
      d.leading_causes == "Cancer")[0].age_adjusted_death_rate;

    flatData.push({
      "Year": i,
      "Stroke": strokeRate,
      "Influenza and Pneumonia": fluRate,
      "Accidents": accidentRate,
      "Heart Disease": heartRate,
      "Cancer": cancerRate
    });
  }
  return flatData;
}


function optionChanged() {
  // Fetch new data each time a new sample is selected
  var selector = d3.select("#selDataset").node();

  // d3.csv("static/data/CDC_Deathstats.csv", (deathData) => {
  d3.json("/getData", deathData => {

    deathData.forEach((item) => {

      if (item.year == selector.value) {
        var temp = selector.value
        buildCharts(temp);
      }
    })
  })
}
init();
