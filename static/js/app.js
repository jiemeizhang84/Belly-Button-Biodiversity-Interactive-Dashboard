d3.json("/names", function (error, response) {
    if (error) return console.warn(error);
    for (var i = 0; i < response.length; i++) {
        var option = document.createElement("option");
        var att = document.createAttribute("value");
        att.value = response[i];
        option.setAttributeNode(att);
        var text = document.createTextNode(response[i]);
        option.appendChild(text);
        var dropdown = document.getElementById("selDataset");
        dropdown.appendChild(option);
    }
})

// Default metadata
d3.json("/metadata/BB_940", function (error, response) {
    if (error) return console.warn(error);
    var age = response.AGE;
    var bbtype = response.BBTYPE;
    var ethnicity = response.ETHNICITY;
    var gender = response.GENDER;
    var location = response.LOCATION;
    var sampleid = response.SAMPLEID;
    var metaData = document.querySelector(".metainfo");
    metaData.appendChild(document.createTextNode("AGE: " + age));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("BBTYPE: " + bbtype));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("ETHNICITY: " + ethnicity));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("GENDER: " + gender));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("LOCATION: " + location));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("SAMPLEID: " + sampleid));
    metaData.appendChild(document.createElement("br"));
})

// Default pie chart & bubble chart (BB_940) once the page loads
var default_url = "/samples/BB_940";
Plotly.d3.json(default_url, function (error, response) {
    if (error) return console.warn(error);
    var values = response[0].sample_values.slice(0, 10);
    var labels = response[0].otu_ids.slice(0, 10);
    // console.log(labels);
    d3.json("/otu", function (error, otuResponse) {
        if (error) return console.warn(error);
        var pieText = [];
        for (var i = 0; i < labels.length; i++) {
            pieText.push(otuResponse[labels[i] - 1]);
        }
        console.log(pieText);
        // pie chart
        var data = [{
            values: values,
            labels: labels,
            hovertext: pieText,
            type: "pie"
        }];
        var layout = {
            title: "Top 10 OTU Samples for the Selected Sample"
        }
        Plotly.newPlot("pie", data, layout);

        // bubble chart
        var bubbleText = [];
        for (var i = 0; i < response[0].otu_ids.length; i++) {
            bubbleText.push(otuResponse[response[0].otu_ids[i] - 1]);
        }
        // console.log(bubbleText);
        var bubbleData = [{
            x: response[0].otu_ids,
            y: response[0].sample_values,
            text: bubbleText,
            mode: 'markers',
            marker: {
                color: response[0].otu_ids,
                colorscale: 'Earth',
                size: response[0].sample_values,
                sizeref: 1.5
            }
        }];
        var bubbleLayout = {
            title: 'Otu Sample Value vs OTU ID for the Selected Sample',
            showlegend: false,
            xaxis: {
                title: 'OTU ID'
            },
            yaxis: {
                title: 'OTU Sample Values'
            },
            height: 500,
            width: 1140
        };
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    })
})

// default gauge chart
var default_freq_url = "/wfreq/BB_940";
Plotly.d3.json(default_freq_url, function (error, response) {
    if (error) return console.warn(error);
    // console.log("washing freq: " + response);
    // convert frequency 0-9 to 0-180
    var level = response * (180 / 9);
    // console.log("gauge level: " + level);
    // Trig to calc meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    // path to create a triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{
            type: 'scatter',
            x: [0],
            y: [0],
            marker: {
                size: 28,
                color: '850000'
            },
            showlegend: false,
            name: 'scrub_per_week',
            text: level,
            hoverinfo: 'text+name'
        },
        {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            textinfo: 'text',
            textposition: 'inside',
            marker: {
                colors: ['rgba(14, 127, 0, .5)',
                    'rgba(70, 140, 10, .5)',
                    'rgba(110, 154, 22, .5)',
                    'rgba(170, 202, 42, .5)',
                    'rgba(202, 209, 95, .5)',
                    'rgba(210, 206, 145, .5)',
                    'rgba(232, 226, 202, .5)',
                    'rgba(240, 236, 212, .5)',
                    'rgba(250, 246, 222, .5)',
                    'rgba(255, 255, 255, 0)'
                ]
            },
            labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
        }
    ];
    var layout = {
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
        }],
        title: 'Belly Button Washing Frequency Scrubs per Week',
        height: 455,
        width: 455,
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        }
    };
    Plotly.newPlot('gauge', data, layout);

})


// Update the pie chart & bubble chart with new data
function updatePlotly(newdata) {
    var newValues = newdata[0].sample_values.slice(0, 10);
    var newLabels = newdata[0].otu_ids.slice(0, 10);
    // console.log(newLabels);
    d3.json("/otu", function (error, newOtuResponse) {
        if (error) return console.warn(error);
        var newPieText = [];
        for (var i = 0; i < newLabels.length; i++) {
            newPieText.push(newOtuResponse[newLabels[i] - 1]);
        }
        var newBubbleText = [];
        for (var i = 0; i < newdata[0].otu_ids.length; i++) {
            newBubbleText.push(newOtuResponse[newdata[0].otu_ids[i] - 1]);
        }
        // console.log('new otu response: '+ newBubbleText);
        // restyle pie chart
        Plotly.restyle("pie", "values", [newValues]);
        Plotly.restyle("pie", "labels", [newLabels]);
        Plotly.restyle("pie", "hovertext", [newPieText]);
        // restyle bubble chart
        Plotly.restyle("bubble", "x", [newdata[0].otu_ids]);
        // console.log("new bubble y for sample values" + newdata[0].sample_values);
        Plotly.restyle("bubble", "y", [newdata[0].sample_values]);
        Plotly.restyle("bubble", "text", [newBubbleText]);
        Plotly.restyle("bubble", "marker.color", [newdata[0].otu_ids]);
        Plotly.restyle("bubble", "marker.size", [newdata[0].sample_values]);
    })
}


function updateMetadata(response) {
    var metaData = document.querySelector(".metainfo");
    metaData.innerHTML = '';
    var age = response.AGE;
    var bbtype = response.BBTYPE;
    var ethnicity = response.ETHNICITY;
    var gender = response.GENDER;
    var location = response.LOCATION;
    var sampleid = response.SAMPLEID;

    metaData.appendChild(document.createTextNode("AGE: " + age));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("BBTYPE: " + bbtype));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("ETHNICITY: " + ethnicity));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("GENDER: " + gender));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("LOCATION: " + location));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("SAMPLEID: " + sampleid));
    metaData.appendChild(document.createElement("br"));

}

// update gauge chart
function updateGaugePlotly(newdata) {
    var level = newdata * (180 / 9);   
    // console.log("new gauge level: "+level);
    // updatr meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    // update path to create a triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);    
    var newlayout = {
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
        }]};    
    Plotly.relayout("gauge", newlayout);
};

// Get new data whenever the dropdown selection changes
function optionChanged(route) {
    // console.log(route);
    Plotly.d3.json(`/samples/${route}`, function (error, response) {
        if (error) return console.warn(error);
        updatePlotly(response);
    });
    Plotly.d3.json(`/metadata/${route}`, function (error, response) {
        if (error) return console.warn(error);
        updateMetadata(response);
    });
    Plotly.d3.json(`/wfreq/${route}`, function (error, response) {
        if (error) return console.warn(error);
        updateGaugePlotly(response);
    });

}