#WORK IN PROGRESS

# b2
easy d3 graphs.

Library to make plotting data a breeze:

    b2.graphLineData([data])
    .details({
      type: 'line',
    })
    .draw();
    
Draw axes first, fill in the data later:

    var graph = b2.graphLineData([data])
    .drawAxes();
    
    graph.draw();
    
Customize your graph: 

    b2.graphLineData([data])
    .details({
      type: 'line',
      width: 1000,
      height: 400,
      xTicks: 10,
      yTicks: 4,
      ease: 'sin',
      duration: 1750,
      lineWidth: 1,
      mapX: function (d) {
        return d.a;
      },
      mapY: function (d) {
        return d.b;
      }
    })
    .draw();

And that's it! You have a graph on your page within the `#graph` element. 

Currently supports line graphs (with multiple lines permitted), bar graphs, and scatter plots. By default `b2` looks in the `x` and `y` attributes of each data point, but provide a `mapX` and/or `mapY` function to allow your data to be in any format.


