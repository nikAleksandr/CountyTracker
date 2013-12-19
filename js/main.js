function isNumber (o) {
  return ! isNaN (o-0);
}

var percentage = function(n){
	if(isNumber(n)){
		x = n*1000;
		 number = (Math.round(x))/10;
		 return number.toFixed(1);
	}
	else{
		return "*";
	}
};

var comparePressed = false;

function comparison(Pressed){
	if (!Pressed){
		comparePressed = true;
		d3.select("#compareButton").style("background-color", "red");
		//change css file to make room for comparison data
		changeCSS('css/compareCounty.css', 5);
		//reset map to us
		xclickZoom(centered);
	}
	else{
		comparePressed = false;
		d3.select("#compareButton").style("background-color", "white");
		//reset the css file to the original
		changeCSS('css/singleCounty.css', 5);
		//reset the map to the us (or to the county first selected)
		updateData(selectedCounty);
	}
}

//
var width = parseInt(d3.select('.container').style('max-width')),
	mapRatio = .7,
    height = width * mapRatio,
    selected,
    centered,
    colored;
    
	if(!width){
		width= 480;
		height = width *mapRatio;
	}
 		
 	

var sizeById = d3.map();
var nameById = d3.map();
var stateById = d3.map();

/* THRESHOLD SCALE CODE */
var color = d3.scale.threshold()
    .domain([1, 2])
    .range(["Sm", "Md", "Lg"]);


var projection = d3.geo.albersUsa()
    .scale(width )
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
	.projection(projection);
	
var zoom = d3.behavior.zoom()
    .translate(projection.translate())
    .scale(projection.scale())
    .scaleExtent([1, 1])
    .on("zoom", zoomed);

var map = d3.select("#map").style("width", width + "px").style("height", height +"px");
	
var underMap = d3.select("#underMap").style("width", width + "px");
	
var infoBar = map.append("infoBar")
	.attr("id", "infoBar");

var svg = map.append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "All");


var rect=  svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", updateData);
    
 var legend = map.append("legend")
		.style('bottom', '0px');


 var popInfo = map.append("div").attr("id", "popInfo").style("display", "none");
 		popInfo.append("p").text("Large counties have a population greater than 500,000");
 		popInfo.append("p").text("Medium-sized counties have a population between 50,000 - 500,000");
 		popInfo.append("p").text("Small counties have a population less than 50,000");
 		popInfo.append("p").html("<em>County population values come from the U.S. Census Bureau’s population estimates, vintage 2012.</em>");
 		

 legend.append("strong").text("Choose to Compare by 2012 Population").on("mouseover", function(){d3.select("#popInfo").transition().style("display", "block");}).on("mouseout", function(){d3.select("#popInfo").transition().style("display", "none");}).text("Size determined by population");
	
 	
 	
 	function BoxSwitch(Box){
 		//fist reset all colors to initial values
 		d3.select("#lgBox").style("background", "#0A84C1");
 		d3.select("#mdBox").style("background", "#60AFD7");
 		d3.select("#smBox").style("background", "#C9E4F2");
 		//then color one if neccessary
 		switch(Box){
 			case "Lg": d3.select("#lgBox").style("background", "#FFA601");
 						d3.select("#mdBox").style("background", "#aaa");
 						d3.select("#smBox").style("background", "#aaa");
 				break;
 			case "Md": d3.select("#mdBox").style("background", "#FFA601");
 						d3.select("#lgBox").style("background", "#aaa");
 						d3.select("#smBox").style("background", "#aaa");
 				break;
 			case "Sm": d3.select("#smBox").style("background", "#FFA601");
 						d3.select("#mdBox").style("background", "#aaa");
 						d3.select("#lgBox").style("background", "#aaa");
 				break;
 			default: break;
 		}
 	}
 	
 	var legendLg = legend.append("legendLg").attr("class", "legendOption").on("click", function() { d3.selectAll("svg").classed(false).transition().attr("class", "legendLg"); BoxSwitch("Lg"); });
 		legendLg.append("i").attr("id", "lgBox");
 		legendLg.append("p").text("Large Counties");
  	var legendMd = legend.append("legendMd").attr("class", "legendOption").on("click", function() { d3.selectAll("svg").classed(false).transition().attr("class", "legendMd"); BoxSwitch("Md");});
 		legendMd.append("i").attr("id", "mdBox");
 		legendMd.append("p").text("Medium-sized Counties");
  	var legendSm = legend.append("legendSm").attr("class", "legendOption").on("click", function() { d3.selectAll("svg").classed(false).transition().attr("class", "legendSm"); BoxSwitch("Sm");});
 		legendSm.append("i").attr("id", "smBox");
 		legendSm.append("p").text("Small Counties");
 	var legendAll = legend.append("legendAll").attr("class", "legendOption").on("click", function() { d3.selectAll("svg").classed(false).transition().attr("class", "All"); BoxSwitch("All"); xclickZoom(centered); document.getElementById("frm1").reset(); });
 		legendAll.append("i").style('background', 'none');
 		legendAll.append("p").text("All Counties");
 	var legendNote = legend.append("p").attr("class", "note");
 		BoxSwitch("All");

var dataNote = map.append("dataNote").attr("class", "dataNote");
	function emailLink(){
		open("mailto:research@naco.org");
	}
	
	dataNote.append("p").attr("class", "note").on("click", emailLink).text("Questions? Let us know at research@naco.org");
	
var g = svg.append("g")
	    .call(zoom);

var timePeriod = "";
var timePeriodText = "2012-2013";

var selectedCounty;

  var sizeById = {};
  var nameById = {};
  var stateById = {};
  var statePathById = {};
  var countyPathById = {};
  var linkById = {};
//2013 Data Arrays
  var GDP13ById = {};
  var unem13ById = {};
  var HH13ById = {};
  var avgWage13ById = {};
  var jobs13ById = {};
  var avgUnem13ById = {};
//Recession Data Arrays
  var GDPDRById = {};
  var unemDRById = {};
  var HHDRById = {};
  var avgWageDRById = {};
  var jobsDRById = {};
  var avgUnemDRById = {};
//Recovery Data Arrays
  var GDPPRById = {};
  var unemPRById = {};
  var HHPRById = {};
  var avgWagePRById = {};
  var jobsPRById = {};
  var avgUnemPRById = {};
//Long-term Data Arrays
  var GDPLTById = {};
  var unemLTById = {};
  var HHLTById = {};
  var avgWageLTById = {};
  var jobsLTById = {};

d3.select(window).on('resize', resize);

function resize() {
/*    // adjust things when the window size changes
    width = parseInt(d3.select('.container').style('max-width'));
    height = width * mapRatio;

    // update projection
    projection
    	.scale(width*1.11)
    	.translate([width / 2, height / 2]);

    // resize the map container
    map
        .style('width', width + 'px')
        .style('height', height + 'px');

	svg
		.attr("width", width)
		.attr("height", height);
		
	rect
		.attr("width", width)
		.attr("height", height);

    // resize the map
    map.select('.land').attr('d', path);
    map.selectAll('.state').attr('d', path);
*/
}


queue()
    .defer(d3.json, "us.json")
    .defer(d3.tsv, "CountyData.tsv")
    .await(ready);
 

function ready(error, us, CountyData) {
	
	
	CountyData.forEach(function(d) { 
	  		sizeById[d.id] = +d.LgMdSm, 
	  		nameById[d.id] = d.geography,
	  		stateById[d.id] = + d.stateFips,
	  		linkById[d.id] = d.profLink;
	  	//2013 Values
	  		GDP13ById[d.id] = + d.RGDPGrowth13,
	  		unem13ById[d.id] = + d.unemGrowth13,
	  		HH13ById[d.id] = + d.HHpriceGrowth13,
	  		avgWage13ById[d.id] = + d.avgWageGrowth13,
	  		jobs13ById[d.id] = + d.jobsGrowth13;
	  		avgUnem13ById[d.id] = + d.avgUnem13;
	  	//Recession Values
	  		GDPDRById[d.id] = + d.RGDPGrowthDR,
	  		unemDRById[d.id] = + d.unemLostDR,
	  		HHDRById[d.id] = + d.HHpriceGrowthDR,
	  		avgWageDRById[d.id] = + d.avgWageGrowthDR,
	  		jobsDRById[d.id] = + d.jobsGrowthDR;
	  		avgUnemDRById[d.id] = + d.avgUnemDR;
	  	//Recovery Values
	  		GDPPRById[d.id] = + d.RGDPGrowthPR,
	  		unemPRById[d.id] = + d.unemGainedPR,
	  		HHPRById[d.id] = + d.HHpriceGrowthPR,
	  		avgWagePRById[d.id] = + d.avgWageGrowthPR,
	  		jobsPRById[d.id] = + d.jobsGrowthPR;
	  		avgUnemPRById[d.id] = + d.avgUnemPR;
	  	//Long-term Values
	  		GDPLTById[d.id] = + d.RGDPGrowthLT,
	  		unemLTById[d.id] = + d.avgUnemLT,
	  		HHLTById[d.id] = + d.HHpriceGrowthLT,
	  		avgWageLTById[d.id] = + d.avgWageGrowthLT,
	  		jobsLTById[d.id] = + d.jobsGrowthLT;
		});

		var d, feats = topojson.feature(us, us.objects.states).features;
		for (var i=0; i<feats.length; i++) { 
        	d = feats[i];
        	statePathById[d.id] = d;
		}
		
		var d, feats = topojson.feature(us, us.objects.counties).features;
		for (var i=0; i<feats.length; i++) { 
        	d = feats[i];
        	countyPathById[d.id] = d;
		}
		
	
	  g.append("g")
	      .attr("id", "states")
	    .selectAll("path")
	      .data(topojson.feature(us, us.objects.states).features)
	    .enter().append("path")
	    	.attr("d", path);
	    	//.attr("id", function(d){ return stateById[d.id]})

		var fullReport = d3.select("#infoBar").append("div").attr("id", "fullReport");
			fullReport.append("p").html('<a href="http://www.naco.org/countyTracker">Read the full report</a>');
		
		//create the form element for selecting/zooming to states
			xState = "";
			
			var xStateOptions = {
					"Select a State": "",
					"All States": "US",
					"Alabama": 1,
					"Alaska": 2,
					"Arizona": 4,
					"Arkansas": 5,
					"California": 6,
					"Colorado": 8,
					"Connecticut": 9,
					"Delaware": 10,
					"District of Columbia": 24,
					"Florida": 12,
					"Georgia": 13,
					"Hawaii": 15,
					"Idaho": 16,
					"Illinois": 17,
					"Indiana": 18,
					"Iowa": 19,
					"Kansas": 20,
					"Kentucky": 21,
					"Louisiana": 22,
					"Maine": 23,
					"Maryland": 24,
					"Massachussetts": 25,
					"Michigan": 26,
					"Minnesota": 27,
					"Mississippi": 28,
					"Missouri": 29,
					"Montana": 30,
					"Nebraska": 31,
					"Nevada": 32,
					"New Hampshire": 33,
					"New Jersey": 34,
					"New Mexico": 35,
					"New York": 36,
					"North Carolina": 37,
					"North Dakota": 38,
					"Ohio": 39,
					"Oklahoma": 40,
					"Oregon": 41,
					"Pennsylvania": 42,
					"Rhode Island": 44,
					"South Carolina": 45,
					"Tennessee": 47,
					"Texas": 48,
					"Utah": 49,
					"Vermont": 50,
					"Virginia": 51,
					"Washington": 53,
					"West Virginia": 54,
					"Wisconsin": 55,
					"Wyoming": 56,
				};
		
			var selectUI = d3.select("#infoBar").append("form").attr("id", "frm1");
					
			
			   	d3.select("form").append("select")
			    	.on("change", change)
				.selectAll("option").data(d3.values(xStateOptions)).enter().append("option")
			    	.attr("value", function(d){ return d; }) /* Optional */
			    	.data(d3.keys(xStateOptions)).text(function(d){ return d; });
			    
			function change() {
			    xState = this.options[this.selectedIndex].value;
			    
			    
			   if(xState==06 | xState==48 | xState==16){
			    	bigClickZoom(statePathById[xState]);
			   }
			  	/*else if(xState=="US" | xState==""){
			  		return
			  	}*/
			    else if(xState==24 | xState==44 | xState==25 | xState==9 | xState==34 | xState==10){
			    	littleClickZoom(statePathById[xState]);
			    }
			    else{
			    	xclickZoom(statePathById[xState]);
			    }
			};
	
		function clearInfoBar(){
			d3.selectAll(".selectATime").remove();
	 		d3.selectAll("#infoUpdate").remove();
	 		d3.selectAll(".linkDir").remove();
		}		
			
		var USmapButton = d3.select("#infoBar").append("div").attr("id", "USmapButton").on("click", function(){ xclickZoom(centered); clearInfoBar(); });
			USmapButton.text("Return to US Map");
			//END form element section      
		
		var compareButton = d3.select("#infoBar").append("div").attr("id", "compareButton").on("click", function(){ comparison(comparePressed); });
			compareButton.text("Compare");
		
	  g.append("g")
	      .attr("id", "counties")
	    .selectAll("path")
	      .data(topojson.feature(us, us.objects.counties).features)
	    .enter().append("svg:path")
	      .attr("d", path)
	      .attr("class", function(d) { return  color(sizeById[d.id]); })
	      .attr("id", function(d){ return stateById[d.id]; })
	      .on("click", clickUpdateData)
	      .on("dblclick", followLink)
	      .attr("stateFip", function(d) { return stateById[d.id]; })
	      .append("svg:title")
	      	.text(function(d) {return nameById[d.id]; });
	
	 
	 //state borders from Zoom example      
	  g.append("path")
	      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
	      .attr("id", "state-borders")
	      .attr("d", path);
	      
	  xclickZoom(centered);    
	  
}

	function clickUpdateData(d) {
			console.log(d.id);
			//infoBar.transition().style("height", "35 %");
			//map.style("height", "30%");
			updateData(d);
			highlightSelected(d);
			xclickZoom(d);
			document.getElementById("frm1").reset();
	}
		
//Indicator Definition Boxes (need to add #GDPTitle to all title text)
//time period specific information is appended within the time period IF statements
var GDPDefBox = infoBar.append("div").attr("class", "popInfo").attr("id", "GDPDefBox").style("display", "none");
	GDPDefBox.append("p").html("Total value of goods and services produced in a county, known as GDP.  The growth rates of county output are inflation-adjusted.  <br/><em>Source: Moody’s Analytics</em>");
var avgUnemDefBox = infoBar.append("div").attr("class", "popInfo").attr("id", "avgUnemDefBox").style("display", "none");
 	avgUnemDefBox.append("p").html("The average proportion of the civilian labor force that is unemployed.  <br/><em>Source: Moody’s Analytics</em>");
 	//unemPPBox.append("p").text("Medium-sized counties have a population between 50,000 - 500,000");
var unemDefBox = infoBar.append("div").attr("class", "popInfo").attr("id", "unemDefBox").style("display", "none");
 	unemDefBox.append("p").html("Unemployment Rate Change measures the difference between two unemployment rates in percentage point units. <br/><em>Source: Moody's Analytics</em>");
 	//unemPPBox.append("p").text("Medium-sized counties have a population between 50,000 - 500,000");
var HHDefBox = infoBar.append("div").attr("class", "popInfo").attr("id", "HHDefBox").style("display", "none");
	HHDefBox.append("p").html("Median sales prices of existing single-family homes.  <br/><em>Source: Moody’s Analytics</em>");
var jobsDefBox = infoBar.append("div").attr("class", "popInfo").attr("id", "jobsDefBox").style("display", "none");
	jobsDefBox.append("p").html("Total wage and salary jobs, whether full or part-time, temporary or permanent in a county.  This counts the number of jobs, not employed people, for all employers in a county, not only for the county government.  <br/><em>Source: Moody’s Analytics</em>");

function changeCSS(cssFile, cssLinkIndex){
		var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
		
		var newlink = document.createElement("link");
		newlink.setAttribute("rel", "stylesheet");
		newlink.setAttribute("href", cssFile);
		
		document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
	}

	 function updateData(d) {
	 		
	 	if(d){
	 		if(!comparePressed){
	 			selectedCounty = d;
	 		}
	 		else{
	 			comparisonCounty = d;
	 		}
	 		
	 			
			d3.selectAll(".selectATime").remove();
			
	 		d3.selectAll("#infoUpdate").remove();
	 		var infoUpdate = infoBar.append("infoUpdate").attr("id", "infoUpdate");
	 	
		 	
		 	var countyName = infoUpdate.append("titlebox").attr("id", "countyTitle").style("background-color", "white").transition().style("background-color", "#0A84C1");
		 		d3.select("#countyTitle").append("div").attr("id", "singleTitle").text(function(){ return nameById[selectedCounty.id].toUpperCase(); });
		 		
		 		if(comparePressed){
		 			d3.select("#countyTitle").append("div").attr("id", "compTitle").text(function(){ return nameById[comparisonCounty.id].toUpperCase(); });
		 		}
		 	
		 }
		
		
		if(timePeriod=="ST"){
				d3.selectAll(".timePeriodSelect").classed(false).attr("class", "timePeriods");
				d3.select("#ST").classed(false).attr("class", "timePeriodSelect");
				
			changeCSS('css/notLT.css', 4);
				
			infoUpdate.append("gdpbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "GDPTitle").text("Real Output (GDP) Annualized" + " Growth Rate, " + timePeriodText);
				d3.selectAll("gdpbox").append("gdpnum").attr("class", "dataNum").append("div").attr("id", "singleNum").text(function(){return percentage(GDP13ById[selectedCounty.id]) + "%"; });
			infoUpdate.append("avgunembox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "avgUnemTitle").html("Unemployment Rate, " + "<br/>" + "2013");
				d3.selectAll("avgunembox").append("avgunemnum").attr("class", "dataNum").text(function(){return percentage(avgUnem13ById[selectedCounty.id]) + "%"; });
			infoUpdate.append("unembox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "unemTitle").html("Unemployment" + "<br/>" + " Rate Change*, " + timePeriodText);
				d3.selectAll("unembox").append("unemnum").attr("class", "dataNum").text(function(){return percentage(unem13ById[selectedCounty.id]) + "pps"; });
			infoUpdate.append("hhbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "HHTitle").text("Median Home Prices Annualized" + " Growth Rate, " + timePeriodText);
				d3.selectAll("hhbox").append("hhnum").attr("class", "dataNum").text(function(){return percentage(HH13ById[selectedCounty.id]) + "%"; });
			/*infoUpdate.append("avgwagebox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").text("Average Wage Per Job Annualized Growth Rate, " + timePeriodText);
				d3.selectAll("avgwagebox").append("avgwagenum").attr("class", "dataNum").text(function(){return percentage(avgWage13ById[d.id]) });*/
			infoUpdate.append("jobsbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "jobsTitle").html("Jobs Annualized" + "<br/>" + " Growth Rate, " + timePeriodText);
				d3.selectAll("jobsbox").append("jobsnum").attr("class", "dataNum").text(function(){return percentage(jobs13ById[selectedCounty.id]) + "%"; });
				
			//comparison data
			if(comparePressed){
				d3.selectAll("gdpnum").append("div").attr("id", "compNum").text(function(){return percentage(GDP13ById[comparisonCounty.id]) + "%"; });
				d3.selectAll("avgunemnum").append("div").attr("id", "compNum").text(function(){return percentage(avgUnem13ById[comparisonCounty.id]) + "%"; });
				d3.selectAll("unemnum").append("div").attr("id", "compNum").text(function(){return percentage(unem13ById[comparisonCounty.id]) + "pps"; });
				d3.selectAll("hhnum").append("div").attr("id", "compNum").text(function(){return percentage(HH13ById[comparisonCounty.id]) + "%"; });
				d3.selectAll("jobsnum").append("div").attr("id", "compNum").text(function(){return percentage(jobs13ById[comparisonCounty.id]) + "%"; });
			}
		}
		if(timePeriod=="DR"){
				d3.selectAll(".timePeriodSelect").classed(false).attr("class", "timePeriods");
				d3.select("#DR").classed(false).attr("class", "timePeriodSelect");
				
			changeCSS('css/notLT.css', 4);
				
			infoUpdate.append("gdpbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "GDPTitle").text("Real Output (GDP) Annualized" + " Growth Rate, " + timePeriodText);
				d3.selectAll("gdpbox").append("gdpnum").attr("class", "dataNum").text(function(){return percentage(GDPDRById[selectedCounty.id]) + "%"; });
			infoUpdate.append("avgunembox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "avgUnemTitle").html("Average Annual Unemployment Rate, " + timePeriodText);
				d3.selectAll("avgunembox").append("avgunemnum").attr("class", "dataNum").text(function(){return percentage(avgUnemDRById[selectedCounty.id]) + "%"; });
			infoUpdate.append("unembox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "unemTitle").text("Average Annual Unemployment" + " Change*, " + timePeriodText);
				d3.selectAll("unembox").append("unemnum").attr("class", "dataNum").text(function(){return percentage(unemDRById[selectedCounty.id])+ "pps"; });
			infoUpdate.append("hhbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "HHTitle").text("Median Home Prices Annualized" + " Growth Rate, " + timePeriodText);
				d3.selectAll("hhbox").append("hhnum").attr("class", "dataNum").text(function(){return percentage(HHDRById[selectedCounty.id]) + "%"; });
			/*infoUpdate.append("avgwagebox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").text("Average Wage Per Job Growth Rate, " + timePeriodText);
				d3.selectAll("avgwagebox").append("avgwagenum").attr("class", "dataNum").text(function(){return percentage(avgWageDRById[d.id]) });*/
			infoUpdate.append("jobsbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "jobsTitle").html("Jobs Annualized" + "<br/>" + " Growth Rate, " + timePeriodText);
				d3.selectAll("jobsbox").append("jobsnum").attr("class", "dataNum").text(function(){return percentage(jobsDRById[selectedCounty.id]) + "%"; });
		}
		if(timePeriod=="PR"){
				d3.selectAll(".timePeriodSelect").classed(false).attr("class", "timePeriods");
				d3.select("#PR").classed(false).attr("class", "timePeriodSelect");
				
			changeCSS('css/notLT.css', 4);
			
			infoUpdate.append("gdpbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "GDPTitle").text("Real Output (GDP) Annualized" + " Growth Rate, " + timePeriodText);
				d3.selectAll("gdpbox").append("gdpnum").attr("class", "dataNum").text(function(){return percentage(GDPPRById[selectedCounty.id]) + "%"; });
			infoUpdate.append("avgunembox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "avgUnemTitle").html("Average Annual Unemployment Rate, " + timePeriodText);
				d3.selectAll("avgunembox").append("avgunemnum").attr("class", "dataNum").text(function(){return percentage(avgUnemPRById[selectedCounty.id]) + "%"; });
			infoUpdate.append("unembox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "unemTitle").text("Average Annual Unemployment" + " Change*, " + timePeriodText);
				d3.selectAll("unembox").append("unemnum").attr("class", "dataNum").text(function(){return percentage(unemPRById[selectedCounty.id]) + "pps"; });
			infoUpdate.append("hhbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "HHTitle").text("Median Home Prices Annualized" + " Growth Rate, " + timePeriodText);
				d3.selectAll("hhbox").append("hhnum").attr("class", "dataNum").text(function(){return percentage(HHPRById[selectedCounty.id]) + "%"; });
			/*infoUpdate.append("avgwagebox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").text("Average Wage Per Job Growth Rate, " + timePeriodText);
				d3.selectAll("avgwagebox").append("avgwagenum").attr("class", "dataNum").text(function(){return percentage(avgWagePRById[d.id]) });*/
			infoUpdate.append("jobsbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "jobsTitle").html("Jobs Annualized" + "<br/>" + " Growth Rate, " + timePeriodText);
				d3.selectAll("jobsbox").append("jobsnum").attr("class", "dataNum").text(function(){return percentage(jobsPRById[selectedCounty.id]) + "%"; });
		}
		if(timePeriod=="LT"){
				d3.selectAll(".timePeriodSelect").classed(false).attr("class", "timePeriods");
				d3.select("#LT").classed(false).attr("class", "timePeriodSelect");
				
			changeCSS('css/LT.css', 4);
			
			infoUpdate.append("gdpbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "GDPTitle").text("Real Output (GDP) Annualized" + " Growth Rate, " + timePeriodText);
				d3.selectAll("gdpbox").append("gdpnum").attr("class", "dataNum").text(function(){return percentage(GDPLTById[selectedCounty.id]) + "%"; });
			infoUpdate.append("unembox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "unemTitle").html("Average Annual Unemployment,*" + "<br/>" + timePeriodText);
				d3.selectAll("unembox").append("unemnum").attr("class", "dataNum").text(function(){return percentage(unemLTById[selectedCounty.id]) + "%";});
			infoUpdate.append("hhbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "HHTitle").text("Median Home Prices Annualized" + " Growth Rate, " + timePeriodText);
				d3.selectAll("hhbox").append("hhnum").attr("class", "dataNum").text(function(){return percentage(HHLTById[selectedCounty.id]) + "%"; });
			/*infoUpdate.append("avgwagebox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").text("Average Wage Per Job Growth Rate, " + timePeriodText);
				d3.selectAll("avgwagebox").append("avgwagenum").attr("class", "dataNum").text(function(){return percentage(avgWageLTById[d.id]) });*/
			infoUpdate.append("jobsbox").attr("class", "dataBox").append("datatitle").attr("class", "dataTitle").attr("id", "jobsTitle").html("Jobs Annualized" + "<br/>" + " Growth Rate, " + timePeriodText);
				d3.selectAll("jobsbox").append("jobsnum").attr("class", "dataNum").text(function(){return percentage(jobsLTById[selectedCounty.id]) + "%"; });
		}
		///indicator definitions
				
		d3.select("#unemTitle").on("mouseover", function(){d3.select("#unemDefBox").transition().style("display", "block");}).on("mouseout", function(){d3.select("#unemDefBox").transition().style("display", "none");});
		d3.select("#avgUnemTitle").on("mouseover", function(){d3.select("#avgUnemDefBox").transition().style("display", "block");}).on("mouseout", function(){d3.select("#avgUnemDefBox").transition().style("display", "none");});
		d3.select("#GDPTitle").on("mouseover", function(){d3.select("#GDPDefBox").transition().style("display", "block");}).on("mouseout", function(){d3.select("#GDPDefBox").transition().style("display", "none");});
		d3.select("#HHTitle").on("mouseover", function(){d3.select("#HHDefBox").transition().style("display", "block");}).on("mouseout", function(){d3.select("#HHDefBox").transition().style("display", "none");});
		d3.select("#jobsTitle").on("mouseover", function(){d3.select("#jobsDefBox").transition().style("display", "block");}).on("mouseout", function(){d3.select("#jobsDefBox").transition().style("display", "none");});
					
			if(timePeriod==""){
				d3.selectAll(".selectATime").remove();
				selectATime = infoBar.append("strong").attr("class", "selectATime").text("Please select a time-period above to view data for this county economy");				
			}
			
			currentLink = linkById[d.id];
			
			d3.selectAll(".linkDir").remove();
			var linkDir = infoBar.append("p").attr("class", "linkDir").html("<a href ='" + currentLink + "' target='_blank'>" + "Double Click a county economy for a full, printable report" + "</a>");
					
	}

	 //Time Period Selections
	 var timePeriodOptions = {
	 	"2012-2013" : "ST",
	 	"Recession" : "DR",
	 	"Recovery" : "PR",
	 	"Long-Term" : "LT"
	 };
	 
	 var timePeriodUI = d3.select("#infoBar").append("div").attr("id", "timePeriodBox");
	
	d3.select("#timePeriodBox").append("tselect")
	.selectAll("toption").data(d3.values(timePeriodOptions)).enter().append("toption")
		.on("click", timeUpdate)
		.attr("class", "timePeriods")		
		.attr("id", function(d){return d; })
		.data(d3.keys(timePeriodOptions))
			.attr("value", function(d){ return d; });
		
	d3.selectAll(".timePeriods").append("p")
		.data(d3.keys(timePeriodOptions)).text(function(d){ return d; });
	  
	 	function timeUpdate() {
	 		timePeriod = this.id;
	 		timePeriodText = this.getElementsByTagName('p')[0].innerHTML;
	 		if(!comparePressed){
	 			updateData(selectedCounty);
	 		}
	 		else{
	 			updateData(comparisonCounty);
	 		}
	 	}
	// END Time period selections
	//time period hover definitions
	var STDefBox = timePeriodUI.append("div").attr("class", "popInfo").attr("id", "STDefBox").style("display", "none");
		STDefBox.append("p").text("Growth rate (change for the unemployment rate) over the most recent year, based on annual estimates.");
	var DRDefBox = timePeriodUI.append("div").attr("class", "popInfo").attr("id", "DRDefBox").style("display", "none");
		DRDefBox.append("p").text("Pre-recession peak to the year with the trough value for an indicator for a county during the latest U.S. economic downturn.  The difference between the pre-recession peak and the trough value has to be larger than one percent of the peak value.  A value of zero for the growth rate of an indicator during the recession indicates that no recession occurred for that indicator.");
	var PRDefBox = timePeriodUI.append("div").attr("class", "popInfo").attr("id", "PRDefBox").style("display", "none");
		PRDefBox.append("p").text("Trough year to 2013 for an indicator for a county.  If the county had no recession, the recovery period is from peak to 2013.  A value of zero for the growth rate of an indicator during recovery means that the county has not yet entered into the recovery period on that indicator.");
	var LTDefBox = timePeriodUI.append("div").attr("class", "popInfo").attr("id", "LTDefBox").style("display", "none");
		LTDefBox.append("p").text("1990 to the pre-recession peak year for an indicator for a county.  This provides a benchmark to compare the current growth rates in a county.");
	

	
	d3.select("#ST").on("mouseover", function(){d3.select("#STDefBox").transition().delay(500).style("display", "block");}).on("mouseout", function(){d3.select("#STDefBox").transition().style("display", "none");});
	d3.select("#DR").on("mouseover", function(){d3.select("#DRDefBox").transition().delay(500).style("display", "block");}).on("mouseout", function(){d3.select("#DRDefBox").transition().style("display", "none");});
	d3.select("#PR").on("mouseover", function(){d3.select("#PRDefBox").transition().delay(500).style("display", "block");}).on("mouseout", function(){d3.select("#PRDefBox").transition().style("display", "none");});
	d3.select("#LT").on("mouseover", function(){d3.select("#LTDefBox").transition().delay(500).style("display", "block");}).on("mouseout", function(){d3.select("#LTDefBox").transition().style("display", "none");});
		

function followLink(d) {
	open(linkById[d.id], '_blank');
}

function highlightSelected(d){
	if (d && selected !== d) {
	    selected = d;
	  } else {
	    selected = null;
	  }

	g.selectAll("path")
      .classed("active", selected && function(d) { return d === selected; });
      
}




//Zoom functions. 
	var k = 1,
		x,
		y;
		mapSkewx = 0;
		mapSkewy = 0;	
	
	function xclickZoom(d) {
		
	
	  if (d && centered !== d) {
	    var centroid = path.centroid(d);
	    x = centroid[0];
	    y = centroid[1];
	    k = 4;
	    centered = d;
	    if(timePeriod!=""){
	    	y+= 50; 
	    }
	  } else {
	    x = width / 2;
	    y = height / 1.5;
	    k = 1;
	    centered = null;
	  }
	
		g.selectAll("path")
	      .classed("active", centered && function(d) { return d === centered; });
	  
		g.transition()
	      .duration(750)
	      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	      .style("stroke-width", 1.5 / k + "px");
	
	  d3.selectAll("#state-borders").style("stroke-width", 2/k +"px");
	
	}
	
	function bigClickZoom(d) {
		
	
	  if (d && centered !== d) {
	    var centroid = path.centroid(d);
	    x = centroid[0];
	    y = centroid[1];
	    k = 3;
	    centered = d;
	  } else {
	    x = width / 2;
	    y = height / 1.5;
	    k = 1;
	    centered = null;
	  }
	
	  g.selectAll("path")
	      .classed("active", centered && function(d) { return d === centered; });
	
	  g.transition()
	      .duration(750)
	      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	      .style("stroke-width", 1.5 / k + "px");
	
	  d3.selectAll("#state-borders").style("stroke-width", 2/k +"px");
	
	}
	
	function littleClickZoom(d) {
		var x, y;
	
	  if (d && centered !== d) {
	    var centroid = path.centroid(d);
	    x = centroid[0];
	    y = centroid[1];
	    k = 6;
	    centered = d;
	  } else {
	    x = width / 2;
	    y = height / 1.5;
	    k = 1;
	    centered = null;
	  }
	
	  g.selectAll("path")
	      .classed("active", centered && function(d) { return d === centered; });
	
	  g.transition()
	      .duration(750)
	      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	      .style("stroke-width", 1.5 / k + "px");
	      
	  d3.selectAll("#state-borders").style("stroke-width", 2/k +"px");
	      
	}

function zoomed() {
/*
	if(k>1){
		var xDrag = d3.event.translate[0];
		var yDrag = d3.event.translate[1];
		svg.attr("transform",
			"translate(" + xDrag + ", " + yDrag + ")"
			+ " scale(1)");
		mapSkewx = xDrag/10;
		mapSkewy = yDrag/10;
		console.log( mapSkewx, mapSkewy);
	  	document.getElementById("frm1").reset();
  }
*/
}
