var b2 = {


  graphLineData: function(data, selector) {


    var b2Object = new B2Object();

    b2Object.data = data;

    var m = [80, 80, 80, 80]; // margins
    var w = 1000 - m[1] - m[3]; // width
    var h = 400 - m[0] - m[2]; // height
    // Add an SVG element with the desired dimensions and margin.

    selector = selector || '#graph';

    b2Object.selector = selector;

    var graph = d3.select(selector).append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    b2Object.w = w;
    b2Object.h = h;
    b2Object.m = m;


    b2Object.setupScale(data);

    b2Object.graph = graph;

    
    b2Object.setupLine();

    return b2Object;
  },

  appendAxis: function (graph, axis, scale, label) {

    var classSelector = '.' + axis + '.axis';

    var labelSelector = '.' + axis + '.label';

    var classVal = axis + ' axis';

    var orientation =  axis === 'x' ? 'bottom' : 'left';

    d3.select(classSelector).remove();

    d3.select(labelSelector).remove();

    var newAxis = d3.svg.axis().scale(scale).ticks(4).orient(orientation);


    return newAxis;
  }, 
};

/**
Wrapper object for graph
**/
var B2Object = function() {
  this.drawDuration = 1750;
  this.xLabelVal = 'x';
  this.yLabelVal = 'y';
  this.xTicksVal = 4;
  this.yTicksVal = 4;
  this.xOrientationVal = 'bottom';
  this.yOrientationVal = 'left';
  this.easeVal = 'linear';
  this.typeVal = 'line';
  this.rVal = 3;
  this.lineWidthVal = 5;
};

/*B2Object.prototype.b2x = function (x) {
  return d3.scale.linear().domain([this.xMin, this.xMax]).range([0, this.w]);
}

B2Object.prototype.b2y = function (y) {
  return d3.scale.linear().domain([this.yMin, this.yMax]).range([this.h, 0]);
}*/

B2Object.prototype.setupScale = function () {
  
  var context = this;

  var data = this.data;

  var yMax = d3.max(data[0], function (d) {
    return context.mapYFunc(d);
  });
  for (var i = 1; i < data.length; i++) {
    yMax = Math.max(yMax, d3.max(data[i], function (d) {
      return context.mapYFunc(d);
    }));
  }

  var xMax = d3.max(data[0], function (d) {
    return context.mapXFunc(d);
  });
  for (var i = 1; i < data.length; i++) {
    xMax = Math.max(xMax, d3.max(data[i], function (d) {
      return context.mapXFunc(d);
    }));
  }

  var yMin = d3.min(data[0], function (d) {
    return context.mapYFunc(d);
  });
  for (var i = 1; i < data.length; i++) {
    yMin = Math.min(yMin, d3.min(data[i], function (d) {
      return context.mapYFunc(d);
    }));
  }

  var xMin = d3.min(data[0], function (d) {
    return context.mapXFunc(d);
  });
  for (var i = 1; i < data.length; i++) {
    xMin = Math.min(xMin, d3.min(data[i], function (d) {
      return context.mapXFunc(d);
    }));
  }

  this.xMin = xMin;
  this.xMax = xMax;
  this.yMin = yMin;
  this.yMax = yMax;

  this.b2y = d3.scale.linear().domain([this.yMin, this.yMax]).range([this.h, 0]);
  this.b2x = d3.scale.linear().domain([this.xMin, this.xMax]).range([0, this.w]);

  return this;
}

B2Object.prototype.setupLine = function () {

  var context = this;

  context.line = d3.svg.line()
    // assign the X function to plot our line as we wish
    .x( function (d,i) { 
      return context.b2x(context.mapXFunc(d)); 
    })
    .y( function(d) { 
      // verbose logging to show what's actually being done
      //console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d.wins) + " using our yScale.")
      // return the Y coordinate where we want to plot this datapoint
      return context.b2y(context.mapYFunc(d)); 
    });
}

B2Object.prototype.details = function (deets) {

  for (var deet in deets) {
    if (typeof this[deet] === 'function') {
      this[deet](deets[deet]);
    }
  }

  return this;

};

B2Object.prototype.width = function (width) {
  width = parseInt(width)
  d3.select(this.selector + ' svg').attr('width', width + this.m[1] + this.m[3]);

  this.w = width;

  this.b2x = d3.scale.linear().domain([this.xMin, this.xMax]).range([0, this.w]);

  return this;
};

B2Object.prototype.height = function (height) {
  height = parseInt(height);
  d3.select(this.selector + ' svg').attr('height', height + this.m[0] + this.m[2]);

  this.h = height;

  this.b2y = d3.scale.linear().domain([this.yMin, this.yMax]).range([this.h, 0]);

  return this;
};

B2Object.prototype.r = function (val) {
  this.rVal = val;

  return this;
};

//Set the x axis label
B2Object.prototype.xLabel = function (label) {
  this.xLabelVal = label;

  return this;
};

//Set the y axis label
B2Object.prototype.yLabel = function (label) {
  this.yLabelVal = label;

  return this;
};

B2Object.prototype.xTicks = function (ticks) {
  this.xTicksVal = ticks;

  return this;
}

B2Object.prototype.yTicks = function (ticks) {
  this.yTicksVal = ticks;

  return this;
};

B2Object.prototype.mapXFunc = function (datum) {
  return datum.x;
};

B2Object.prototype.mapYFunc = function (datum) {
  return datum.y;
};

B2Object.prototype.mapX = function (func) {

  this.mapXFunc = func;

  this.setupScale();

  this.setupLine();

  return this;

};

B2Object.prototype.mapY = function (func) {

  this.mapYFunc = func;

  this.setupScale();

  this.setupLine();

  return this;

}

//Draw the axes
B2Object.prototype.drawAxes = function () {

  d3.select('.x.axis').remove();
  d3.select('.y.axis').remove();

  d3.select('.x.label').remove();
  d3.select('.y.label').remove();

  this.xAxis = d3.svg.axis().scale(this.b2x).ticks(this.xTicksVal).orient(this.xOrientationVal).tickSize(2);
  this.yAxis = d3.svg.axis().scale(this.b2y).ticks(this.yTicksVal).orient(this.yOrientationVal).tickSize(2)


  this.graph.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + this.h + ")")
    .call(this.xAxis);

  this.graph.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", this.w/2)
    .attr("y", this.h + 30)
    .text(this.xLabelVal)
    .attr("transform", "translate(0," + 10 + ")")
    .attr('font-size', '1.2em');

    // Add the y-axis
    this.graph.append("svg:g")
      .attr("class", 'y axis')
      .attr("transform", "translate(-25,0)")
      .call(this.yAxis);

    d3.select('.y.label').remove();
    this.graph.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -75)
      .attr('x', -this.h/2)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text(this.yLabelVal);

    return this;
};

B2Object.prototype.sortData = function () {
  var context = this;
  this.data.forEach(function (dataSet) {
    dataSet.sort(function (a, b) {
      return context.sortFunc(a, b, context);
    });
  });
};

B2Object.prototype.sortFunc = function (a, b, context) {
  return context.mapXFunc(a) - context.mapXFunc(b);
};

B2Object.prototype.sort = function (func) {
  this.sortFunc = func;

  return this;
}

//Duration of line drawing
B2Object.prototype.duration = function (duration) {
  this.drawDuration = duration;

  return this;
};


B2Object.prototype.ease = function (ease) {
  this.easeVal = ease;

  return this;
}

B2Object.prototype.type = function (type) {

  this.typeVal = type;

  return this;
};

B2Object.prototype.lineWidth = function (val) {
  this.lineWidthVal = val;

  return this;
}

//Draw the graph on the page
B2Object.prototype.draw = function () {
  var context = this;

  this.drawAxes();

  this.sortData();

  var combinedData = [];
  for (var i = 0; i < this.data.length; i++) {
    combinedData = combinedData.concat(this.data[i]);
  }


  if (context.typeVal === 'line') {
    this.data.forEach(function (dataSet, index) {
    var path = context.graph.append("svg:path")
      .attr("d", context.line(dataSet))

    var totalLength = path.node().getTotalLength();

    path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .attr('fill', 'none')
    .attr('stroke-width', context.lineWidthVal)
    .attr('stroke', 'black')
    .transition()
      .duration(context.drawDuration)
      .ease(context.easeVal)
      .attr("stroke-dashoffset", 0);
    });

  } else if (context.typeVal === 'scatter') {
    context.graph.selectAll('circle')
      .data(combinedData)
      .enter()
      .append('circle')
      .transition()
      .duration(context.drawDuration)
      .ease(context.easeVal)
      .each('start', function () {
        d3.select(this)
        .attr('r', 0)
      })
      .attr('cx', function (d) {
        return context.w - context.b2x(context.mapXFunc(d));
      })
      .attr('cy', function (d) {
        return context.h - context.b2y(context.mapYFunc(d));
      })
      .attr('r', context.rVal);
  } else if (context.typeVal === 'bar') {
    var barWidth = context.w/combinedData.length/2;
    context.graph.selectAll(".bar")
    .data(combinedData)
    .enter().append("rect")
    .attr("class", "bar")
    .transition()
    .duration(context.drawDuration)
    .ease(context.easeVal)
    .each('start', function () {
      d3.select(this)
      .attr('height', 0)
      .attr('y', context.h)
    })
    .attr("x", function(d) { 
      return context.b2x(context.mapXFunc(d)) - barWidth/2; 
    })
    .attr("width", barWidth)
    .attr("y", function(d) { 
      return context.b2y(context.mapYFunc(d)); 
    })
    .attr("height", function(d) { 
      return context.h - context.b2y(context.mapYFunc(d)); 
    });
  }
  return this;
};

//Set the global variable
window.b2 = b2;


//Seed data
var data = [];
var data2 = [];
for (var i = 0; i < 1000; i ++) {
  var x = i;
  var y = i;
  data.push({
    a: Math.random()*1000,
    b: Math.random()*1000,
  });
  data2.push({
    a: x*2,
    b: -y
  });
}


b2.graphLineData([data])
.details({
  type: 'line',
  width: 1000,
  height: 400,
  xTicks: 10,
  yTicks: 4,
  ease: 'ease',
  duration: 500,
  r: 5,
  lineWidth: 1,
  mapX: function (d) {
    return d.a;
  },
  mapY: function (d) {
    return d.b;
  }
})
.draw();


