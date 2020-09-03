// create init function
function init() {                
    // 1. Use the D3 library to read in `samples.json`.
        d3.json("samples.json").then((data) => {
            // console.log(data);
            var sampleNames = data.names;
                
        // refrence dropdown box to select element
        var selector = d3.select("#selDataset");  
        sampleNames.forEach((sampleID) => { 
                selector
                    .append("option") 
                    .text(sampleID)
                    .property("value", sampleID); 
            }); 
            // OTU names and values
            var sampleID = sampleNames[0];      
            DemographicInfo(sampleID);
            BarGraph(sampleID);
            BubbleChart(sampleID);
        });
    }
//  demographic info function
function DemographicInfo(selectedSampleID) {
    // console.log(selectedSampleID);
    d3.json("samples.json").then((data) => {
    var demographicInfo = data.metadata;
    var resultArray = demographicInfo.filter(sampleObj => sampleObj.id == selectedSampleID)
    var result = resultArray[0];
    console.log(result)
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
     // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
            var labelsToShow = `${key}: ${value}`;
            panel.append("h6").text(labelsToShow);
        });
    });

}
// function to update graphs each time a new sample is selected from HTML file optionChanged
// code source https://www.w3schools.com/jsref/event_onchange.asp
function optionChanged(newSampleID) {
    DemographicInfo(newSampleID); 
    BarGraph(newSampleID);
    BubbleChart(newSampleID); 
    console.log("Dropdown ID changed:", newSampleID);
}
//function to create bar graph
function BarGraph(selectedSampleID) { 
    console.log("BarGraph sample = ", selectedSampleID);
    d3.json("samples.json").then((data) => {
  
        var sampleBacteria = data.samples;        
        var resultArray = sampleBacteria.filter(sampleObj => sampleObj.id == selectedSampleID);
        var result = resultArray[0];
        // console.log(result)
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var top10values= sample_values.slice(0, 10).reverse()
        //Pick the top 10 OTU IDs and order them ascending  
        var yvalues = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var top10labels= otu_labels.slice(0, 10).reverse()
        
        // Trace for the horizontal bar chart
        var barData = [{
                x: top10values,
                y: yvalues,          
                text: top10labels,
                type: "bar",
                orientation: "h" 
            }
        ];
        var barLayout = {
            title: "Top Ten Bacteria Present in Sample",
            height: 500,
            width: 700
        };  
    Plotly.newPlot("bar", barData, barLayout);
    });
}
// create a function for the bubble chart
function BubbleChart(selectedSampleID) {
    console.log("BubbleChart sample = ", selectedSampleID);
    d3.json("samples.json").then((data) => { 
        var sampleBacteria = data.samples;       
        var resultArray = sampleBacteria.filter(sampleObj => sampleObj.id == selectedSampleID);
        var result = resultArray[0];
        // console.log(result)
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var bubbleData = [{
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "YlGnBu"
                }
            }
        ];
        var bubbleLayout = {
            title: "Bacteria Present Per Sample",
            margin: {t: 25, l: 100},
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Number of Bacteria"}
        };    
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);    
});
}
init();
