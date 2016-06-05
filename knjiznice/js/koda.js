
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";




/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
 
var ehrIDs = ["","25baab93-e118-4710-9f2c-b53635dc4965","65014d0f-3c5c-49a7-b1da-894c8037865d","5db5fba4-1df8-4b2f-943d-ab90d1e5d48e"];



var pod = [["empty"],
        ["Lojze", "Kovač", "1994-10-15T13:14", "MALE"], 
        ["Matej", "Koren", "1970-08-26T00:00", "MALE"], 
        ["Teja", "Novak", "1998-11-09T00:00", "FEMALE"]
    ];
 
function generirajPodatke(stPacienta) {
    var sessionId = getSessionId();

    var ime = pod[stPacienta][0];
    var priimek = pod[stPacienta][1];
    var datumRojstva = pod[stPacienta][2];
    var spol = pod[stPacienta][3];
    var d = $("#sporocilo");
    
    $.ajaxSetup({
        headers: {"Ehr-Session": sessionId}
    });
    $.ajax({
        url: baseUrl + "/ehr",
        type: 'POST',
        success: function (data) {
            var ehrId = data.ehrId;
            var partyData = {
                firstNames: ime,
                gender: spol,
                lastNames: priimek,
                dateOfBirth: datumRojstva,
                partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
            };
            $.ajax({
                url: baseUrl + "/demographics/party",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(partyData),
                success: function (party) {
                    if (party.action == 'CREATE') {
                        for(var i = 0; i<podMeritve.length; i++)
                            if(i%3 == stPacienta-1)
                                addData(i, ehrId);
                                
                        console.log("Podatki so generirani");
                        d.html(d.html()+ehrId+"<br>");
                        ehrIDs[stPacienta] = ehrId;
                        return ehrId;
                    }
                },
                error: function(err) {
                    console.log("Napaka pri ustvarjanju podatkov\n", err);
                    return '-1';
                }
            });
        }
    });

}

var podMeritve = [
    ["2016-05-20T07:20", 180, 80, 35, 120, 90, 97, "Metka"],
    ["2016-03-01T20:10", 170, 100, 37, 122, 95, 99, "Liza"],
    ["2016-08-05T12:45", 185, 75, 36, 110, 93, 98, "Matic"],
    ["2016-04-20T07:20", 181, 81, 35, 120, 90, 97, "Metka"],
    ["2016-01-01T20:10", 169, 97, 37, 122, 95, 99, "Liza"],
    ["2016-08-05T12:45", 185, 72, 36, 110, 93, 98, "Matic"],
    ["2016-04-25T07:20", 185, 79, 35, 120, 90, 97, "Metka"],
    ["2016-01-10T20:10", 172, 90, 37, 122, 95, 99, "Liza"],
    ["2016-08-08T12:45", 190, 75, 36, 110, 93, 98, "Matic"],
    ["2016-08-25T07:20", 189, 78, 35, 120, 90, 97, "Metka"],
    ["2016-09-10T20:10", 170, 89, 37, 122, 95, 99, "Liza"],
    ["2016-10-08T12:45", 200, 76, 36, 110, 93, 98, "Matic"],
    ["2016-08-11T07:20", 190, 82, 35, 120, 90, 97, "Metka"],
    ["2016-09-16T20:10", 175, 86, 37, 122, 95, 99, "Liza"],
    ["2016-10-20T12:45", 198, 78, 36, 110, 93, 98, "Matic"],
    ["2016-08-27T07:20", 190, 80, 35, 120, 90, 97, "Metka"],
    ["2016-09-16T20:10", 168, 83, 37, 122, 95, 99, "Liza"],
    ["2016-10-09T12:45", 205, 80, 36, 110, 93, 98, "Matic"],
    ["2016-12-25T07:20", 190, 81, 35, 120, 90, 97, "Metka"],
    ["2016-02-10T20:10", 171, 88, 37, 122, 95, 99, "Liza"]];

function addData(stPacienta, ehrId){
  var sessionId = getSessionId();

	var datumInUra = podMeritve[stPacienta][0];
	var telesnaVisina = podMeritve[stPacienta][1];
	var telesnaTeza = podMeritve[stPacienta][2];
	var telesnaTemperatura = podMeritve[stPacienta][3];
	var sistolicniKrvniTlak = podMeritve[stPacienta][4];
	var diastolicniKrvniTlak = podMeritve[stPacienta][5];
	var nasicenostKrviSKisikom = podMeritve[stPacienta][6];
	var merilec = podMeritve[stPacienta][7];

	
	$.ajaxSetup({
	    headers: {"Ehr-Session": sessionId}
	});
	var podatki = {
		// Struktura predloge je na voljo na naslednjem spletnem naslovu:
  // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
	    "ctx/language": "en",
	    "ctx/territory": "SI",
	    "ctx/time": datumInUra,
	    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
	    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
	   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
	    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
	    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
	    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
	    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom
	};
	var parametriZahteve = {
	    ehrId: ehrId,
	    templateId: 'Vital Signs',
	    format: 'FLAT',
	    committer: merilec
	};
	$.ajax({
	    url: baseUrl + "/composition?" + $.param(parametriZahteve),
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify(podatki),
	    success: function (res) {
	        //done
	    },
	    error: function(err) {
	    	console.log("Error adding data to patient");
	    }
	});
}


// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija

//                            String  Year cm      kg
function calculateDailyIntake(gender, age, height, weight){
    if(gender == "MALE")
        return (10 * weight + 6.25 * height - 5 * age + 5);
    else if (gender == "FEMALE")
        return (10 * weight + 6.25 * height - 5 * age - 161);
    else
        return (-1);
}

var dailyIntake = 0;


var htmlContentTemplate = `<div style="padding-top:30px; text-align:left; display:inline-block; width:60%">
              <p id="name" style="font-size:30px; font-weight:bold;"></p>
              <div style="padding-left:7%;" id="podatki">
                <strong style="font-size:19px;">Starost:&nbsp;&nbsp;</strong><p style="padding-right:70px; font-size:19px;" id="age"></p>
                <strong style="font-size:19px;">Spol:&nbsp;&nbsp;</strong><p style="font-size:19px;" id="gender"></p>
              </div>
            </div>
            <div  style="display:inline-block; width:39%;">
              <strong style="font-size:14px;">Priporočen dnevni vnos:&nbsp;&nbsp;</strong>
              <strong style="font-size:24px;" id="dailyIntake"></strong>
            </div>
            <hr>
            <div id="weightGraph">
              
            </div>
            <hr>
            <button type="button" class="btn btn-primary btn-xs" onclick="predlagajRecepte();" style="width:150px; height:30px;">Predlagaj recepte</button>
            <div id="recipes" style="font-size:12px; display:none;">
              <h2>Zajtrk</h2>
              <div id="breakfast"></div>
              <h2>Kosilo</h2>
              <div id="lunch"></div>
              <h2>Večerja</h2>
              <div id="dinner"></div>
              <h2>Prigrizki</h2>
              <div id="snacks"></div>
            </div>`;

function preberiEHRodBolnika() {
    $('#podatkiContainer').html(htmlContentTemplate);
    
	var sessionId = getSessionId();

	var ehrId = $("#ehrIdInput").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$('#sporocilo').html('Prosimo vnesite EHR ID, ali izberite eno izmed oseb na seznamu.');
		$('#sporocilo').dialog({modal: true, buttons: { OK: function() {$(this).dialog('close');}}, title: 'Napaka'});
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$("#name").html(party.firstNames+" "+party.lastNames);
				var timeDiff = Math.abs(Date.now() - new Date(party.dateOfBirth).getTime());
				var age = Math.floor(timeDiff / (1000 * 3600 * 24 * 365));
                $('#age').html(age);
                if(party.gender == 'MALE')
				    $('#gender').html('Moški');
				else if(party.gender == 'FEMALE')
				    $('#gender').html('Ženski');
				else
				    $('#gender').html('Neznan');
				    
				    
			    //telesna teža
			    $.ajax({
				    url: baseUrl + "/view/" + ehrId + "/" + "weight",
				    type: 'GET',
				    headers: {"Ehr-Session": sessionId},
				    success: function (res) {
				    	if (res.length > 0) {
				    	    
				    	    //create graph
				    	    var margin = {top: 20, right: 20, bottom: 70, left: 40}, width = 500 - margin.left - margin.right, height = 400 - margin.top - margin.bottom;
                            
                            // Parse the date / time
                            var	parseDate = d3.time.format("%Y-%m-%d").parse;
                            var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
                            var y = d3.scale.linear().range([height, 0]);
                            
                            var xAxis = d3.svg.axis()
                                .scale(x)
                                .orient("bottom")
                                .tickFormat(d3.time.format("%Y-%m-%d"));
                            var yAxis = d3.svg.axis()
                                .scale(y)
                                .orient("left")
                                .ticks(10);
                            
                            $('#weightGraph').append("<div style='display:inline-block;' id='graph1'></div>");
                            $('#graph1').append("<p style='font-size:16px;'><strong>Telesna teža(kg):</strong></p>");
                            
                            var svg = d3.select("#graph1").append("svg")
                                .attr("width", width + margin.left + margin.right)
                                .attr("height", height + margin.top + margin.bottom)
                              .append("g")
                                .attr("transform", 
                                      "translate(" + margin.left + "," + margin.top + ")");
                            
                            res.forEach(function(d) {
                                d.time = parseDate(d.time.split('T')[0]);
                                d.weight = +d.weight;
                            });
                        	
                            x.domain(res.map(function(d) { return d.time; }));
                            y.domain([0, d3.max(res, function(d) { return d.weight; })]);
                        
                            svg.append("g")
                              .attr("class", "x axis")
                              .attr("transform", "translate(0," + height + ")")
                              .call(xAxis)
                            .selectAll("text")
                              .style("text-anchor", "end")
                              .attr("dx", "-.8em")
                              .attr("dy", "-.55em")
                              .attr("transform", "rotate(-90)" );
                        
                            svg.append("g")
                              .attr("class", "y axis")
                              .call(yAxis)
                            .append("text")
                              .attr("transform", "rotate(-90)")
                              .attr("y", 6)
                              .attr("dy", ".71em")
                              .style("text-anchor", "end")
                              .text("Value ($)");
                        
                            svg.selectAll("bar")
                              .data(res)
                            .enter().append("rect")
                              .style("fill", "red")
                              .attr("x", function(d) { return x(d.time); })
                              .attr("width", x.rangeBand())
                              .attr("y", function(d) { return y(d.weight); })
                              .attr("height", function(d) { return height - y(d.weight); });

					        
					        $.ajax({
            				    url: baseUrl + "/view/" + ehrId + "/" + "height",
            				    type: 'GET',
            				    headers: {"Ehr-Session": sessionId},
            				    success: function (res2) {
            				    	if (res2.length > 0) {
            				    	    
            				    	    //create graph
            				    	    $('#weightGraph').append("<div style='display:inline-block;' id='graph2'></div>");
                                        $('#graph2').append("<p style='font-size:16px;'><strong>Telesna višina(cm):</strong></p>");
            				    	    
                                        var svg = d3.select("#graph2").append("svg")
                                            .attr("width", width + margin.left + margin.right)
                                            .attr("height", height + margin.top + margin.bottom)
                                          .append("g")
                                            .attr("transform", 
                                                  "translate(" + margin.left + "," + margin.top + ")");
                                        
                                        res2.forEach(function(d) {
                                            d.time = parseDate(d.time.split('T')[0]);
                                            d.weight = +d.height;
                                        });
                                    	
                                        x.domain(res2.map(function(d) { return d.time; }));
                                        y.domain([0, d3.max(res2, function(d) { return d.height; })]);
                                    
                                        svg.append("g")
                                          .attr("class", "x axis")
                                          .attr("transform", "translate(0," + height + ")")
                                          .call(xAxis)
                                        .selectAll("text")
                                          .style("text-anchor", "end")
                                          .attr("dx", "-.8em")
                                          .attr("dy", "-.55em")
                                          .attr("transform", "rotate(-90)" );
                                    
                                        svg.append("g")
                                          .attr("class", "y axis")
                                          .call(yAxis)
                                        .append("text")
                                          .attr("transform", "rotate(-90)")
                                          .attr("y", 6)
                                          .attr("dy", ".71em")
                                          .style("text-anchor", "end")
                                          .text("Value ($)");
                                    
                                        svg.selectAll("bar")
                                          .data(res2)
                                        .enter().append("rect")
                                          .style("fill", "steelblue")
                                          .attr("x", function(d) { return x(d.time); })
                                          .attr("width", x.rangeBand())
                                          .attr("y", function(d) { return y(d.height); })
                                          .attr("height", function(d) { return height - y(d.height); });
            
            					        
            					        var intake = res.map(function (e, i) {
            					            var abc = calculateDailyIntake(party.gender, age, res2[i].height, res[i].weight);
                                            return { intake: abc, time: res[i].time};
                                        });
                                        
                                        dailyIntake = intake[intake.length-1].intake;
                                        
                                        $('#weightGraph').append("<div style='display:inline-block;' id='graph3'></div>");
                                        $('#graph3').append("<p style='font-size:16px;'><strong>Priporočen dnevni vnos(kcal):</strong></p>");
                                        
                                        var svgIntake = d3.select("#graph3").append("svg")
                                            .attr("width", width + margin.left + margin.right)
                                            .attr("height", height + margin.top + margin.bottom)
                                          .append("g")
                                            .attr("transform", 
                                                  "translate(" + margin.left + "," + margin.top + ")");
                                        
                                        
                                    	
                                        x.domain(intake.map(function(d) { return d.time; }));
                                        y.domain([0, d3.max(intake, function(d) { return d.intake; })]);
                                    
                                        svgIntake.append("g")
                                          .attr("class", "x axis")
                                          .attr("transform", "translate(0," + height + ")")
                                          .call(xAxis)
                                        .selectAll("text")
                                          .style("text-anchor", "end")
                                          .attr("dx", "-.8em")
                                          .attr("dy", "-.55em")
                                          .attr("transform", "rotate(-90)" );
                                    
                                        svgIntake.append("g")
                                          .attr("class", "y axis")
                                          .call(yAxis)
                                        .append("text")
                                          .attr("transform", "rotate(-90)")
                                          .attr("y", 6)
                                          .attr("dy", ".71em")
                                          .style("text-anchor", "end")
                                          .text("Value ($)");
                                    
                                        svgIntake.selectAll("bar")
                                          .data(intake)
                                        .enter().append("rect")
                                          .style("fill", "green")
                                          .attr("x", function(d) { return x(d.time); })
                                          .attr("width", x.rangeBand())
                                          .attr("y", function(d) { return y(d.intake); })
                                          .attr("height", function(d) { return height - y(d.intake); });
            					        
            					        $('#dailyIntake').text(dailyIntake + ' kcal');
            					        $('#podatkiContainer').css('display', 'block');
            					        
            				    	} else {
            				    		$('#sporocilo').html('Ni podatkov!');
            	                        $('#sporocilo').dialog({modal: true, buttons: { OK: function() {$(this).dialog('close');}}, title: 'Napaka'});
            				    	}
            				    },
            				    error: function() {
            				    	$('#sporocilo').html(JSON.parse(err.responseText).userMessage);
            	                    $('#sporocilo').dialog({modal: true, buttons: { OK: function() {$(this).dialog('close');}}, title: 'Napaka'});
            				    }
            				});
				    	} else {
				    		$('#sporocilo').html('Ni podatkov!');
	                        $('#sporocilo').dialog({modal: true, buttons: { OK: function() {$(this).dialog('close');}}, title: 'Napaka'});
				    	}
				    },
				    error: function() {
				    	$('#sporocilo').html(JSON.parse(err.responseText).userMessage);
	                    $('#sporocilo').dialog({modal: true, buttons: { OK: function() {$(this).dialog('close');}}, title: 'Napaka'});
				    }
				});
			},
			error: function(err) {
				$('#sporocilo').html(JSON.parse(err.responseText).userMessage);
		        $('#sporocilo').dialog({modal: true, buttons: { OK: function() {$(this).dialog('close');}}, title: 'Napaka'});
			}
		});
	}
}

function predlagajRecepte(){
	$.ajax({
	    url: 'https://api.edamam.com/search' + "?q" + '&calories=gte '+ Math.round(dailyIntake*0.32 -10) +', lte '+ Math.round(dailyIntake*0.32 +10) + '&app_id=b0095170&app_key=7b6edc675b3ec02fd0a16d56a19e1643',
	    type: 'GET',
	    dataType: 'jsonp',
	    success: function (res) {
	        var breakfast = $('#breakfast');
	        res.hits.forEach(function(data){
	            var recipe = data.recipe;
	            var details = "<div style='display:none; float:right; padding-left:5px; padding-right:5px; background-color:#F7F7F7; height:100%; width:150px;'>";
	            recipe.ingredients.forEach(function(ingridient){
	                details += "<p style='margin:0px; font-size:10px;'><strong>"+ingridient.food+"</strong>&nbsp;&nbsp;&nbsp;"+ Math.round(ingridient.quantity*10)/10 + ingridient.measure +"</p>";
	            });
	            details += "</div>";
	            breakfast.append("<div onclick='displayDetails(this);' style='display:inline-block; margin:10px; '><p style=' margin:0px; max-width: 200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; '><strong>" + recipe.label + "</strong></p><div style='background-color:#E4E4E4; width:150px; display:inline-block;'><div style='display:inline-block;'><img style='width:150px;' src='"+ recipe.image +"' /><p style='margin:0px; font-size:12px;'>Kalorije: " + Math.round(recipe.calories / recipe.yield) + " kcal</p></div>"+ details +"</div></div>");
	        });
	    },
	    error: function(err) {
	    	$('#sporocilo').html('Napaka pri iskanju receptov!');
		    $('#sporocilo').dialog({modal: true, buttons: { OK: function() {$(this).dialog('close');}}, title: 'Napaka'});
	    }
	});
	
	$.ajax({
	    url: 'https://api.edamam.com/search' + "?q" + '&calories=gte '+ Math.round(dailyIntake*0.40 -10) +', lte '+ Math.round(dailyIntake*0.40 +10) + '&app_id=b0095170&app_key=7b6edc675b3ec02fd0a16d56a19e1643',
	    type: 'GET',
	    dataType: 'jsonp',
	    success: function (res) {
	        var lunch = $('#lunch');
	        res.hits.forEach(function(data){
	            var recipe = data.recipe;
	            var details = "<div style='display:none; float:right; padding-left:5px; padding-right:5px; background-color:#F7F7F7; height:100%; width:150px;'>";
	            recipe.ingredients.forEach(function(ingridient){
	                details += "<p style='margin:0px; font-size:10px;'><strong>"+ingridient.food+"</strong>&nbsp;&nbsp;&nbsp;"+ Math.round(ingridient.quantity*10)/10 + ingridient.measure +"</p>";
	            });
	            details += "</div>";
	            lunch.append("<div onclick='displayDetails(this);' style='display:inline-block; margin:10px; '><p style=' margin:0px; max-width: 200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; '><strong>" + recipe.label + "</strong></p><div style='background-color:#E4E4E4; width:150px; display:inline-block;'><div style='display:inline-block;'><img style='width:150px;' src='"+ recipe.image +"' /><p style='margin:0px; font-size:12px;'>Kalorije: " + Math.round(recipe.calories / recipe.yield) + " kcal</p></div>"+ details +"</div></div>");
	        });
	    },
	    error: function(err) {
	    	$('#sporocilo').html('Napaka pri iskanju receptov!');
		    $('#sporocilo').dialog({modal: true, buttons: { OK: function() {$(this).dialog('close');}}, title: 'Napaka'});
	    }
	});
	
	$.ajax({
	    url: 'https://api.edamam.com/search' + "?q" + '&calories=gte '+ Math.round(dailyIntake*0.18 -10) +', lte '+ Math.round(dailyIntake*0.18 +10) + '&app_id=b0095170&app_key=7b6edc675b3ec02fd0a16d56a19e1643',
	    type: 'GET',
	    dataType: 'jsonp',
	    success: function (res) {
	        var dinner = $('#dinner');
	        res.hits.forEach(function(data){
	            var recipe = data.recipe;
	            var details = "<div style='display:none; float:right; padding-left:5px; padding-right:5px; background-color:#F7F7F7; height:100%; width:150px;'>";
	            recipe.ingredients.forEach(function(ingridient){
	                details += "<p style='margin:0px; font-size:10px;'><strong>"+ingridient.food+"</strong>&nbsp;&nbsp;&nbsp;"+ Math.round(ingridient.quantity*10)/10 + ingridient.measure +"</p>";
	            });
	            details += "</div>";
	            dinner.append("<div onclick='displayDetails(this);' style='display:inline-block; margin:10px; '><p style=' margin:0px; max-width: 200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; '><strong>" + recipe.label + "</strong></p><div style='background-color:#E4E4E4; width:150px; display:inline-block;'><div style='display:inline-block;'><img style='width:150px;' src='"+ recipe.image +"' /><p style='margin:0px; font-size:12px;'>Kalorije: " + Math.round(recipe.calories / recipe.yield) + " kcal</p></div>"+ details +"</div></div>");
	        });
	    },
	    error: function(err) {
	    	$('#sporocilo').html('Napaka pri iskanju receptov!');
		    $('#sporocilo').dialog({modal: true, buttons: { OK: function() {$(this).dialog('close');}}, title: 'Napaka'});
	    }
	});
	
	$.ajax({
	    url: 'https://api.edamam.com/search' + "?q" + '&calories=gte '+ Math.round(dailyIntake*0.10 -10) +', lte '+ Math.round(dailyIntake*0.10 +10) + '&app_id=b0095170&app_key=7b6edc675b3ec02fd0a16d56a19e1643',
	    type: 'GET',
	    dataType: 'jsonp',
	    success: function (res) {
	        var dinner = $('#snacks');
	        res.hits.forEach(function(data){
	            var recipe = data.recipe;
	            var details = "<div style='display:none; float:right; padding-left:5px; padding-right:5px; background-color:#F7F7F7; height:100%; width:150px;'>";
	            recipe.ingredients.forEach(function(ingridient){
	                details += "<p style='margin:0px; font-size:10px;'><strong>"+ingridient.food+"</strong>&nbsp;&nbsp;&nbsp;"+ Math.round(ingridient.quantity*10)/10 + ingridient.measure +"</p>";
	            });
	            details += "</div>";
	            dinner.append("<div onclick='displayDetails(this);' style='display:inline-block; margin:10px; '><p style=' margin:0px; max-width: 200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; '><strong>" + recipe.label + "</strong></p><div style='background-color:#E4E4E4; width:150px; display:inline-block;'><div style='display:inline-block;'><img style='width:150px;' src='"+ recipe.image +"' /><p style='margin:0px; font-size:12px;'>Kalorije: " + Math.round(recipe.calories / recipe.yield) + " kcal</p></div>"+ details +"</div></div>");
	        });
	    },
	    error: function(err) {
	    	$('#sporocilo').html('Napaka pri iskanju receptov!');
		    $('#sporocilo').dialog({modal: true, buttons: { OK: function() {$(this).dialog('close');}}, title: 'Napaka'});
	    }
	});
	
	$('#recipes').css("display", "block");
}

function displayDetails(element){
    if(element.childNodes[1].childNodes[1].style.display == 'none')
        element.childNodes[1].childNodes[1].style.display = 'inline-block';
    else
        element.childNodes[1].childNodes[1].style.display = 'none';
}

$(document).ready(function() {
    $('#izbiraOsebe').change(function() {
        $('#ehrIdInput').val(ehrIDs[$(this).val()]);
    });
});

