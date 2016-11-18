var spainChart = dc.geoChoroplethChart("#spain-chart")
var ordinalChart = dc.barChart("#cities-chart")
var pieChart = dc.pieChart("#round-chart")
var pieChartMen = dc.pieChart("#round-chart-men")
var timeChart = dc.barChart("#time-chart");

d3.csv("contratos.csv", function (csv) {
    // debugger
    var data = crossfilter(csv)

    var states = data.dimension(function (d) { return d.comunidad })

    var states_bis = data.dimension(function (d) { return d.comunidad })

    var cities = data.dimension(function (d) { return d.provincia })

    var borough = data.dimension(function (d) { return d.municipio })

    var timeDim = data.dimension(function (d) { return new Date(d.mes.substring(0,4)+ "/" + d.mes.substring(4, d.mes.length)) })

    var citiesState = states.group().reduceCount(function (d) { return d.provincia })

    var employmentByState = states.group().reduceSum(function(d) { return +d.contratos })

    var employmentByCities = cities.group().reduceSum(function(d) { return +d.contratos })

    var empPermanentByWomen = states.group().reduceSum(function(d) { return +d.indef_mujeres })

    var empPermanentByMen = states.group().reduceSum(function(d) { return +d.indef_hombres })

    var employmentByTime = timeDim.group().reduceSum(function(d) { return +d.contratos })

    var projection = d3.geo.mercator()
    .center([3, 30])
    .scale(1100)
    .translate([400, 400])

    d3.json("units1.json", function (statesJson) {
        spainChart
        .width(500)
        .height(500)
        .dimension(states_bis)
        .group(employmentByState)
        .colors(d3.scale.quantize().range(
            ['#bcbddc','#9e9ac8','#807dba','#6a51a3','#54278f','#3f007d']
        ))
        .colorDomain(d3.extent(employmentByState.all(),function(d){return d.value}))
        .colorCalculator(function (d) {
            return d ? spainChart.colors()(d) : '#ccc'
        })
        .overlayGeoJson(statesJson.features, "state", function (d) {
            return d.properties.NAME_1
        })
        .projection(projection)
        .title(function (d) {
            return d.key + " " + d.value
        })

        pieChart
        .width(500)
        .height(500)
        .transitionDuration(500)
        .colorAccessor(function(d, i){return d.value;})
        .radius(90)
        .innerRadius(40)
        .dimension(states)
        .group(empPermanentByWomen)
        .renderLabel(true)
        .renderTitle(true);

        pieChartMen
        .width(500)
        .height(500)
        .transitionDuration(500)
        .colorAccessor(function(d, i){return d.value;})
        .radius(90)
        .innerRadius(40)
        .dimension(states)
        .group(empPermanentByMen)
        .renderLabel(true)
        .renderTitle(true);

        timeChart
        .width(800)
        .height(180)
        .dimension(timeDim)
        .margins({top: 40, right: 20, bottom: 20, left: 50})
        .group(employmentByTime)
        .x(d3.time.scale()
        .domain([new Date("2015/12/01"), new Date("2017/01/01")]))
        .xUnits(d3.time.months)
        .elasticY(true)
        .xAxisLabel("")
        .yAxisLabel("")
        .barPadding(0.1)
        .outerPadding(0.05)
        .colorAccessor(function (d, i){return i;})
        .ordinalColors(["#2196F3"])

        ordinalChart
        .width(1000)
        .height(400)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .brushOn(true)
        .xAxisLabel("Autonomies")
        .yAxisLabel("Population")
        .dimension(cities)
        .barPadding(0.1)
        .outerPadding(0.05)
        .colorAccessor(function (d, i){return i;})
        .ordinalColors(['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5'])
        .group(employmentByCities)
        .on('renderlet', function(chart, filter){
            chart.selectAll('g.x text')
            .attr('dx', '+30')
            .attr('transform', 'translate(-20,0) rotate(315)');
        })

        ordinalChart.yAxis().tickFormat(function (v) {
            return v / 1000000 + 'M';
        })

        dc.dataTable("#data-table")
        .dimension(cities)
        .group(function(d) {
            return d.provincia;
        })
        .size(10)
        .columns([
            function(d) { return d.comunidad },
            function(d) { return d.provincia },
            function(d) { return d.municipio },
            function(d) { return d.cod_mes },
        ])
        .on('renderlet', function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });

        var datatable = $('#data-table').DataTable({
            "pagingType": "full_numbers"
        });

        // function RefreshTable() {
        //   dc.events.trigger(function () {
        //     datatable.api()
        //       .clear()
        //       .rows.add( tableDimension.top(Infinity) )
        //       .draw() ;
        //   });
        // }
        // for (var i = 0; i < dc.chartRegistry.list().length; i++) {
        //   var chartI = dc.chartRegistry.list()[i];
        //   chartI.on("filtered", RefreshTable);
        // }

        // RefreshTable() ;
        dc.renderAll()

    })
})
