/*
 * 主工作编辑器的js
 * */



// 初始化主编辑器
function initMainEditor(){
  if(!mxClient.isBrowserSupported()){//如果浏览器不支持
      mxUtils.error('您的浏览器过旧，请更新浏览器来使用本程序。', 200, false);
      return;
  }
  //var container = document.getElementById('mainEditor');
  _editor = new mxEditor();

  _graph = _editor.graph;

  var model = _graph.getModel();

  _editor.setGraphContainer(_container);

  var config = mxUtils.load('/static/mxgraph/keyhandler-commons.xml').getDocumentElement();

  _editor.configure(config);

  /*****/
  //graph = new mxGraph(container);
  //_graph.panningHandler.useLeftButtonForPanning = true;

  _graph.setPanning(true);
  _graph.setConnectable(true);
  _graph.setConnectableEdges(true);
  _graph.setDisconnectOnMove(false);
  _graph.panningHandler.isPopupTrigger = function() { return false; };

  new mxRubberband(_graph);
  /***********************************/
  // Alternative solution for implementing connection points without child cells.
  // This can be extended as shown in portrefs.html example to allow for per-port
  // incoming/outgoing direction.
  _graph.getAllConnectionConstraints = function(terminal){
     var geo = (terminal != null) ? this.getCellGeometry(terminal.cell) : null;

     if ((geo != null ? !geo.relative : false) &&
       this.getModel().isVertex(terminal.cell) &&
       this.getModel().getChildCount(terminal.cell) == 0){
      return [new mxConnectionConstraint(new mxPoint(0, 0.5), false),
          new mxConnectionConstraint(new mxPoint(1, 0.5), false)];
      }

    return null;
  };

  // Makes sure non-relative cells can only be connected via constraints
  _graph.connectionHandler.isConnectableCell = function(cell){
    if (this.graph.getModel().isEdge(cell)){
      return true;
    }
    else{
      var geo = (cell != null) ? this.graph.getCellGeometry(cell) : null;
      return (geo != null) ? geo.relative : false;
    }
  };
  mxEdgeHandler.prototype.isConnectableCell = function(cell){
    return _graph.connectionHandler.isConnectableCell(cell);
  };

  // Adds a special tooltip for edges
  _graph.setTooltips(true);


      var labelBackground = '#FFFFFF';
      var fontColor =  '#000000';
      var strokeColor =  '#000000';
      var fillColor =  '#FFFFFF';

      var style = _graph.getStylesheet().getDefaultEdgeStyle();
      delete style['endArrow'];
      style['strokeColor'] = strokeColor;
      style['labelBackgroundColor'] = labelBackground;
      style['edgeStyle'] = 'wireEdgeStyle';
      style['fontColor'] = fontColor;
      style['fontSize'] = '9';
      style['movable'] = '0';
      style['MAIN.strokeWidth'] = MAIN.strokeWidth;
      //style['rounded'] = '10';

      // Sets join node size
      style['startSize'] = MAIN.joinNode;
      style['endSize'] = MAIN.joinNode;

      style = _graph.getStylesheet().getDefaultVertexStyle();
      style['gradientDirection'] = 'south';
      //style['gradientColor'] = '#909090';
      style['strokeColor'] = strokeColor;
      style['fillColor'] = '#e0e0e0';
      style['fillColor'] = 'none';
      style['fontColor'] = fontColor;
      style['fontStyle'] = '1';
      style['fontSize'] = '12';
      style['resizable'] = '0';
      style['rounded'] = '1';
      style['MAIN.strokeWidth'] = MAIN.strokeWidth;

    undoManager = new mxUndoManager();
    var listener = function(sender, evt)
    {
        undoManager.undoableEditHappened(evt.getProperty('edit'));
    };
    _graph.getModel().addListener(mxEvent.UNDO, listener);
    _graph.getView().addListener(mxEvent.UNDO, listener);
    $('#bundo').click(function(){undoManager.undo()});
    $('#bredo').click(function(){undoManager.redo()});

// 绑定 双击事件
    _graph.dblClick = eleDbClick;

      // Avoids any connections for gestures within tolerance except when in wire-mode
      // or when over a port
      var connectionHandlerMouseUp = _graph.connectionHandler.mouseUp;
      _graph.connectionHandler.mouseUp = function(sender, me)
      {
        if (this.first != null && this.previous != null)
        {
          var point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
          var dx = Math.abs(point.x - this.first.x);
          var dy = Math.abs(point.y - this.first.y);

          if (dx < this.graph.tolerance && dy < this.graph.tolerance)
          {
            // Selects edges in non-wire mode for single clicks, but starts
            // connecting for non-edges regardless of wire-mode
            /*if (!checkbox.checked && this.graph.getModel().isEdge(this.previous.cell))
            {
              this.reset();
            }*/
            this.reset();
            return;
          }
        }

        connectionHandlerMouseUp.apply(this, arguments);
      };
//~ mxConstraintHandler.prototype.pointImage = new mxImage('/static/component/img/dot.png', 10, 10);
//  var outln = new mxOutline(_graph, document.getElementById('outline'));
  mxEvent.disableContextMenu(_container);
}//initMainEditor end

function eleDbClick(evt, cell){
 // if(WIN.CCwnd) return;//如果在编辑参数中，不要弹出第二个窗口

  var scell = _graph.getSelectionCells();
  //过滤：edge不显示,分隔线不显示
  if(scell[0].edge) return;
  var div1 = $('<div>');
      div1.addClass('paramPrompt');
  var pin = new Array()

// 如果双击的是 母元件 ，显示设置元件参数
  if(scell[0].thutype == 'ele'){
    console.log(scell[0]);
    showSetBg();
  }

};//dblclick  eleDbClick






