function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    var url_metadata = "/metadata/" + sample;
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    d3.json(url_metadata).then(function(data) {
      Object.entries(data).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
    })

var level = data.WFREQ
// Trig to calc meter point
var degrees = 180-(level*20),
     radius = .6;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 50],
  rotation: 90,
  
  text: ['8-9','7-8', '6-7',
         '5-6', '4-5', '3-4', 
         '2-3', '1-2', '0-1', ''],
  textinfo: 'text',
  textposition:'inside',      
  marker: {colors:['#7db482', '#82bc88','#84bf7c', 
                   '#b6cd87', '#d4e590','#e4e9ab', 
                   '#e8e7c7','#f3f0e3','#f7f2eb', '#ffffff']},
  labels: ['8-9', '7-8', '6-7',
           '5-6', '4-5', '3-4', 
           '2-3', '1-2', '0-1', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Button Washing Frequency',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

  })
}
    
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var data_url = "/samples/" + sample;
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(data_url).then(function(data) {
  // Use `.html("") to clear any existing sample data
    // @TODO: Build a Bubble Chart using the sample data
    var bubble_trace = [{
      x: data.otu_ids,
      y: data.sample_values,
      mode: "markers",
      type: "scatter",
      text: data.otu_labels,
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: "Earth"
      }
    }];
    var bubble_layout = {
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample" },
      showlegend: false,
      height: 400,
      width: 1200
    };

    Plotly.newPlot('bubble', bubble_trace, bubble_layout);

    var pie_trace = [{
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      hovertext: data.otu_labels.slice(0, 10),
      type: "pie"
    }];

    var pie_layout = {
      showlegend: true,
      height: 500,
      width:  500
    };

    Plotly.newPlot('pie', pie_trace, pie_layout);
  }
)}
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,

    // otu_ids, and labels (10 each).

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
