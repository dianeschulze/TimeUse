var width = 800,
height = 400, 
sm_buffer = 30, 
lg_buffer = 70,
barWidth = 50, 
marginleft=200,
margintop=200, 
marginbottom = 200;


var svg = d3.select("#graph1").append('svg').attr("height", height+marginbottom).attr("width", width).attr("transform", "translate("+marginleft+","+margintop+")");

var yScale = d3.scale.linear().range([height, 0]).domain([0,12]);

var yAxis = d3.svg.axis().orient('left')
          .innerTickSize(-width)
          .outerTickSize(0)
          .tickPadding(10).scale(yScale);

var weekdayGroup = svg.append('g').attr('class','weekday-group').attr("transform", "translate("+lg_buffer+",0)");
var weekendGroup = svg.append('g').attr('class','weekend-group').attr("transform", "translate("+(2*lg_buffer+sm_buffer+2*barWidth)+",0)");
var weekdayDiane = weekdayGroup.append('g').attr('class','weekday-diane');
var weekdayAtus = weekdayGroup.append('g').attr('class','weekday-atus');
var weekendDiane = weekendGroup.append('g').attr('class','weekend-diane');
var weekendAtus = weekendGroup.append('g').attr('class','weekend-atus');

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 2*sm_buffer+barWidth)
    .attr("y", height+10)
    .text("Weekdays");

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", marginleft+2+sm_buffer+2*barWidth)
    .attr("y", height+10)
    .text("Weekends");


parseData = function(data){
	var weekday = {}
	var weekend = {}
	var codeLookup = {}
	data.forEach(function(d){
		if (d.day_type === 'weekend'){
			weekend[d.code] = {'diane':d.diane_avg, 'atus':d.atus_avg}
		}
		else{
			weekday[d.code] = {'diane':d.diane_avg, 'atus':d.atus_avg}
		}
		codeLookup[d.code] = d.label;
	});
	return [weekday, weekend, codeLookup];
}

updateData = function(data){
	for (i=0;i<data.length;i++){
		d = data[i]
		if (d.weekend != null){
			weekend_diane_bar.attr('height', height-yScale(d.weekend.diane/60)).attr('y', yScale(+d.weekend.diane/60)).attr('fill', 'red');
			weekend_atus_bar.attr('height', height-yScale(d.weekend.atus/60)).attr('y', yScale(+d.weekend.atus/60)).attr('x', sm_buffer+barWidth).attr('fill', 'blue');
		}
		else{
			weekend_diane_bar.attr('height', 0);
			weekend_atus_bar.attr('height', 0);
		}
		
		if (d.weekday != null){
			weekday_diane_bar.attr('height', height-yScale(+d.weekday.diane/60)).attr('y', yScale(d.weekday.diane/60)).attr('fill', 'red');
			weekday_atus_bar.attr('height', height-yScale(+d.weekday.atus/60)).attr('y', yScale(d.weekday.atus/60)).attr('x', sm_buffer+barWidth).attr('fill', 'blue');
		}
		else{
			weekday_diane_bar.attr('height', 0);
			weekday_atus_bar.attr('height', 0);
		}
	}

}
$(document).ready(function(){
	d3.csv("diane_atus_durations.csv", function(error, data){
		[weekday, weekend, codeLookup] = parseData(data);

			svg.append('g').attr('class', 'y axis').attr('x', marginleft).call(yAxis);


			weekend_diane_bar = weekendDiane.append('rect').attr('width', barWidth);
			weekend_atus_bar =weekendAtus.append('rect').attr('width', barWidth);
			weekday_diane_bar =weekdayDiane.append('rect').attr('width', barWidth);
			weekday_atus_bar =weekdayAtus.append('rect').attr('width', barWidth);




	});

});

$("input[type=radio]").on('click', function(){
	toPlot = []
	cat = $('.category-checkbox:radio:checked').val();
	var datum = {category:cat, weekend: weekend[cat], weekday: weekday[cat]};
	toPlot.push(datum);
	updateData(toPlot);

});