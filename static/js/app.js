//Defining Variables//

let sampleData = "samples.json";
let bubbleChart = d3.select("bubble");
let barChart = d3.select("#bar");
let demoTable = d3.select("#sample-metadata");
let dropdownMenu = d3.select("#selDataset");

function Init() {
    var dropdownMenu = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
        
      var names = data.names;
      names.forEach(item => {
          var tag = dropdownMenu.append("option");
          tag.text(item);
          tag.attr("value", item);
          })
  
      demoTable(names[0]);
      charts(names[0]);
    });
  }
  
  
  
  
  function demoTable(item) {
    //Read the JSON data
    d3.json("samples.json").then((sampleData) => {
      console.log(sampleData);
  
      // Demographics table
      var MetaData = sampleData.metadata;
      var dataid = MetaData.filter(data => data.id == item);
      var htmldata = d3.select("#sample-metadata").html("");
  
      console.log("Metadata:")
      console.log(MetaData)
  
      Object.entries(dataid[0]).forEach(([key, value]) => {
          htmldata.append("p").text(`${key}: ${value}`);
       });   
    });
  }
  
  
  //Creating the function to hold the charts
  function charts(item) {
  
    d3.json("samples.json").then((sampleData) => {
  
      var filtereddata = sampleData.samples;
      console.log("filetered data:")
      console.log(filtereddata)
  
      // filter the data for charting
      var dictSample = filtereddata.filter(data => data.id == item)[0];
      console.log(dictSample)
  
      var valuessample = dictSample.sample_values;
  
      //Creating the values to be used in the chart
      var chartvalues = valuessample.slice(0,10).reverse();
  
      console.log(chartvalues)
  
      //Getting Chart labels
      sampleid = dictSample.otu_ids;
      chartlabels = sampleid.slice(0,10).reverse();
      
      console.log(chartlabels)
  
      //Format the labels on the chart label
      formOTU = [];
      chartlabels.forEach((value) => {
  
      formOTU.push(`OTU ${value}`);
      });
  
      console.log(formOTU)
  
      //add hovertext to items
      var hovertext = chartvalues.otu_labels;
      
      var tracebar = {
        type: "bar",
        y: formOTU,
        x: chartvalues,
        text: hovertext,
        orientation: 'h'
      };
      
      //add variable for barchart to sit in
      chartData = [tracebar];
  
      Plotly.newPlot("bar", chartData);
  
      var tracebubble = {
        x: sampleid,
        y: valuessample,
        text: hovertext,
        mode: "markers",
        marker: {
            color: sampleid,
            size: valuessample
        }
    };
    
    bubbleData = [tracebubble];
  
    var layout = {
      title: "OTU",
      margin: {
        showlegend: false,
        height: 700,
        width: 1100,
        b: 100
      }
    };  
  
    Plotly.newPlot("bubble", bubbleData, layout);
  
  
    });
  }
  
  
  
  //Define the change option
  function optionChanged(itemOption)  {
    //Update table with changed id
    demoTable(itemOption);
  
    //Update charts with changed id
    charts(itemOption);
  }
  
  Init();
  © 2021 GitHub, Inc.
  Terms
  Privacy
  Security
  Status
  Docs
  Contact GitHub
  Pricing
  API
  Training
  Blog
  About
  