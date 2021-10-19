// ********************DEFINE VARIABLES********************

// variable to hold the file name
let sampleData = "samples.json"

// variables to hold the HTML IDs that will be updated with new data
let dropdownMenu = d3.select("#selDataset");
let demographicsTable = d3.select("#sample-metadata");
let barChart = d3.select("#bar");
let bubbleChart = d3.select("bubble");

// ********************TESTING THE DATA FILE********************
d3.json(sampleData).then(x => console.log('sample data', x));

// ********************DEFINE FUNCTIONS********************
// init() to set defaults and display initial data on charts
// resetData() to clear out previous data (otherwise it will continue to append)
// getData() to get data and plot the demographics info, bar chart, and bubble chart
// optionChanged() to display new data when the dropdown changes

// FUNCTION: create a function to set defaults when page first opens
function init() {

    // read in JSON file
    d3.json(sampleData).then((data => {

        // for loop to fill in the drop down list
        data.names.forEach((name => {
            let option = dropdownMenu.append("option");
            option.text(name);
        }));

        // set the default to the first ID
        let defaultId = dropdownMenu.property("value")

        // plot charts with this first ID
        getData(defaultId);

    }));
};

// FUNCTION: create a function to clear out the divs in HTML and only show new data
function resetData() {

    demographicsTable.html("");
    barChart.html("");
    bubbleChart.html("");

};

// FUNCTION: create a function to get data and refresh data using id as the parameter
function getData(id) {

    // reset the data first
    resetData();
    
    // read in the JSON data
    d3.json(sampleData).then((data => {

        // Demographics Info:
        // filter metadata by the ID selected
        let selectedMetadata = data.metadata.filter(x => x.id == id)[0];

        // loop through key/value pairs in metadata to create an unordered list in HTML
        Object.entries(selectedMetadata).forEach(([key, value]) => {

            let infoList = demographicsTable.append("ul");

            // change the li to list group
            infoList.attr("class", "list-unstyled");

            // append li item to the ul tag
            let listItem = infoList.append("li");

            // add the key value pair from the metadata to the demographics list
            listItem.text(`${key}: ${value}`);

        });

        // Data for the Charts:
        // filter the samples for the ID selected
        let selectedSample = data.samples.filter(x => x.id == id)[0];

        // create empty arrays to store the plot data for both graphs
        let otuIds = [];
        let otuLabels = [];
        let sampleValues = [];

        // loop through key/values in the sample to get data for the graphs
        Object.entries(selectedSample).forEach(([key, value]) => {

            if (key == "otu_ids") {
                otuIds.push(value);
            } else if (key == "sample_values") {
                sampleValues.push(value);
            } else if (key == "otu_labels") {
                otuLabels.push(value);
            } 

        });

        // slice and reverse each of the arrays to get the top 10 values for the bar chart
        let topOtuIds = otuIds[0].slice(0, 10).reverse();
        let topOtuLabels = otuLabels[0].slice(0, 10).reverse();
        let topSampleValues = sampleValues[0].slice(0, 10).reverse();

        // use the map function to format the OTU Ids on the bar chart
        let topOtuIdsFormatted = topOtuIds.map(otuID => "OTU: " + otuID);

        // Bar Chart (top ten)
        let trace1 = {
            x: topSampleValues,
            y: topOtuIdsFormatted,
            text: topOtuLabels,
            type: 'bar',
            orientation: 'h'
        };

        let traceBar = [trace1];

        let layoutBar = {
            title: `<b>Top OTUs for Test Subject ${id}</b>`
            };
            
        Plotly.newPlot("bar", traceBar, layoutBar);

        // Bubble Chart:
        let trace2 = {
            x: otuIds[0],
            y: sampleValues[0],
            text: otuLabels[0],
            mode: 'markers',
            marker: {
                size: sampleValues[0],
                color: otuIds[0],
                colorscale: 'Earth'
            }
        };

        let traceBubble = [trace2];

        let layoutBubble = {
            
            title: `<b>OTU Values for Test Subject ${id}</b>`,
            showlegend: false,
            clip: 0,
            xaxis: {
                title: "OTU Id"
            },
            yaxis: {
                title: "Sample Values"
            }
        };

        Plotly.newPlot('bubble', traceBubble, layoutBubble);

        }));

};

// FUNCTION: create function to get new dataset when id is changed - optionChanged referenced in HTML
function optionChanged(id) {

    getData(id);

};

// ********************CALL THE INIT() FUNCTION TO INITIALIZE THE PAGE********************

// call the init() function for default data to display
init();