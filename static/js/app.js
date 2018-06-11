d3.json("/names", function(error, response) {
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
d3.json("/metadata/BB_940", function(error, response) {
    if (error) return console.warn(error);
    var age = response.AGE;
    var bbtype = response.BBTYPE;
    var ethnicity = response.ETHNICITY;
    var gender = response.GENDER;
    var location = response.LOCATION;
    var sampleid = response.SAMPLEID;
    var metaData = document.querySelector(".panel-body");
    metaData.appendChild(document.createTextNode("AGE: "+age));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("BBTYPE: "+bbtype));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("ETHNICITY: "+ethnicity));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("GENDER: "+gender));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("LOCATION: "+location));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("SAMPLEID: "+sampleid));
    metaData.appendChild(document.createElement("br"));

    
})

// Default pie chart & bubble chart (BB_940) once the page loads
var default_url = "/samples/BB_940";
Plotly.d3.json(default_url, function(error, response) {
    if (error) return console.warn(error);
    var values = response[0].sample_values.slice(0,10);
    var labels = response[0].otu_ids.slice(0,10);
    console.log(labels);
    d3.json("/otu", function(error, otuResponse) {
        if (error) return console.warn(error);
        var pieText = [];
        for (var i=0; i<labels.length; i++) {
            pieText.push(otuResponse[labels[i]-1]);
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
            title: "Top 10 OTU Samples for the Selected Sample"}
        Plotly.newPlot("pie", data, layout);
        
        // bubble chart
        var bubbleText = [];
        for (var i=0; i<response[0].otu_ids.length; i++) {
            bubbleText.push(otuResponse[response[0].otu_ids[i]-1]);
        }
        console.log(bubbleText);
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
            width: 1200
            
          };
          
          Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    })
})


// Update the pie chart with new data
function updatePlotly(newdata) {
    var newValues = newdata[0].sample_values.slice(0,10);
    var newLabels = newdata[0].otu_ids.slice(0,10);
    console.log(newLabels);    
    d3.json("/otu", function(error, newOtuResponse) {
        if (error) return console.warn(error);       
        var newPieText = [];
        for (var i=0; i<newLabels.length; i++) {
            newPieText.push(newOtuResponse[newLabels[i]-1]);
        }
        var newBubbleText = [];
        for (var i=0; i<newdata[0].otu_ids.length; i++) {
            newBubbleText.push(newOtuResponse[newdata[0].otu_ids[i]-1]);
        }

         
        console.log('new otu response: '+ newBubbleText);

    Plotly.restyle("pie", "values",[newValues]);
    Plotly.restyle("pie", "labels",[newLabels]);
    Plotly.restyle("pie", "hovertext",[newPieText]);
    Plotly.restyle("bubble", "x", [newdata[0].otu_ids]);
    console.log("new bubble y for sample values" + newdata[0].sample_values);
    Plotly.restyle("bubble", "y", [newdata[0].sample_values]);
    Plotly.restyle("bubble", "text", [newBubbleText]);

    Plotly.restyle("bubble", "marker.color", [newdata[0].otu_ids]);
    Plotly.restyle("bubble", "marker.size", [newdata[0].sample_values]);   
    })
}

function updateMetadata(response) {
    var metaData = document.querySelector(".panel-body");
    metaData.innerHTML = '';
    var age = response.AGE;
    var bbtype = response.BBTYPE;
    var ethnicity = response.ETHNICITY;
    var gender = response.GENDER;
    var location = response.LOCATION;
    var sampleid = response.SAMPLEID;
    
    metaData.appendChild(document.createTextNode("AGE: "+age));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("BBTYPE: "+bbtype));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("ETHNICITY: "+ethnicity));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("GENDER: "+gender));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("LOCATION: "+location));
    metaData.appendChild(document.createElement("br"));
    metaData.appendChild(document.createTextNode("SAMPLEID: "+sampleid));
    metaData.appendChild(document.createElement("br"));

}

// Get new data whenever the dropdown selection changes
function optionChanged(route) {
    console.log(route);    
    Plotly.d3.json(`/samples/${route}`, function(error, response){
        if (error) return console.warn(error);        
        updatePlotly(response);
    });
    Plotly.d3.json(`/metadata/${route}`, function(error, response){
        if (error) return console.warn(error);        
        updateMetadata(response);
    });

}


