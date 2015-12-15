Date.prototype.Format = function(fmt){
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

function getXml(){

  var xx = '<?xml version="1.0"?>';
  var encoder = new mxCodec();
  var node = encoder.encode(_graph.getModel());

  var xml = mxUtils.getXml(node);
  //var tt = encoder.encodeCell(_graph.getModel(),xx,true);
  //console.log(tt);return;
  console.log(mxUtils.getPrettyXml(node), true);

}


// 载入指定id的元件
function getCompById(id){
  var x ='';
  $.ajax({
    type : "get",
    url : '/editor/getComponent/?id='+id,
    data :'',
    dataType: "json",
    async : false,
    success : function(data){
      if(data.status !=0 ){
        alert(data.msg);
        return false;
      }
      x = data;
    },
    error:function(){
      alert('暂时未能获取元件信息')
      return false;
    }
    });
  return x;
}

// 载入指定id的元件
function getCompBySym(sym){
  var x ='';
  $.ajax({
    type : "get",
    url : '/editor/getComponentBySym/?sym='+sym,
    data :'',
    dataType: "json",
    async : false,
    success : function(data){
      if(data.status !=0 ){
        alert(data.msg);
        return false;
      }
      x = data;
    },
    error:function(){
      alert('暂时未能获取元件信息')
      return false;
    }
    });
  return x;
}


// 元件面板显示切换
function toggleCompPanel(self){
  var show = $(self).data('show') >> 0;
  if( show == 1){
    _wndList.Comp.hide();
    $(self).removeClass('shown').data('show',0);
  }else{
    _wndList.Comp.show();
    $(self).addClass('shown').data('show',1);
  }
}
function toggleCtrlPanel(self){
  var show = $(self).data('show') >> 0;
  if( show == 1){
    _wndList.Ctrl.hide();
    $(self).removeClass('shown').data('show',0);
  }else{
    _wndList.Ctrl.show();
    $(self).addClass('shown').data('show',1);
  }
}
function toggleMsrPanel(self){
  var show = $(self).data('show') >> 0;
  if( show == 1){
    _wndList.Msr.hide();
    $(self).removeClass('shown').data('show',0);
  }else{
    _wndList.Msr.show();
    $(self).addClass('shown').data('show',1);
  }
}

//模块面板显示切换
function toggleModulePanel(self){
  var show = $(self).data('show') >> 0;
  if( show == 1){
    _wndList.Module.hide();
    $(self).removeClass('shown').data('show',0);
  }else{
    _wndList.Module.show();
    $(self).addClass('shown').data('show',1);
  }
}

//我的模块面板显示切换
function toggleMyModulePanel(self){
  var show = $(self).data('show') >> 0;
  if( show == 1){
    _wndUserModule.hide();
    $(self).removeClass('shown').data('show',0);
  }else{
    _wndUserModule.show();
    $(self).addClass('shown').data('show',1);
  }
}

//统信息面板显示切换
function toggleSysInfo(self){
  var show = $(self).data('show') >> 0;
  if( show == 1){
    _wndList.wInfo.hide();
    $(self).removeClass('shown').data('show',0);
  }else{
    _wndList.wInfo.show();
    $(self).addClass('shown').data('show',1);
  }
}

//缩略图导航
function toggleOutline(self){
  var show = $(self).data('show') >> 0;
  if( show == 1){
    _wndOutline.hide();
    $(self).removeClass('shown').data('show',0);
  }else{
    _wndOutline.show();
    $(self).addClass('shown').data('show',1);
  }
}

// 载入元件列表，参数：页码
function loadComponentList(p){
  if( p > MAIN.totalCmpPage ){
    return false;
  }
  var i = 0,l=0,$li=null,$ul=$('#id_complist');
  $ul.html('');
  $.get(
    '/editor/componentList/?page='+p,
    function(re,status,jxhr){
      if(re.status != 0 ){
        alert(re['msg']);
        return;
      }
      l=re['cmp'].length;
      for(i;i<l;i++){
        $li = $('<li class="component-item" data-id="'+re['cmp'][i]['id']+'" title="'+re['cmp'][i]['typename']+'"><img src="'+re['cmp'][i]['icon']+'"/></li>');
        $ul.append($li);
        $li.mousedown(function(){MAIN.curCmpId = $(this).data('id')});
        mxUtils.makeDraggable($li[0], _graph, insertComp, dragElt, null, null, _graph.autoscroll, true);

      }
    },'json'

  );
}

// 载入控制元件列表，参数：页码
function loadCtrlList(p){
  if( p > MAIN.totalCmpPage ){
    return false;
  }
  var i = 0,l=0,$li=null,$ul=$('#id_ctrllist');
  $ul.html('');
  $.get(
    '/editor/ctrlList/?page='+p,
    function(re,status,jxhr){
      if(re.status != 0 ){
        alert(re['msg']);
        return;
      }
      l=re['cmp'].length;
      for(i;i<l;i++){
        $li = $('<li class="component-item" data-id="'+re['cmp'][i]['id']+'" title="'+re['cmp'][i]['typename']+'"><img src="'+re['cmp'][i]['icon']+'"/></li>');
        $ul.append($li);
        $li.mousedown(function(){MAIN.curCmpId = $(this).data('id')});
        mxUtils.makeDraggable($li[0], _graph, insertCtrl, dragElt, null, null, _graph.autoscroll, true);

      }
    },'json'

  );
}

// 载入量测元件列表，参数：页码
function loadMsrList(p){
  if( p > MAIN.totalCmpPage ){
    return false;
  }
  var i = 0,l=0,$li=null,$ul=$('#id_msrlist');
  $ul.html('');
  $.get(
    '/editor/msrList/?page='+p,
    function(re,status,jxhr){
      if(re.status != 0 ){
        alert(re['msg']);
        return;
      }
      l=re['cmp'].length;
      for(i;i<l;i++){
        $li = $('<li class="component-item" data-id="'+re['cmp'][i]['id']+'" title="'+re['cmp'][i]['typename']+'"><img src="'+re['cmp'][i]['icon']+'"/></li>');
        $ul.append($li);
        $li.mousedown(function(){MAIN.curCmpId = $(this).data('id')});
        mxUtils.makeDraggable($li[0], _graph, insertMsr, dragElt, null, null, _graph.autoscroll, true);

      }
    },'json'

  );
}

/** 设置拖拽的预览 **/
function setDragElt(w,h,bg){
  dragElt.style.width = w+'px';
  dragElt.style.height = h+'px';
  dragElt.style.backgroundImage='url('+bg+')';
}
function resetDragElt(){
  dragElt.style.width = '60px';
  dragElt.style.height = '60px';
  dragElt.style.backgroundImage='url()';
}

// 当选择操作未选中整个元件时，将元件整体设为被选择状态
/*
mxGraph.prototype.getSelectionCells=function(){
    var x = this.getSelectionModel().cells.slice();
    var s = []
    console.log('原始选择',x);
    //~ 排出edge的选择
    if( x.length > 0 && x[0].isEdge() ){
        
        s.push(x[0]);
        console.log('selected:',x[0]);
        //~ return x;
    }
    for(var i =0;i<x.length;i++){
        x[i].value != "" ? s.push(x[i]):s.push( x[i].parent );
    }
    return s;
}
*/
// 处理连接事件，电气元件的msrout只能被测量元件连接
mxConnectionHandler.prototype.connect=function(source, target, evt, dropTarget){
//~ console.log('---',source.parent.thutype,target.parent.thutype);
// ele : msr 允许的连接关系
// ele : ele
// ctrl : ctrl
// msr : ctrl
// msr 包含: msr,pEm,nEm,Im
var _msr_ = ['msr','pEm','nEm','Im'];
console.log ( source )
if (target != null || this.isCreateTarget() || this.graph.allowDanglingEdges){
    /*console.log( typeof source.msrout,typeof target.msrout)
    if( source.parent.thutype == 'ele' ){// ele 只能连 msr或 ele
        console.log('1 source:',source.parent.thutype,'- target',target.parent.thutype ,_msr_.indexOf( target.parent.thutype ))
        if( target.parent.thutype != 'ele' && _msr_.indexOf( target.parent.thutype ) <0) return false;
    }
    if( typeof(target.msrout) == 'undefined' && target.parent.thutype == 'ele' ){
        console.log('2 source:',source.parent.thutype,'-target',target.parent.thutype )
        if( source.parent.thutype != 'ele' || _msr_.indexOf( source.parent.thutype ) <0) return false;
    }
    if( source.parent.thutype == 'ctrl' ){// ctrl 只能连ctrl 或 msr
        console.log('3 source:',source.parent.thutype,'-target',target.parent.thutype )
        if( target.parent.thutype != 'ctrl' && _msr_.indexOf( target.parent.thutype ) <0) return false;
    }
    if( target.parent.thutype == 'ctrl' ){// ctrl 只能连ctrl 或 msr
        console.log('4 source:',source.parent.thutype,'-target',target.parent.thutype )
        if( source.parent.thutype != 'ctrl' || _msr_.indexOf( source.parent.thutype ) <0) return false;
    }

    if( typeof(source.msrout) != 'undefined' ){//从测量点引出的，只能接到msr类型的设备上
        console.log('1 msrout:',source.msrout);
        if( _msr_.indexOf( target.parent.thutype) < 0 ) return false;
        //~ if( typeof(target.msrout) == 'undefined' ) return false;
    }
    if( typeof(target.msrout) != 'undefined' ){
        console.log( '2 msrout:',target.msrout,'===',_msr_.indexOf(source.parent.thutype) )
        if( _msr_.indexOf( source.parent.thutype) < 0 ) return false;
        //~ if( typeof( source.msrout) == 'undefined' ) return false;
    }*/
		// Uses the common parent of source and target or
		// the default parent to insert the edge
		var model = this.graph.getModel();
		var terminalInserted = false;
		var edge = null;

		model.beginUpdate();
		try{
			if (source != null && target == null && this.isCreateTarget()){
				target = this.createTargetVertex(evt, source);

				if (target != null){
					dropTarget = this.graph.getDropTarget([target], evt, dropTarget);
					terminalInserted = true;

					// Disables edges as drop targets if the target cell was created
					// FIXME: Should not shift if vertex was aligned (same in Java)
					if (dropTarget == null || !this.graph.getModel().isEdge(dropTarget)){
						var pstate = this.graph.getView().getState(dropTarget);

						if (pstate != null){
							var tmp = model.getGeometry(target);
							tmp.x -= pstate.origin.x;
							tmp.y -= pstate.origin.y;
						}
					}
					else{
						dropTarget = this.graph.getDefaultParent();
					}

					this.graph.addCell(target, dropTarget);
				}
			}

			var parent = this.graph.getDefaultParent();

			if (source != null && target != null &&
				model.getParent(source) == model.getParent(target) &&
				model.getParent(model.getParent(source)) != model.getRoot())
			{
				parent = model.getParent(source);

				if ((source.geometry != null && source.geometry.relative) &&
					(target.geometry != null && target.geometry.relative))
				{
					parent = model.getParent(parent);
				}
			}

			// Uses the value of the preview edge state for inserting
			// the new edge into the graph
			var value = null;
			var style = null;

			if (this.edgeState != null){
				value = this.edgeState.cell.value;
				style = this.edgeState.cell.style;
			}

			edge = this.insertEdge(parent, null, value, source, target, style);

			if (edge != null){
				// Updates the connection constraints
				this.graph.setConnectionConstraint(edge, source, true, this.sourceConstraint);
				this.graph.setConnectionConstraint(edge, target, false, this.constraintHandler.currentConstraint);

				// Uses geometry of the preview edge state
				if (this.edgeState != null){
					model.setGeometry(edge, this.edgeState.cell.geometry);
				}

				// Makes sure the edge has a non-null, relative geometry
				var geo = model.getGeometry(edge);

				if (geo == null){
					geo = new mxGeometry();
					geo.relative = true;

					model.setGeometry(edge, geo);
				}

				// Uses scaled waypoints in geometry
				if (this.waypoints != null && this.waypoints.length > 0){
					var s = this.graph.view.scale;
					var tr = this.graph.view.translate;
					geo.points = [];

					for (var i = 0; i < this.waypoints.length; i++){
						var pt = this.waypoints[i];
						geo.points.push(new mxPoint(pt.x / s - tr.x, pt.y / s - tr.y));
					}
				}

				if (target == null){
					var t = this.graph.view.translate;
					var s = this.graph.view.scale;
					var pt = new mxPoint(this.currentPoint.x / s - t.x, this.currentPoint.y / s - t.y);
					pt.x -= this.graph.panDx / this.graph.view.scale;
					pt.y -= this.graph.panDy / this.graph.view.scale;
					geo.setTerminalPoint(pt, false);
				}

				this.fireEvent(new mxEventObject(mxEvent.CONNECT, 'cell', edge, 'terminal', target,
					'event', evt, 'target', dropTarget, 'terminalInserted', terminalInserted));
			}
		}
		catch (e){
			mxLog.show();
			mxLog.debug(e.message);
		}
		finally{
			model.endUpdate();
		}

		if (this.select){
			this.selectCells(edge, (terminalInserted) ? target : null);
		}
	}
}// 连接处理 结束
// 复制事件
mxClipboard.copy = function(a, cells){
    cells = cells || _graph.getSelectionCells();
    /*var cellsa = [];
    for(var i =0;i<cells.length;i++){
        if( cells[i].parent == null ) continue;
        cellsa.push(cells[i])
    }*/
    //~ console.log("复制了",cells.value || cells[0].parent.value);
    var result = _graph.getExportableCells(cells);
    mxClipboard.insertCount = 1;
    mxClipboard.setCells( _graph.cloneCells(result) );
    return result;
}
function deepCopy(a,b) {
    var _clone= {},i=0,
    _arg=arguments,_co='',len=_arg.length;
    if(!_arg[1]){
        _clone=this;
    };
    for(;i<len;i++){
        _co = _arg[i];
        for(var name in _co){
            //深度拷贝
            if( typeof _co[name] === 'object'){
                _clone[name] = (_co[name].constructor === Array)?[]:{};
                _clone[name] = deepcopy(_co[name],_clone[name]);
            }else{
                _clone[name] = _co[name];
            }
        }
    }

    return _clone;
};
mxClipboard.paste=function(){
    if( mxClipboard.isEmpty() ) return false;
    var cells = _graph.getImportableCells( mxClipboard.getCells() );
    var delta = mxClipboard.insertCount * mxClipboard.STEPSIZE;
    var parent = _graph.getDefaultParent();
    // 处理参数的复制粘贴时参数的复制问题
    var i = 0,name='',sym='',symn='',thutype='';
    for(i=0;i<cells.length;i++){
        //~ console.log( '---',cells[i] )
        //~ if( cells[i].parent==null && cells.thutype) continue;
        name = cells[i].value || cells[i].parent.value;
        //~ console.log( name );
        thutype = cells[i].thutype || cells[i].parent.thutype;
        switch(thutype){
            case 'ele':;
            case 'gnd':
                //thutype = _pssEle[name]["thutype"];
                sym = _pssEle[name]["sym"]; // 获得元件的符号
                _pssEleCount[sym]++; //元件符号计数+1
                symn = sym+'-'+_pssEleCount[sym]; // 新的元件名称
                cells[i].value ? (cells[i].value=symn):(cells[i].parent.value=symn); //更新视图里的符号显示
                _pssEle[symn] = {};
                $.extend(true,_pssEle[symn],_pssEle[name]); //深度复制元件参数
                break;

            case 'ctrl':
                //thutype = _pssCtrl[name]["thutype"];
                sym = _pssCtrl[name]["sym"]; // 获得元件的符号
                _pssEleCount[sym]++; //元件符号计数+1
                symn = sym+'-'+_pssEleCount[sym]; // 新的元件名称
                cells[i].value ? (cells[i].value=symn):(cells[i].parent.value=symn); //更新视图里的符号显示
                _pssCtrl[symn] = {};
                $.extend(true,_pssCtrl[symn],_pssCtrl[name]); //深度复制元件参数
                break;

            case 'msr':;
            case 'pEm':;
            case 'nEm':;
            case 'Im':
                sym = _pssMsr[name]["sym"]; // 获得元件的符号
                _pssEleCount[sym]++; //元件符号计数+1
                symn = sym+'-'+_pssEleCount[sym]; // 新的元件名称
                cells[i].value ? (cells[i].value=symn):(cells[i].parent.value=symn); //更新视图里的符号显示
                _pssMsr[symn] = {};
                $.extend(true,_pssMsr[symn],_pssMsr[name]); //深度复制元件参数
                break;

            // 模块
            case 'mod':
                sym = _pssMod[name]["sym"]; // 获得模块的符号
                _pssModCount[sym]++; //模块符号计数+1
                symn = sym+'-'+_pssModCount[sym]; // 新的模块名称
                cells[i].value ? (cells[i].value=symn):(cells[i].parent.value=symn); //更新视图里的符号显示
                _pssMod[symn] = {};
                $.extend(true,_pssMod[symn],_pssMod[name]); //深度复制模块参数
            break;
        }
    }

    cells = _graph.importCells( cells,delta,delta,parent );
    mxClipboard.insertCount++;
    _graph.setSelectionCells(cells);

}
