/*
简易窗口管理器
本文件在最后载入

*/

function bindWndEvt(){
// 循环对各窗口进行事件绑定
for( var x in _wndList ){
    //~ console.log(x,_wndList[x]);
    _wndList[x].addListener(mxEvent.MOVE_END, function(e){
        
      //_wndEleParam.setLocation(Math.max(0, wnd.getX()), Math.max(0, wnd.getY()));
    //~ console.log(this,getX(),this.getY());return;
    if( this.getX() < 0 && this.getY() > 20){ //左侧
        
        for( var x in _wndList ){
            if( _wndList[x].dir == 1 )
        }
        _WIN.wl++;
        this.setSize(125,_WIN.height-40);
        this.setLocation(125*(_WIN.wl-1),40);
        this.dir=1;
        return;
    }
    if( this.getX() > _WIN.width-160 && this.getY() > 40){ //右侧
        _WIN.wr++;
        this.setSize(125,_WIN.height-40);
        this.setLocation( _WIN.width-_WIN.wr*125, 40);
        return;
    }
    if( this.getY() < 40){ //上侧
        _WIN.wt++;
        this.setSize(_WIN.width,160);
        this.setLocation( 0, (_WIN.wt-1)*160 );
        return;
    }
    if( this.getY() > _WIN.height-30){ //下侧
        _WIN.wb++;
        this.setSize(_WIN.width,160);
        this.setLocation(0,_WIN.height-_WIN.wb*160 );
        return;
    }

//默认情况复原
    //~ if( this.getY() > )
    {
            //~ this.activate();
            this.setSize(this.w,this.h);
            this.dir=0;
            //~ this.setLocation( (_WIN.width-this.w)*0.5,_WIN.height*0.5);
            this.setLocation( this.getX() , this.getY() );
            //将全部的停靠位置计数减一
                _WIN.wl--;
                _WIN.wr--;
                _WIN.wt--;
                _WIN.wb--;
                _WIN.wl= _WIN.wl<0?0:_WIN.wl;
                _WIN.wr= _WIN.wr<0?0:_WIN.wr;
                _WIN.wt= _WIN.wt<0?0:_WIN.wt;
                _WIN.wb= _WIN.wb<0?0:_WIN.wb;
    }

    });
};

}
