// -------- D3 PART -----------
var margin = {'top': 20, 'right': 120, 'bottom': 20, 'left': 120},
    width = 960 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;



var d3Init = function(data){
  let _data = JSON.parse(JSON.stringify(data));
  
  var i = 0,
      duration = 750,
      root;
  var tree = d3.layout.tree()
      .size([height, width]);
  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  function draw(_data) {
    root = _data;
    // root = JSON.parse(JSON.stringify(data));
    
    root.x0 = height / 2;
    root.y0 = 0;

    // 递归，折叠/展开 node
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    root.children.forEach(collapse);
    update(root);
  }
  // d3.select(self.frameElement).style("height", "800px");
  draw(_data);
  
  function update(source) {
    // console.log(source);

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),  // 为啥要 reverse??
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    // 当前node的y坐标，是深度*180，深度从0开始
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    // 所有的数据生成的节点
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });
      

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click); // 添加展开/收起逻辑

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        // 一个节点有没有叶子节点，会反应在circle上
        // 验证 d._children 而不验证 d.children 是因为，当中间节点未展开是，节点信息存在 _children 中
        // 节点展开以后，节点信息存在 children 中
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
        // 叶子节点和其他节点，与 circle 的相对位置不同
        .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        // text-anchor 是用来对齐用的
        // 如果到了叶子节点，对齐方式 start，在根节点或者中间节点上对齐方式就是 end
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        // .text(function(d) { return d.name; })
        .text(function(d) { return d.keyword; })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y+ "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    console.log(nodeExit);

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    // 所有的链接关系，d 中包含了两组数据，source 和 target
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) { // 这个d包含的是 source 和 target两组数据内容
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});  // link 的 path 起始点
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        // 通过动画，将 link 线条画到了终点，终点就是 (dy, dx)，d 就是上面 link.enter 里面的 d
        // diagonal 接收了 link 初始化时候，data() 中return 的 d.target.id
        .attr("d", diagonal); 

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
};