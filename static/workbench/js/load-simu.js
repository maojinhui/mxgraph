/*
载入仿真功能


*/

function loadSimu(simuid){
    $.get(
        '/editor/loadSimu/?id='+simuid,
        function(re,s,jxhr){
            if( 0 == re.status ){
                setSimuVar(re);
            }else{
                alert(re.msg);
            }
        },'json'
    );
}

function setSimuVar(data){

    var doc = mxUtils.parseXml(data['diagram']);
    var model = new mxGraphModel();
    var codec = new mxCodec(doc);
    codec.decode(doc.documentElement, _graph.getModel());
    _graph.center();
    // 填充仿真数据
    _simuPARAM = data.simuparam
    // 电气元件符号记录列表
     _pssEle=data.component;
     _pssEleCount=data.elecount;
    // 控制元件记录
     _pssCtrl=data.ctrl;
     _pssCtrlCount=data.ctrlcount;
    // 量测元件的记录
     _pssMsr=data.msr;
     _pssMsrCount=data.msrcount;
    // 模块的记录
     _pssMod=data.module;
     _pssModCount=data.modcount;

// 非电气用数据
    _simuProp['name'] = data.name
    _simuProp['folder'] = data.folder
    _simuProp['simuno'] = data.simuno
    _simuProp['desc'] = data.desc
    _simuProp['share'] = data.share
}


