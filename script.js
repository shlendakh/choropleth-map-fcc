document.addEventListener('DOMContentLoaded', function() {
    const educationUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
    const countyUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
  
    Promise.all([d3.json(educationUrl), d3.json(countyUrl)]).then(([educationData, countyData]) => {
      const width = 960;
      const height = 600;
  
      const svg = d3.select("#chart")
        .attr("width", width)
        .attr("height", height);
  
      const path = d3.geoPath();
  
      const education = {};
      educationData.forEach(d => {
        education[d.fips] = d.bachelorsOrHigher;
      });
  
      const color = d3.scaleQuantize()
        .domain([d3.min(educationData, d => d.bachelorsOrHigher), d3.max(educationData, d => d.bachelorsOrHigher)])
        .range(d3.schemeBlues[9]); // Ensure at least 4 different colors
  
      svg.append("g")
        .selectAll("path")
        .data(topojson.feature(countyData, countyData.objects.counties).features)
        .enter().append("path")
        .attr("class", "county")
        .attr("data-fips", d => d.id)
        .attr("data-education", d => education[d.id])
        .attr("fill", d => color(education[d.id]))
        .attr("d", path)
        .on("mouseover", function(event, d) {
          const tooltip = d3.select("#tooltip");
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`FIPS: ${d.id}<br>Education: ${education[d.id]}%`)
            .attr("data-education", education[d.id])
            .style("left", (event.pageX  - 150) + "px")
            .style("top", (event.pageY - 300) + "px");
        })
        .on("mouseout", function() {
          d3.select("#tooltip").transition().duration(500).style("opacity", 0);
        });
  
      svg.append("path")
        .datum(topojson.mesh(countyData, countyData.objects.states, (a, b) => a !== b))
        .attr("class", "states")
        .attr("d", path);
  
      const legend = d3.select("#legend");
  
      const legendColors = color.range().map(d => ({
        color: d,
        value: color.invertExtent(d)[0]
      }));
  
      const legendWidth = 300;
      const legendHeight = 20;
  
      const legendSvg = legend.append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight + 40);
  
      legendSvg.selectAll("rect")
        .data(legendColors)
        .enter().append("rect")
        .attr("x", (d, i) => i * (legendWidth / legendColors.length))
        .attr("y", 0)
        .attr("width", legendWidth / legendColors.length)
        .attr("height", legendHeight)
        .attr("fill", d => d.color);
  
      legendSvg.append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(d3.axisBottom(d3.scaleBand()
          .domain(legendColors.map(d => d.value.toFixed(2)))
          .range([0, legendWidth]))
          .tickValues(legendColors.map(d => d.value.toFixed(2))));
    });
  });  