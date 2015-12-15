function genMsrNode(nodeTmp){
  function mergeNode(nodeArray){
    i=0,j=0;l=nodeArray.length;
    var nt = nodeArray,ok=true;
    for(i=0;i<l-1;i++){//for1
      for(j=i+1;j<l;j++){//for2
        if(nodeArray[j] == undefined) break;
        if(_.intersection(nodeArray[i],nodeArray[j]).length>0){
          nt[i] = _.union( nt[i],nt[j] );
          nt.splice(j,1);
          ok=false;
        }
      }//for2
    }//for1
    for(i=0;i<nt.length;i++){
      //~ nt[i] = nt[i].unique();
      nt[i] = _.unique( nt[i] );
      }
    if(ok){ //nn = nt;
      _pssNodeMsr=nt;
      return; }
    else{ mergeNode(nt) }
  }//functoin mergetNode.
  mergeNode(nodeTmp);

}
// endof genMsrNode

function genCtrlNode(nodeTmp){
  function mergeNode(nodeArray){
    i=0,j=0;l=nodeArray.length;
    var nt = nodeArray,ok=true;
    for(i=0;i<l-1;i++){//for1
      for(j=i+1;j<l;j++){//for2
        if(nodeArray[j] == undefined) break;
        if(_.intersection(nodeArray[i],nodeArray[j]).length>0){
          nt[i] = _.union( nt[i],nt[j] );
          nt.splice(j,1);
          ok=false;
        }
      }//for2
    }//for1
    for(i=0;i<nt.length;i++){
      //~ nt[i] = nt[i].unique();
      nt[i] = _.unique( nt[i] );
      }
    if(ok){ //nn = nt;
      _pssNodeCtrl=nt;
      return; }
    else{ mergeNode(nt) }
  }//functoin mergetNode.
  mergeNode(nodeTmp);

}


function genMsrRelation(){
var tmpmodel = _graph.getModel();
var t=null,tn = null;
    for( var x in _rpssMsr){
        for(var y in _rpssMsr[x]['pin']){
            if( ( _rpssMsr[x]['pin'][y]['id']>>0) >0 ){
                // 该引脚不悬空
                for(var i=0;i<_pssNodeMsr.length;i++){
                    for( var j=0;j<_pssNodeMsr[i].length;j++){
                        t = tmpmodel.getCell( _pssNodeMsr[i][j] );
                        tn = t.parent.value;
                        if( t.parent.thutype == 'ele' ){
                            _pssEle[ tn ]['msrout'] = x;
                            _rpssMsr[x]['msrin'] = tn;
                        }
                    }
                }

            }
        }
    }
}
// end of genMsrRelation

function genModIO(ioEleNode){
    // 生成模块的链接点
    var mods = [],tmp=null;
    var _modeltmp = _graph.getModel();
    for( var x in _pssMod ){
        tmp = _modeltmp.getCell(_pssMod[x]['mid']).children;
        for( var i=0;i<tmp.length;i++){
            if( tmp[i].connectable == true ){

            }
        }
    }
    return;
// 处理input的
var model = _graph.getModel(),tmp=null;
    for(var io in _IO['input']){
        for(var i=0;i<ioEleNode[io].length;i++){
            tmp = model.getCell( ioEleNode[io][i] )
            if( tmp.parent.thutype == 'mod'){//当连接目标是模块时
                _IO['input'][io]['tgmod']=tmp.parent.value;
                _IO['input'][io]['tgpin']=tmp.value;
            }else{

            }

        }
    }
    for(var io in _IO['output']){
        for(var i=0;i<ioEleNode[io].length;i++){
            tmp = model.getCell( ioEleNode[io][i] )
            if( tmp.parent.thutype == 'mod'){//当连接目标是模块时
                _IO['output'][io]['tgmod']=tmp.parent.value;
                _IO['output'][io]['tgpin']=tmp.value;
            }
        }
    }

}// endofgenModIO




//直接用连线连接的节点
function genNodeEdge(){
  var nodeTmp = [],vts=_graph.getChildEdges();//产生临时节点表
  //nodeTmp=[[源的id',目的的id'],[1,3]]
  function getTId(edge){//顺target侧走
    if(edge.target != null){
      if(!edge.target.edge)
        return edge.target.id >> 0;
      else
        return getTId(edge.target)
    }else{
      if(!edge.source.edge)
        return edge.source.id >> 0;
      else{
        if(edge.source.target != null)
          return getTId(edge.source.target)
        else
          return getTId(edge.source.source)
      }
    }
  }//顺target侧走 end
  function getSId(edge){//顺source侧走
    if(edge.source.edge){
      return getSId(edge.source)
    }else{
      return edge.source.id >> 0;
    }
  }//顺source侧走 end
  var gndNodeArray = [];

  var iii1 = null,iii2=null;
  var meters=['pEm','nEm','Im']; // 需要显示的量测元件，不会出现在模块中

  var tmp1=tmp2=0,l=vts.length,m=_graph.getModel();
      for(var i=0;i<l;i++){//产生临时节点表
        //edge的source是vertex或再edge

        tmp1 = getTId(vts[i]);
        tmp2 = getSId(vts[i]);
        iii1 = m.getCell(tmp1),iii2 = m.getCell(tmp2);
        
        if( iii1.parent.thutype == 'ctrl' || iii2.parent.thutype == 'ctrl'){
          //遇到控制系统直连的,电气系统不与控制系统直接相连，而量测系统的输出，采用的是字母标记
          // 控制系统只与控制系统通过连线相连，如果控制系统需要输出到电气元件，采用字母标记输出
          _pssNodeCtrl.push([tmp2,tmp1]);
          continue;
        }

        // 建立模块时：当遇到需要显示的量测元件时直接跳过，实际上也不会出现，在元件面板里已经过滤掉了
        // 建立仿真时：需要进行过滤，需要显示的电表到后台处理，同时仿真转模块时遇到显示型的，需要做提醒
        // {self是自己的引脚id，target是目标名称,tgpin目标引脚id}
        //~ console.log('......thutype 1....',iii1.parent.thutype,tmp1,tmp2);
        //~ console.log('......thutype 2....',iii2.parent.thutype,tmp1,tmp2);
        if( meters.indexOf(iii1.parent.thutype) > -1 ){
            //~ console.log(iii1.parent.thutype)
            switch( iii1.parent.thutype ){
                case "Im":{
                    _pssMeters[ iii1.parent.value ] = {
                        "self":tmp1,
                        "type":"Im",
                        "target":iii2.parent.value,//只有target有用
                        "pin1":0,
                        "pin2":0
                        };
                        };
                case "nEm":{
                    _pssMeters[ iii1.parent.value ] = {
                        "self":tmp1,
                        "type":"nEm",
                        "target":iii2.parent.value,
                        "pin1":tmp2,//只有该节点号有用
                        "pin2":0
                        };
                        };
                case "pEm":{
                    // bug to be fixed:从线连接到电表识别错误
                    //~ console.log('iii1, tmp1 is', tmp1);
                    // 节点电压，2个引脚。如果该电表没有被记录
                    if(typeof( _pssMeters[ iii1.parent.value ] ) == 'undefined' )
                    _pssMeters[ iii1.parent.value ] = {
                        "self":tmp1,
                        "type":"pEm",
                        "target":0,//事实上target已经没用,挪作节点编号计数
                        "pin1":tmp2,//tmp2是被测的节点号
                        "pin2":0
                        };
                    else{
                        //~ console.log( 'iii1 else tmp2 is', tmp2);
                        _pssMeters[ iii1.parent.value ]['pin2']=tmp2;
                    }
                };
            }
            //~ continue;
        }

        if( meters.indexOf(iii2.parent.thutype) > -1 ){
            //~ console.log('iii2',iii2.parent.thutype)
            switch( iii2.parent.thutype ){
                
                case "Im":{
                    //~ console.log('in case ')
                    _pssMeters[ iii2.parent.value ] = {
                        "self":tmp1,
                        "type":"Im",
                        "target":iii1.parent.value,
                        "pin1":0,
                        "pin2":0
                        };
                        };
                case "nEm":{
                    _pssMeters[ iii2.parent.value ] = {
                        "self":tmp1,
                        "type":"nEm",
                        "target":iii1.parent.value,
                        "pin1":tmp2,
                        "pin2":0
                        };
                        };
                case "pEm":{
                    // 节点电压，2个引脚。如果该电表没有被记录
                     //~ console.log('iii2, tmp2 is', tmp2);
                    if(typeof( _pssMeters[ iii2.parent.value ] ) == 'undefined' )
                    _pssMeters[ iii2.parent.value ] = {
                        "self":tmp2,// 自己的引脚id
                        "type":"pEm",
                        "target":0,//事实上target已经没用 ,挪作节点编号计数
                        "pin1":0,
                        "pin2":tmp1
                        };
                    else{
                        //~ console.log('iii2 tmp1 is ',tmp1)
                        _pssMeters[ iii2.parent.value ]['pin1']=tmp1;
                    }
                };
            }
            continue;
        }

        
        if( iii1.parent.thutype == 'msr' ){
          //遇到控制系统直连的,电气系统不与控制系统直接相连，而量测系统的输出，采用的是字母标记
          // 当有量测与电气元件的连接情况时，也归到量测里，也符合输出点的设计
          //~ _pssNodeMsr.push([tmp2,tmp1]);
          //~ continue;
          _rpssMsr[iii1.parent.value]['msrin'] = iii2.parent.value
          /**** 量测元件的节点号不提出来  ***/
        }
        if( iii2.parent.thutype == 'msr' ){
          //遇到控制系统直连的,电气系统不与控制系统直接相连，而量测系统的输出，采用的是字母标记
          // 当有量测与电气元件的连接情况时，也归到量测里，也符合输出点的设计
          //~ _pssNodeMsr.push([tmp2,tmp1]);
          //~ continue;
          _rpssMsr[iii2.parent.value]['msrin'] = iii1.parent.value
          /**** 量测元件的节点号不提出来  ***/
        }
        if( iii1.parent.thutype == 'gnd' || iii2.parent.thutype == 'gnd'){
          //gndArray.push(tmp1);
          gndNodeArray.push(tmp1,tmp2);
         // nodeTmp[0].push(tmp1);
          //nodeTmp[i+1] = [tmp2];
          continue;
        }
        nodeTmp.push( [tmp2,tmp1] )
      }
  var i=0,j=0,l=0;
  nodeTmp.unshift(gndNodeArray);
  function mergeNode(nodeArray){
    i=0,j=0;l=nodeArray.length;
    var nt = nodeArray,ok=true;
    for(i=0;i<l-1;i++){//for1
      for(j=i+1;j<l;j++){//for2
        if(nodeArray[j] == undefined) break;
        //~ if(arrayIntersection(nodeArray[i],nodeArray[j]).length>0){
        if(_.intersection(nodeArray[i],nodeArray[j]).length>0){
          //Array.prototype.push.apply(nt[i],nt[j]);
          //~ nt[i].extend(nt[j]);
          nt[i] = _.union( nt[i],nt[j] );
          nt.splice(j,1);
          ok=false;
        }
      }//for2
    }//for1
    for(i=0;i<nt.length;i++){
      //~ nt[i] = nt[i].unique();
      nt[i] = _.unique( nt[i] );
      }
    if(ok){ //nn = nt;
      //gndNodeArray.unique();
      //~ var xxx = gndNodeArray.unique()
      //~ var xxx = _.unique( gndNodeArray );
      //~ _pssGndTMp.extend(xxx);
      //~ _pssGndTMp = _.union( _pssGndTMp,xxx);
      _pssNode=nt;
      //~ _pssNode.unshift(gndNode);
      //~ _pssNode.unshift(_pssGndTMp);
      return; }
    else{ mergeNode(nt) }
  }//functoin mergetNode.
  mergeNode(nodeTmp);

}//function genNodeEdge()

//人为设置标签编号的节点
function genNodeLabel(){
  var es = _graph.getChildVertices();
  var i=0,j=0,l=es.length;
  var eslb={}
  for(i;i<l;i++){
    for(j=0;j<es[i].children.length;j++)
      if(es[i].children[j].connectable == true && es[i].children[j].value != '' ){//被人为标了名字的连接点
        //{'label':[1,2,3],'lable2':[id1,id2,id3]}
        if(eslb[es[i].children[j].value] == undefined){
          eslb[es[i].children[j].value] = [];
          eslb[es[i].children[j].value].push(es[i].children[j].id>>0)
        }
        else
          eslb[es[i].children[j].value].push(es[i].children[j].id>>0)
      }
  }
  for(i in eslb){//删除没有配对的标识
    if(eslb[i].length < 2) delete eslb[i];
  }
  l=_pssNode.length;
  var tmp=false
  for(j in eslb){//电气系统的，包含量测系统
    tmp = false;
      for(i=0;i<l;i++){
        //~ if(arrayIntersection(eslb[j],_pssNode[i]).length>0){
        if(_.intersection(eslb[j],_pssNode[i]).length>0){
          //~ _pssNode[i].extend(eslb[j])
          _pssNode[i] = _.union( _pssNode[i], eslb[j] );
          tmp = true;
        }
      }
      if(!tmp)
        _pssNode.push(eslb[j])
  }

  l=_pssNodeCtrl.length;
  tmp=false
  for(j in eslb){//控制系统的
    tmp = false;
      for(i=0;i<l;i++){
        //~ if(arrayIntersection(eslb[j],_pssNodeCtrl[i]).length>0){
        if(_.intersection(eslb[j],_pssNodeCtrl[i]).length>0){
          //~ _pssNodeCtrl[i].extend(eslb[j])
          _pssNodeCtrl[i] = _.union( _pssNodeCtrl[i], eslb[j] )
          tmp = true;
        }
      }
      if(!tmp)
        _pssNodeCtrl.push(eslb[j])
  }
  l=_pssNode.length;
  for(i=0;i<l;i++){//电气系统
    //~ _pssNode[i] = _pssNode[i].unique();
    _pssNode[i] = _.unique( _pssNode[i] )
  }

  l=_pssNodeCtrl.length;
  for(i=0;i<l;i++){//控制系统
    //~ _pssNodeCtrl[i] = _pssNodeCtrl[i].unique();
    _pssNodeCtrl[i] = _.unique( _pssNodeCtrl[i] );
  }

}//function genNodeLabel




function genMsr(){//测量系统的名字与控制系统的输入相关联，故而测量系统需要重新生成
  var vts = graph.getChildVertices();
  var i=0,j=0,l=vts.length;
  for(i;i<l;i++){
    //c = gm.getCell(i);
    if(vts[i].thutype != 'msr') continue;
    
    if(vts[i].msrtype == 3){//支路电流 不显示，用draw来标识是否绘图
      thuIa[vts[i].value]={"id":vts[i].id>>0,"draw":0,"type":"3","name":"Ia","ctl":"","myNode":"","eleId":"","eleNode":"","param":[],"pins":[{"pin":"","node":""},{"pin":"","node":""}]};
      continue;
    }
    if(vts[i].msrtype == 10){//支路电流 显示
      thuIa[vts[i].value]={"id":vts[i].id>>0,"draw":1,"type":"3","name":"Ia","ctl":"","myNode":"","eleId":"","eleNode":"","param":[],"pins":[{"pin":"","node":""},{"pin":"","node":""}]};
      continue;
    }
    
    if(vts[i].msrtype == 2){//支路电压 不显示
      thuE[vts[i].value]={"id":vts[i].id>>0,"draw":0,"type":"2","name":"E","ctl":"","ctlid":"","myNode":"","eleId":"","eleNode":"","param":[],"pins":[{"pin":"","node":""},{"pin":"","node":""}]};
      continue;
    }
    if(vts[i].msrtype == 12){//支路电压 显示
      thuE[vts[i].value]={"id":vts[i].id>>0,"draw":1,"type":"2","name":"E","ctl":"","ctlid":"","myNode":"","eleId":"","eleNode":"","param":[],"pins":[{"pin":"","node":""},{"pin":"","node":""}]};
      continue;
    }
    
    if(vts[i].msrtype == 1){// 节点电压 不显示
      thupE[vts[i].value]={"id":vts[i].id>>0,"draw":0,"type":"1","name":"pE","ctl":"","ctlid":"","myNode":"","eleNode":"","param":[],"pins":[{"pin":"","node":""},{"pin":"","node":0}]};
      continue;
    }
    if(vts[i].msrtype == 11){// 节点电压 显示
      thupE[vts[i].value]={"id":vts[i].id>>0,"draw":1,"type":"1","name":"pE","ctl":"","ctlid":"","myNode":"","eleNode":"","param":[],"pins":[{"pin":"","node":""},{"pin":"","node":0}]};
      continue;
    }
  }
}// function genMsr()

function addCtrlHangNode(){//给悬空的控制系统引脚加节点号
  var nodeN = _pssNodeCtrl.length;//最大节点号
  var i=0,l=nodeN,k=0,j=0;
  var x = ''
  for(x in _pssCtrl){
    if(!_pssCtrl[x]['pin']) continue;
    k = thuCtrl[x]['pin'].length;
    j=0;
    for(j;j<k;j++){
      //~ console.log('node is',thuCtrl[x]['pins'][j]['node'] ,Math.random());
      if(_pssCtrl[x]['pin'][j]['node']>>0 == -1){

        _pssCtrl[x]['pin'][j]['node'] = nodeN;
        nodeN++;
        //~ console.log('nodeN++',nodeN++)
      }
    }
  }
}







