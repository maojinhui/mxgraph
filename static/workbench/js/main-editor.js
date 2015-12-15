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
    //~ $('#bundo').click(function(){undoManager.undo()});
    //~ $('#bredo').click(function(){undoManager.redo()});

// 绑定 双击事件
    _graph.dblClick = MDbclickfunction;
    var outln = new mxOutline(_graph, document.getElementById('id_outline'));
//~ return true;
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

  //~ var outln = new mxOutline(_graph, document.getElementById('id_outline'));
  mxEvent.disableContextMenu(_container);
}//initMainEditor end

function MDbclickfunction(evt, cell){
 // if(WIN.CCwnd) return;//如果在编辑参数中，不要弹出第二个窗口

  var scell = _graph.getSelectionCells();
  //过滤：edge不显示,分隔线不显示
  if(scell[0].edge) return;
  var div1 = $('<div>');
      div1.addClass('paramPrompt');
  var pins = new Array()

      //todo: set pins
  //递归获取id，传入已选的cell[0]
  var iid = "-1"
  var nn = ''
  var p = {}//被双击的元件的父级
  function getSId(obj){
    if("1" != obj.parent.id)
      getSId(obj.parent);
    else{
      iid = obj.id
      nn = obj.getValue()
      p = obj
      return
    }
  }
  getSId(scell[0]);
console.log(iid,nn,p);
  switch(p.thutype){
    case "ele":showEleProfile(iid,nn,p);break;
    case "gnd":showEleProfile(iid,nn,p);break;
    case "msr":showMsrProfile(iid,nn,p);break;
    case "ctrl":showCtrlProfile(iid,nn,p);break;
    case "mod":flushModRecPush(iid,nn,p);;showModProfile(iid,nn,p);break;

  }

};//dblclick  MDbclickfunction

function flushModRecPush(iid,nn,p){
    _pssModRec = [];

    _pssModRec.push( nn );
    //~ _curModId=_pssMod[nn]['id'];
    //~ _curModSym=nn

    $('#modVNav').html( '<a onclick="" class="mod-vnav">'+nn+'</a>' );
}


function listCmp(){

  var tb = $('<table>');
      tb.addClass('cmp-tbl');
      tb.append('<tr><th>序号</th><th>类型</th><th>符号</th><th>名称</th><th>简介</th></tr>');
  var dat = loadList(1);

  var h = '',j=1;
  for(var i=0;i<dat.length;i++,j++){
    var tr = $('<tr>');
    tr.data('cmpid',dat[i].id);
    tr.mousedown(function(){WIN.curCmpID = $(this).data('cmpid')});
    h='<td>'+j+'</td><td>'+dat[i].type+'</td><td>'+dat[i].sym+'</td><td>'+dat[i].name+'</td><td>'+dat[i].desc+'</td>';
    var ds = mxUtils.makeDraggable(tr[0], graph, dndInsertM, dragElt, null, null, _graph.autoscroll, true);
    ds.isGuidesEnabled = function(){return _graph.graphHandler.guidesEnabled;};
    tr.append(h);
    tb.append(tr);
  }//for


var wnd = new mxWindow('选择元件', tb[0], 30, 60, 550, 300, true, true);
wnd.setScrollable(true);
wnd.setMinimizable(true);
wnd.setClosable(true);
wnd.setVisible(true);

}//listCmp


var dndInsertM = function(graphT, evt, target, x, y){
  var doc1 = loadById(WIN.curCmpID);
  var sym = doc1[0].sym;
  if('undefined' == typeof(thuCompC[sym])){
    thuCompC[sym] = 0;
  }
console.log('in file "x.js" dndInsertM');
  thuCompC[sym]++

  var doc = mxUtils.parseXml(doc1[0].shape);
  var model = new mxGraphModel();
  var codec = new mxCodec(doc);
  codec.decode(doc.documentElement, model);
  var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
  children[0].geometry.x=0;
  children[0].geometry.y=0;
console.log(children[0].thutype)
 // var j = objCount(thuComp[sym]);
  //    j+=1;
  children[0].setValue(sym+' - '+thuCompC[sym]);

  var xx = graphT.importCells(children,x,y,target)
/*
  if('undefined' == typeof(thuComp[sym])){
    thuComp[sym] = [];
  }
*/
  /** 元件的id形式 **/
  //thuComp[xx[0].id] = JSON.parse(doc1[0].default_param);
  //thuComp[xx[0].id]['name']=sym+' - '+thuCompC[sym]

  /** 元件的 符号 R - 1 形式 ，改用此种形式，因为在保存图纸后，再次载入时，id会变**/
  thuComp[sym+' - '+thuCompC[sym]] = JSON.parse(doc1[0].default_param);
  //thuComp[sym+' - '+thuCompC[sym]]['name']=sym+' - '+thuCompC[sym]
  // _editor.graph.setSelectionCells(_editor._graph.importCells(children));
};

// 初始化缩略视图面板
function initOutline(){
  var con = $('<div id="id_outline" style="width:100%;height:100%">');

  _wndList.Outline = new mxWindow('导航', con[0], 150, 30, 300, 200, true, true);

  _wndList.Outline.w=300;
  _wndList.Outline.h=200;
  
  _wndList.Outline.setScrollable(true);
  _wndList.Outline.setMinimizable(true);
  _wndList.Outline.setResizable(true);
  //~ _wndOutline.setVisible(true);

}// initModulePanel end

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
  // Computes the position of edge to edge connection points.
  mxGraphView.prototype.updateFixedTerminalPoint = function(edge, terminal, source, constraint)
  {
    var pt = null;

    if (constraint != null)
    {
      pt = this.graph.getConnectionPoint(terminal, constraint);
    }

    if (source)
    {
      edge.sourceSegment = null;
    }
    else
    {
      edge.targetSegment = null;
    }

    if (pt == null)
    {
      var s = this.scale;
      var tr = this.translate;
      var orig = edge.origin;
      var geo = this.graph.getCellGeometry(edge.cell);
      pt = geo.getTerminalPoint(source);

      // Computes edge-to-edge connection point
      if (pt != null)
      {
        pt = new mxPoint(s * (tr.x + pt.x + orig.x),
                 s * (tr.y + pt.y + orig.y));

        // Finds nearest segment on edge and computes intersection
        if (terminal != null && terminal.absolutePoints != null)
        {
          var seg = mxUtils.findNearestSegment(terminal, pt.x, pt.y);

          // Finds orientation of the segment
          var p0 = terminal.absolutePoints[seg];
          var pe = terminal.absolutePoints[seg + 1];
          var horizontal = (p0.x - pe.x == 0);

          // Stores the segment in the edge state
          var key = (source) ? 'sourceConstraint' : 'targetConstraint';
          var value = (horizontal) ? 'horizontal' : 'vertical';
          edge.style[key] = value;

          // Keeps the coordinate within the segment bounds
          if (horizontal)
          {
            pt.x = p0.x;
            pt.y = Math.min(pt.y, Math.max(p0.y, pe.y));
            pt.y = Math.max(pt.y, Math.min(p0.y, pe.y));
          }
          else
          {
            pt.y = p0.y;
            pt.x = Math.min(pt.x, Math.max(p0.x, pe.x));
            pt.x = Math.max(pt.x, Math.min(p0.x, pe.x));
          }
        }
      }
      // Computes constraint connection points on vertices and ports
      else if (terminal != null && terminal.cell.geometry.relative)
      {
        pt = new mxPoint(this.getRoutingCenterX(terminal),
          this.getRoutingCenterY(terminal));
      }

      // Snaps point to grid
      /*if (pt != null)
      {
        var tr = this.graph.view.translate;
        var s = this.graph.view.scale;

        pt.x = (this.graph.snap(pt.x / s - tr.x) + tr.x) * s;
        pt.y = (this.graph.snap(pt.y / s - tr.y) + tr.y) * s;
      }*/
    }

    edge.setAbsoluteTerminalPoint(pt, source);
  };

  // Sets source terminal point for edge-to-edge connections.
  mxConnectionHandler.prototype.createEdgeState = function(me)
  {
    var edge = this.graph.createEdge();

    if (this.sourceConstraint != null && this.previous != null)
    {
      edge.style = mxConstants.STYLE_EXIT_X+'='+this.sourceConstraint.point.x+';'+
        mxConstants.STYLE_EXIT_Y+'='+this.sourceConstraint.point.y+';';
    }
    else if (this.graph.model.isEdge(me.getCell()))
    {
      var scale = this.graph.view.scale;
      var tr = this.graph.view.translate;
      var pt = new mxPoint(this.graph.snap(me.getGraphX() / scale) - tr.x,
          this.graph.snap(me.getGraphY() / scale) - tr.y);
      edge.geometry.setTerminalPoint(pt, true);
    }

    return this.graph.view.createState(edge);
  };

  // Uses right mouse button to create edges on background (see also: lines 67 ff)
  mxConnectionHandler.prototype.isStopEvent = function(me)
  {
    return me.getState() != null || mxEvent.isRightMouseButton(me.getEvent());
  };

  // Updates target terminal point for edge-to-edge connections.
  mxConnectionHandlerUpdateCurrentState = mxConnectionHandler.prototype.updateCurrentState;
  mxConnectionHandler.prototype.updateCurrentState = function(me)
  {
    mxConnectionHandlerUpdateCurrentState.apply(this, arguments);

    if (this.edgeState != null)
    {
      this.edgeState.cell.geometry.setTerminalPoint(null, false);

      if (this.shape != null && this.currentState != null &&
        this.currentState.view.graph.model.isEdge(this.currentState.cell))
      {
        var scale = this.graph.view.scale;
        var tr = this.graph.view.translate;
        var pt = new mxPoint(this.graph.snap(me.getGraphX() / scale) - tr.x,
            this.graph.snap(me.getGraphY() / scale) - tr.y);
        this.edgeState.cell.geometry.setTerminalPoint(pt, false);
      }
    }
  };

  // Updates the terminal and control points in the cloned preview.
  mxEdgeSegmentHandler.prototype.clonePreviewState = function(point, terminal)
  {
    var clone = mxEdgeHandler.prototype.clonePreviewState.apply(this, arguments);
    clone.cell = clone.cell.clone();

    if (this.isSource || this.isTarget)
    {
      clone.cell.geometry = clone.cell.geometry.clone();

      // Sets the terminal point of an edge if we're moving one of the endpoints
      if (this.graph.getModel().isEdge(clone.cell))
      {
        // TODO: Only set this if the target or source terminal is an edge
        clone.cell.geometry.setTerminalPoint(point, this.isSource);
      }
      else
      {
        clone.cell.geometry.setTerminalPoint(null, this.isSource);
      }
    }

    return clone;
  };

  var mxEdgeHandlerConnect = mxEdgeHandler.prototype.connect;
  mxEdgeHandler.prototype.connect = function(edge, terminal, isSource, isClone, me)
  {
    var result = null;
    var model = this.graph.getModel();
    var parent = model.getParent(edge);

    model.beginUpdate();
    try
    {
      result = mxEdgeHandlerConnect.apply(this, arguments);
      var geo = model.getGeometry(result);

      if (geo != null)
      {
        geo = geo.clone();
        var pt = null;

        if (model.isEdge(terminal))
        {
          pt = this.abspoints[(this.isSource) ? 0 : this.abspoints.length - 1];
          pt.x = pt.x / this.graph.view.scale - this.graph.view.translate.x;
          pt.y = pt.y / this.graph.view.scale - this.graph.view.translate.y;

          var pstate = this.graph.getView().getState(
              this.graph.getModel().getParent(edge));

          if (pstate != null)
          {
            pt.x -= pstate.origin.x;
            pt.y -= pstate.origin.y;
          }

          pt.x -= this.graph.panDx / this.graph.view.scale;
          pt.y -= this.graph.panDy / this.graph.view.scale;
        }

        geo.setTerminalPoint(pt, isSource);
        model.setGeometry(edge, geo);
      }
    }
    finally
    {
      model.endUpdate();
    }

    return result;
  };

  mxConnectionHandlerCreateMarker = mxConnectionHandler.prototype.createMarker;
  mxConnectionHandler.prototype.createMarker = function()
  {
    var marker = mxConnectionHandlerCreateMarker.apply(this, arguments);

    // Uses complete area of cell for new connections (no hotspot)
    marker.intersects = function(state, evt)
    {
      return true;
    };

    // Adds in-place highlighting
    mxCellHighlightHighlight = mxCellHighlight.prototype.highlight;
    marker.highlight.highlight = function(state)
    {
      if (this.state != state)
      {
        if (this.state != null)
        {
          this.state.style = this.lastStyle;

          // Workaround for shape using current stroke width if no MAIN.strokeWidth defined
          this.state.style['MAIN.strokeWidth'] = this.state.style['MAIN.strokeWidth'] || '1';
          this.state.style['strokeColor'] = this.state.style['strokeColor'] || 'none';

          if (this.state.shape != null)
          {
            this.state.view.graph.cellRenderer.configureShape(this.state);
            this.state.shape.redraw();
          }
        }

        if (state != null)
        {
          this.lastStyle = state.style;
          state.style = mxUtils.clone(state.style);
          state.style['strokeColor'] = '#00ff00';
          state.style['MAIN.strokeWidth'] = '4';

          if (state.shape != null)
          {
            state.view.graph.cellRenderer.configureShape(state);
            state.shape.redraw();
          }
        }

        this.state = state;
      }
    };

    return marker;
  };

  mxEdgeHandlerCreateMarker = mxEdgeHandler.prototype.createMarker;
  mxEdgeHandler.prototype.createMarker = function()
  {
    var marker = mxEdgeHandlerCreateMarker.apply(this, arguments);

    // Adds in-place highlighting when reconnecting existing edges
    marker.highlight.highlight = this.graph.connectionHandler.marker.highlight.highlight;

    return marker;
  }

  mxGraphGetCellStyle = mxGraph.prototype.getCellStyle;
  mxGraph.prototype.getCellStyle = function(cell)
  {
    var style = mxGraphGetCellStyle.apply(this, arguments);

    if (style != null && this.model.isEdge(cell))
    {
      style = mxUtils.clone(style);

      if (this.model.isEdge(this.model.getTerminal(cell, true)))
      {
        style['startArrow'] = 'oval';
      }

      if (this.model.isEdge(this.model.getTerminal(cell, false)))
      {
        style['endArrow'] = 'oval';
      }
    }

    return style;
  };



mxEdgeStyle.WireConnector = function(state, source, target, hints, result)
{
  // Creates array of all way- and terminalpoints
  var pts = state.absolutePoints;
  var horizontal = true;
  var hint = null;

  // Gets the initial connection from the source terminal or edge
  if (source != null && state.view.graph.model.isEdge(source.cell))
  {
    horizontal = state.style['sourceConstraint'] == 'horizontal';
  }
  else if (source != null)
  {
    horizontal = source.style['portConstraint'] != 'vertical';

    // Checks the direction of the shape and rotates
    var direction = source.style[mxConstants.STYLE_DIRECTION];

    if (direction == 'north' || direction == 'south')
    {
      horizontal = !horizontal;
    }
  }

  // Adds the first point
  // TODO: Should move along connected segment
  var pt = pts[0];

  if (pt == null && source != null)
  {
    pt = new mxPoint(state.view.getRoutingCenterX(source), state.view.getRoutingCenterY(source));
  }
  else if (pt != null)
  {
    pt = pt.clone();
  }

  var first = pt;

  // Adds the waypoints
  if (hints != null && hints.length > 0)
  {
    // FIXME: First segment not movable
    /*hint = state.view.transformControlPoint(state, hints[0]);
    mxLog.show();
    mxLog.debug(hints.length,'hints0.y='+hint.y, pt.y)

    if (horizontal && Math.floor(hint.y) != Math.floor(pt.y))
    {
      mxLog.show();
      mxLog.debug('add waypoint');

      pt = new mxPoint(pt.x, hint.y);
      result.push(pt);
      pt = pt.clone();
      //horizontal = !horizontal;
    }*/

    for (var i = 0; i < hints.length; i++)
    {
      horizontal = !horizontal;
      hint = state.view.transformControlPoint(state, hints[i]);

      if (horizontal)
      {
        if (pt.y != hint.y)
        {
          pt.y = hint.y;
          result.push(pt.clone());
        }
      }
      else if (pt.x != hint.x)
      {
        pt.x = hint.x;
        result.push(pt.clone());
      }
    }
  }
  else
  {
    hint = pt;
  }

  // Adds the last point
  pt = pts[pts.length - 1];

  // TODO: Should move along connected segment
  if (pt == null && target != null)
  {
    pt = new mxPoint(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target));
  }

  if (horizontal)
  {
    if (pt.y != hint.y && first.x != pt.x)
    {
      result.push(new mxPoint(pt.x, hint.y));
    }
  }
  else if (pt.x != hint.x && first.y != pt.y)
  {
    result.push(new mxPoint(hint.x, pt.y));
  }
};

mxStyleRegistry.putValue('wireEdgeStyle', mxEdgeStyle.WireConnector);

// This connector needs an mxEdgeSegmentHandler
mxGraphCreateHandler = mxGraph.prototype.createHandler;
mxGraph.prototype.createHandler = function(state)
{
  var result = null;

  if (state != null)
  {
    if (this.model.isEdge(state.cell))
    {
      var style = this.view.getEdgeStyle(state);

      if (style == mxEdgeStyle.WireConnector)
      {
        return new mxEdgeSegmentHandler(state);
      }
    }
  }

  return mxGraphCreateHandler.apply(this, arguments);
};

