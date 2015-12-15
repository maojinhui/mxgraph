
//生成显示的图形
function genDspShp(){
  if (!mxClient.isBrowserSupported()) {
    mxUtils.error('您的浏览器版本过低，请升级浏览器！', 200, false);
    return;
  }
  //~ var container=document.getElementById('dspgraph')
  var container=document.createElement('div')
        
    mxEvent.disableContextMenu(container);
    dspgraph = new mxGraph(container);
    new mxRubberband(dspgraph);
    var parent = dspgraph.getDefaultParent();

    var inptn = objCount( _IO['input'] );
    var optn = objCount( _IO['output'] );
    var maxH = inptn > optn ? inptn:optn;

//var lpin = Math.ceil(objCount(DSPPIN)/2),rpin=objCount(DSPPIN)-lpin;//左侧和右侧的引脚数量
//var lpin = Math.ceil(DSPPIN.length/2),rpin=DSPPIN.length-lpin;//左侧和右侧的引脚数量

    var h = (2+maxH) *15;//每档高
    var w = 60;
    var i=0,j=0;
    var xx;
    dspgraph.getModel().beginUpdate();
    try{
      /*
      var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
      var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
      var e1 = graph.insertEdge(parent, null, '', v1, v2);
      * */
      var v1 = dspgraph.insertVertex(parent,null,'d',60,0,w,h,'verticalAlign=middle');
          v1.setConnectable(false);
          v1.thutype="mod";
//~ var indel = [],inl=[];
 //~ for( i=0;i<thuInput.length;i++){//
   //~ inl.push(thuInput[i].label);
  //~ //if(Inpts.indexOf(i) >= 0) {Inpts.push(i);}
 //~ }
//~ var oudel = [],oul=[];
//~ for( i=0;i<thuOutput.length;i++){//right side
  //~ oul.push(thuOutput[i].label);
  //~ //if(Oupt.indexOf(i) >= 0) {Oupt.push(i);}
//~ }
//~ inl = inl.unique();
//~ oul = oul.unique();
//~ 
//~ 
//~ console.log('..................inpts',Inpts);
//~ for( i=0;i<Inpts.length;i++){
  //~ thuInput.splice(Inpts[i],1);
//~ }
//~ for( i=0;i<Oupt.length;i++){
  //~ thuOutput.splice(Oupt[i],1);
//~ }
        var j =1,i=1;
      //~ for( i=0;i<inptn;i++,j++){//left side
      for(var x in _IO['input'] ){
          //~ var v11 = dspgraph.insertVertex(v1,null,'in-'+j,0,1,30,1,"shape=line;align=left;verticalAlign=middle;fontSize=10;spacingBottom=20;fontColor=green")
          var v11 = dspgraph.insertVertex(v1,null,x,0,1,30,1,"shape=line;align=left;verticalAlign=middle;fontSize=10;spacingBottom=20;fontColor=green");i++;
            v11.geometry.relative = true;
            v11.pintype='modin';
            v11.cmp1='';// 'ele' or 'ctrl'
            v11.geometry.offset = new mxPoint(-v11.geometry.width,-30*i-20);
            //v11.geometry.offset = new mxPoint(0, -v11.geometry.height);
          v11 = null;
          console.log('draw left');
      }
      //~ for( i=0,j=1;i<optn;i++,j++){//right side
      i=1;
      for( var x in _IO['output'] ){//right side
          //~ var v11 = dspgraph.insertVertex(v1,null,'out-'+j,0,1,30,1,"shape=line;align=left;verticalAlign=middle;fontSize=10;spacingBottom=20;fontColor=green")
          var v11 = dspgraph.insertVertex(v1,null,x,0,1,30,1,"shape=line;align=left;verticalAlign=middle;fontSize=10;spacingBottom=20;fontColor=green");i++;
            v11.geometry.relative = true;
            v11.pintype='modout';
            v11.cmp1='';// 'ele' or 'ctrl'
            v11.geometry.offset = new mxPoint(w,-30*i-20);
            //v11.geometry.offset = new mxPoint(0, -v11.geometry.height);
          v11 = null;
          console.log('draw right');
      }
    }
    finally
    {
      dspgraph.getModel().endUpdate();
    }

    var xx = '<?xml version="1.0"?>';
    var encoder = new mxCodec();
    var node = encoder.encode(dspgraph.getModel());
    var xml = mxUtils.getXml(node);
    //~ console.log('显示的图形：');
    //~ console.log(xml)
    return xml;

//~ modDspShp=xml;



}//function genDspShp

function genDSPPIN(){

  for(var x in thuInput){


  }
  return;
  //产生有标记的连接点: {"A":12,"B":65}
  var es = graph.getChildVertices();
  var i=0,j=0,l=es.length;
  var eslb=[]
  for(i;i<l;i++){
    for(j=0;j<es[i].children.length;j++)
      if(es[i].children[j].connectable == true && es[i].children[j].value != '' ){//被人为标了名字的连接点
        //{'label':1,'lable2':id}
        //if(eslb[es[i].children[j].value] == undefined){
          //eslb[es[i].children[j].value] = es[i].children[j].id;
          eslb.push({'label':es[i].children[j].value,'id':es[i].children[j].id})
         // eslb[es[i].children[j].value].push(es[i].children[j].id)
        //}
        //else
        //  eslb[es[i].children[j].value].push(es[i].children[j].id)
      }
  }
  DSPPIN = eslb;
}
