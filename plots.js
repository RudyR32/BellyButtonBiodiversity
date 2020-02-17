
//Copied from 12.4.3 for the challenge
//Demographics Info panel
function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });

        optionChanged(sampleNames[0]);
    })    
  
}

//Function to builfd the meta data panel
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        PANEL.append("h6").text("ID: "+result.id);
        PANEL.append("h6").text("Ethnicity: "+result.ethnicity);
        PANEL.append("h6").text("Gender: "+result.gender);
        PANEL.append("h6").text("Age: "+result.age);
        PANEL.append("h6").text("Location: "+result.location);
        PANEL.append("h6").text("BBType: "+result.bbtype);
        PANEL.append("h6").text("WFreq: "+result.wfreq);

        buildGauge(result.wfreq);
    });
}

//Function to build the bar chart
function buildCharts(sample){
    d3.json("samples.json").then((data) => {
        var sample_values = data.samples;
        var resultArray = sample_values.filter(sampleData => sampleData.id == sample);
        var result = resultArray[0];

        var otuIds = result.otu_ids;
        var otuLabels = result.otu_labels;
        var sampleValues = result.sample_values;

        var filteredData = otuIds.slice(0, 10).map(otuIdBarChart => `OTU${otuIdBarChart}`).reverse();

        var trace = {
            x: sampleValues.slice(0, 10).reverse(),
            y: filteredData,
            text: otuLabels.slice(0, 10).reverse(),
            type: "bar",
            orientation: 'h',
            marker: {
                color: "blue",
            }
        };

        var data = [trace];
        var layout = {
            title: "<b>Top 10 Belly Button Bacteria Species</b>",
            margin: {t: 30, l: 100},
            xaxis: { title: "Sample Values"},
        };

        Plotly.newPlot("bar", data, layout);


        //Bubble Chart
        var trace2 = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode:"markers",
            marker: {
                color: otuIds,
                colorscale:"blue",
                type: "heatmap",
                opacity: 0.5,
                size: sampleValues,
                sizemode: "diameter"
            }
        };

        var data = [trace2];
        var layout = {
            title: "All Bacteria Species per Individual",
            xaxis: {title: "OTI Id"},
            height: 500,
            width: 1400
        };

        Plotly.newPlot("bubble", data, layout)
    });    
}


//Gauge
function buildGauge(wfreq){
    var gauge = document.getElementById("gauge");

    var level = parseFloat(wfreq) * 20;
    var degrees = 180 - level;
    var radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    var mainPath = 'M -.0 -0.025 L .0 0.025 L ';
    var pathX = String(x);
    var space = ' ';
    var pathY = String(y);
    var pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [
        {
            type: "scatter",
            x: [0],
            y: [0],
            marker: {size: 12, color: '#000000'},
            showlegend: false,
            name: "Frequency",
            text: level,
            hoverinfo: "text + name"
        },
        {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: ["#99ccff", "#cc99ff", "#ff99dd", "#99ffcc", "#ddff99", "#ffbb99", "#ff9999", "#ffe699", "#99ff99", "white"]
            },
            labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
        }
    ];

var layout = {
    shapes:[
        {
            type: 'path',
            path: path,
            fillcolor: '#000000',
            line: {
                color: '#000000'
            }
        }    
    ],
    //     x0: 0.5,
    //     y0: 0,
    //     x1: x,
    //     y1: 0.5,
    //     line: {
    //         color: 'black',
    //         width: 2
    //     }
    // }],
    title: '<b>Belly Button Washing Frequency</b> <br>Scrubs per Week</br>',
    height: 700,
    width: 700,
    xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]},
    yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]}
};


    Plotly.newPlot(gauge, data, layout);
}    



function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    buildGauge(newSample);
}  

init();
  
