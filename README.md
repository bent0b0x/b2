#WORK IN PROGRESS

# b2
easy d3 graphs.

Library to make plotting data a breeze:

    b2.graphLineData([data])
    .details({
      type: 'path',
      width: 1000,
      height: 1000,
      xTicks: 4,
      yTicks: 4,
      ease: 'linear',
      duration: 500
    })
    .draw();

And that's it! You have a graph on your page within the `#graph` element. 

Currently this only works for scatter and line/path plots, and customization is limited. 
More to come.


