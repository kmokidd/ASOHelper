/// <reference path="./typings/index.d.ts" />

const TYPE_RANK = 0,
      TYPE_DELTA = 1,
      TYPE_EXP = 2,
      TYPE_COUNT = 3;

// 寻找 value 落在 range 的哪个区间，返回左边的值
// 比如 range [1, 10, 20]，value 是 15
// 返回 1，实际 value 是落在 @return ~ @return+1 之间
// range 是升序排列的
// function findInterval(value, range) {
//   let j = -1;

//   // 判断有没有超出范围
//   if(value < range[0] || value>range[range.length - 1]) 
//     return -1;
//   else {
//     for(let i in range) {
//       if(value >= range[i]){
//         j = i;
//       }else {
//         break;
//       }
//     }
//     return j;
//   }
// }

function findInterval2(value, range) {
  if(value < range[0] || value>range[range.length - 1])
    return -1;

  let middleIndex = Math.floor(range.length/2);


  if(range.length <= 2) return 0;
  // else if (value === range[middleIndex]) return middleIndex;
  else if (value > range[middleIndex]) {
    return middleIndex + findInterval2(value, range.slice(middleIndex, range.length));
  }else {
    return findInterval2(value, range.slice(0, middleIndex+1));
  }
}

class ColorPicker  {
  constructor(min=0, max=0, type=0) {
    this.config = JSON.parse(JSON.stringify(this._configFunc()));

    this.min = min;
    this.max = max;
    this.type = type;
    
    // set range
    this.range = this.config.boundary[type].concat();
    if(this.min < this.range[0]) this.range.unshift(this.min);
    if(this.max > this.range[this.range.length-1]) this.range.push(this.max);

    // set slot
    this.slot = this._map(this.range);
    // console.log(this.slot);
  }

  _configFunc() {
    return {
      interval: 200,
      // prefix with _ means 'last', _one means 'last one'
      rule: {
        // '0': [0, 0, 0], // rbg(0, 0, 0)
        '1': [255, 0, 0], // rgb(255, 0, 0);
        '2': [0, 0, 255], // rbg(0, 0, 255);
        '3': [255, 236, 0], // rbg(0, 0, 255);
        '4': [0, 0, 0], // rbg(0, 0, 0)
        '_1': [0, 255, 0] // rbg(0, 255, 0)
      },
      boundary: [
        [1, 3, 10, 20],  // rank -> [1, 3, 10, 20, max] 4个区间
        [0], // delta -> [min, 0, max] 2个区间
        [4605, 5000, 6000], // exp -> [4605, 5000, 6000, max] 3个区间
        [0, 50, 100, 500] // count -> [0, 50, 100, 500, max] 4个区间
      ]
    };
  }

  _map(range) {
    // if(range.length > 3 || range.indexOf(4605) > -1){ // <---- 判断 range 是不是 delta 的条件有漏洞
    //   return this.config.interval / (range[range.length -1] - range[0]);
    // }
    // // 如果有负数，负数部分要单独处理，应用 _1 的色值
    // else {
    //   return {
    //     positive: this.config.interval / (range[range.length -1] - 0) || 0, // 0 ~ max
    //     nagetive: this.config.interval / (range[0] - 0) || 0 // min ~ 0
    //   };
    // }

    // 如果有负数，负数部分要单独处理，应用 _1 的色值
    if(range[0] < -1) {
      return {
        positive: this.config.interval / (range[range.length -1] - 0) || 0, // 0 ~ max
        nagetive: this.config.interval / (range[0] - 0) || 0 // min ~ 0
      };
    }else {
      return this.config.interval / (range[range.length -1] - range[0]);
    }
  }

  getColorValue(data) {
    this.curValue = data[this.type]; // 当前值

    let boundaryIndex = 0; // this.curValue 会落在 rang[boundaryIndex] 到 range[boundaryIndex+1] 之间
    let colorValue = 0; // 根据 this.curVaule 和 slot map 出来的 R/G/B 的单值
    let newColor; // 将 R/G/B 单值 替换掉里面的 0，逗号合并成string，返回就是 "255, colorValue, colorValue";

    if(typeof this.slot == "object") { // 说明是 delta
      let middleIndex = this.range.indexOf(0);
      
      // 因为正数部分和负数部分 slot 不一样，所以要分开算
      if(this.curValue >=0) boundaryIndex = (findInterval2(this.curValue, this.range.slice(middleIndex, this.range.length))+1).toString();
      else {
        boundaryIndex = findInterval2(this.curValue, this.range.slice(0, middleIndex+1)) + 1;
        boundaryIndex = `_${boundaryIndex}`;
      }
    }
    else { // 说明是 rank/ exp /count
      colorValue = parseInt(Math.abs(this.slot * (this.curValue-this.range[0]+1)));
      console.log(findInterval2(this.curValue, this.range));
      boundaryIndex = (findInterval2(this.curValue, this.range)+1).toString();
    }
    
    // 根据所在区间决定使用哪一条规则
    console.log(boundaryIndex);
    newColor = this.config.rule[boundaryIndex].concat().map(value => { return value===0?colorValue:value;}).join(',');

    return `rgb(${newColor})`;
  }
};

class Tree {
  constructor(data, w, h, type) {
    this.margin = {top: 20, right: 120, bottom: 20, left: 120};

    // 不会操作同一个内存空间
    this.data = JSON.parse(JSON.stringify(data));
    console.log(data.children);
    this.type = type;

    switch(this.type) {
      case TYPE_RANK:
        this.title = "排名";
        break;
      case TYPE_DELTA:
        this.title = "排名变化";
        break;
      case TYPE_EXP:
        this.title = "热度";
        break;
      case TYPE_COUNT:
        this.title = "搜索结果数";
        break;
    }

    this.w = w - this.margin.left - this.margin.right;
    this.h = h - this.margin.top - this.margin.bottom;
  }

  // 初始化 tree
  init($wrapper='#svg-wrapper', duration = 750) {
    this.i = 0;
    this.duration = duration;
    this.tree =d3.layout.tree()
                .size([this.h, this.w]);
    this.diagonal = d3.svg.diagonal()
                    .projection((d)=>{
                      return [d.y, d.x];
                    });
    
    d3.select($wrapper).append('h3')
                    .text(this.title);

    this.svg = d3.select($wrapper)
                  .append("svg")
                  .attr("width", this.w + this.margin.left + this.margin.right).attr("height", this.h+this.margin.top + this.margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    
    // 找到最大最小值
    let minArray = [], maxArray = [];
    // 判断顺序
    this.data.children.forEach(seg => {
      // console.log(`-------keyword is ${keyword.keyword}-----------`);
      // keyword.children -> 分词
      // keyword.children.forEach(seg => {
      // console.log(`-------seg is ${seg.keyword}-----------`);
      // 每一个分词对应的被收录的关键词的 min 和 max，=> array 中
      const word = seg.children;

      // 可能是顺序，可能是逆序
      const one = word[0].data[this.type],
            two = word[word.length-1].data[this.type];

      if(one <= two) { // 正序
        minArray.push(one);
        maxArray.push(two);
      } else { // 倒序
        minArray.push(two);
        maxArray.push(one);
      }
    });

    let dataMin = Math.min.apply(null, minArray),
        dataMax = Math.max.apply(null, maxArray);

    // 一棵树共用一个 colorpicker
    // 共有一对 <MIN, MAX> 值
    this.cp = new ColorPicker(dataMin, dataMax, this.type);

    this.draw();
  }

  draw() {
    this.root = this.data;

    this.root.x0 = this.h/2;
    this.root.y0 = 0;

    this.root.children.forEach((d) => {this.collapse(d, this);});
    this.update(this.root);
  }

  // 递归，折叠/展开 node
  collapse(d, self) {
    if (d.children) {
      d._children = d.children;
      // console.log(self);
      d._children.forEach((d)=> {self.collapse(d, self);});
      d.children = null;
    }
  }

  update(source) {
    const self = this;
    
    // Compute the new tree layout.
    let nodes = this.tree.nodes(this.root).reverse(), // 为啥要 reverse??
        links = this.tree.links(nodes);

    // Normalize for fixed-depth.
    // 当前node的y坐标，是深度*180，深度从0开始
    nodes.forEach((d) => { d.y = d.depth * 180; });

    // Update the nodes…
    // 所有的数据生成的节点
    let node = this.svg.selectAll("g.node")
              .data(nodes, (d)=> { return d.id || (d.id = ++this.i); });

    // Enter any new nodes at the parent's previous position.
    let nodeEnter = node.enter().append("g")
                      .attr("class", "node")
                      .attr("transform", (d)=> { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                      .on("click", this.click.bind(self)); // 添加展开/收起逻辑
    
    nodeEnter.append("circle")
              .attr("r", 1e-6)
              // 一个节点有没有叶子节点，会反应在circle上
              // 验证 d._children 而不验证 d.children 是因为，当中间节点未展开是，节点信息存在 _children 中
              // 节点展开以后，节点信息存在 children 中
              .style("fill", (d)=> { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
              // 叶子节点和其他节点，与 circle 的相对位置不同
              .attr("x", (d)=> { return d.children || d._children ? -10 : 10; })
              .attr("dy", ".35em")
              // text-anchor 是用来对齐用的
              // 如果到了叶子节点，对齐方式 start，在根节点或者中间节点上对齐方式就是 end
              .attr("text-anchor", (d)=> { return d.children || d._children ? "end" : "start"; })
              .text((d) => { 
                // 在最后一层节点，显示数据
                if(d.data)
                  return d.keyword + ', '+ d.data[this.type];
                else
                  return d.keyword;
              })
              .style("fill-opacity", 1e-6)
              // .style("fill", (d)=> { return "#ff0"; });
              .style("fill", (d)=> {
                
                // 关键词节点要染色
                if(d.data) {
                  console.log(d.data);
                  return this.cp.getColorValue(d.data);
                } else {
                  return '#000';
                }
              });

    let nodeUpdate = node.transition()
                      .duration(this.duration)
                      .attr("transform", function(d) { return "translate(" + d.y+ "," + d.x + ")"; });

    nodeUpdate.select("circle")
              .attr("r", 4.5)
              .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
              .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    let nodeExit = node.exit().transition()
                    .duration(this.duration)
                    .attr("transform", (d) => { return "translate(" + source.y + "," + source.x + ")"; })
                    .remove();
    nodeExit.select("circle")
            .attr("r", 1e-6);

    nodeExit.select("text")
            .style("fill-opacity", 1e-6);

    // Update the links…
    // 所有的链接关系，d 中包含了两组数据，source 和 target
    let link = this.svg.selectAll("path.link")
              .data(links, (d)=>{ return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", (d) => { // 这个d包含的是 source 和 target两组数据内容
          var o = {x: source.x0, y: source.y0};
          return this.diagonal({source: o, target: o});  // link 的 path 起始点
        });
    
    // Transition links to their new position.
    link.transition()
        .duration(this.duration)
        // 通过动画，将 link 线条画到了终点，终点就是 (dy, dx)，d 就是上面 link.enter 里面的 d
        // diagonal 接收了 link 初始化时候，data() 中return 的 d.target.id
        .attr("d", this.diagonal);
  
    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(this.duration)
        .attr("d", (d)=> {
          var o = {x: source.x, y: source.y};
          return this.diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach((d)=> {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  /** 节点染色用
   * 
   * @param {*} type : 'rank' || 'delta' || 'exp' || 'count'
   * @param {*} min 
   * @param {*} max 
   */
  // dye(type, min, max) {
  // }

  click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d); 
  }
}