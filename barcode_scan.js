/*module required*/
var net = require("net");
var fs = require("fs");
var constants = require("constants");
var gui = require("gui");

//var timer = require("timers");
//var emitter = require("events").EventEmitter;

var port = 5500;
var socket = new net.Socket();
var barcode = "";
var scan_start = 1;
var scan_stop = 2;
var status = false;
var pageindex = 1;

/*key code*/
var BARCODE_LENGTH = 3;
var ESC = 1;
var OK = 59;
var ALPHA = 66;
var BACKSPACE = 14;

var result = socket.connect(port,"127.0.0.1");

var date = new Date();
var today = date.toLocaleDateString();
console.log(today);
var fd = fs.openSync("/datafs/data/"+today+".dat","a");

function Button(hdc,x0,x1,y0,y1){
	this.x0 = x0;
	this.x1 = x1;
}


socket.on("data",function(data){
	//var length = new Buffer(1);
	//if(data.toString() == "end")
	//	socket.end();
	if(status)
		return;
    var hdc = gui.getclientdc();
	gui.fillbox(hdc,20,30,139,20);
	gui.textout(hdc,20,30,data.toString());
	gui.releasedc(hdc);
	//emitter.emit('paint');
	//console.log(data.toString());

	var buf_len = new Buffer(BARCODE_LENGTH);
	var length = data.length;
	buf_len.write(length.toString());

	fs.writeSync(fd,buf_len,0,BARCODE_LENGTH,null);
    fs.writeSync(fd,data,0,length,null);
    
   /* timer.setTimeout(function(){
    	var hdc = gui.getclientdc();      
        //gui.drawtext(hdc,20,30,159,50,data.toString(),gui.drawtext.DT_LEFT | gui.drawtext.DT_WORDBREAK);
        gui.releasedc(hdc);
    },200);  */

});

socket.on("end",function(){
	
})

gui.on('onPaint',function(hdc){
	//gui.lineto(hdc,10,10);
	//gui.circle(hdc,50,50,10);

	//gui.moveto(hdc,80,80);
	//gui.lineto(hdc,160,160);

    //gui.fillbox(hdc,80,80,20,20);
    //pages.draw[pages.index]();
    switch(pageindex){
    	case 1:
    	  page1();
    	  pageindex = 1;
    	  stack.push(pageindex);
    	  break;
    	case 2:
    	  page2();
    	  pageindex = 2;
    	  stack.push(pageindex);
    	  break;
        
    }
})

gui.on('onKeydown',function(key){
	switch(key){
		case ESC:
		  //socket.write(new Buffer("end"));
		  if(fd != null){
		  	socket.pause();
		  	status = true;
		    //console.log(socket);
		    var buf_end = new Buffer(1);
	        buf_end.write("\n");
	        fs.writeSync(fd,buf_end,0,1,null);
	        fs.closeSync(fd);
	        fd = null;
		  }
		  break;

	    case OK:
	      if(fd == null){
	    	  fd = fs.openSync("/datafs/data/"+today+".dat","a");
		      socket.resume();
		      status = false;
	      }
		  break;

		case ALPHA:
		  page2();
		  pageindex = 2;
		  break;

	    case BACKSPACE:
	      pageindex = stack.pop();
	      gui.emit('onPaint');
          break;
	}

})

gui.on('onKeyup',function(key){
	switch(key){
		case ESC:
		  var hdc = gui.getclientdc();
		  gui.textout(hdc, 30, 141, "Status: stop ...");
		  gui.fillbox(hdc,20,30,139,20);
          gui.releasedc(hdc);
          break;
        case OK:
          var hdc = gui.getclientdc();
          gui.textout(hdc,30,141,"Status: start ...");
          gui.releasedc(hdc);
          break;
	}

})

gui.initialize();

function page1(){
    var hdc = gui.getclientdc();

    gui.fillbox(hdc,0,0,159,159);
    
	gui.rectangle(hdc,0,0,159,159);
	gui.rectangle(hdc,0,0,159,20);
	gui.rectangle(hdc,0,139,159,159);

    gui.textout(hdc, 30, 2, "Scan Barcode");
	gui.textout(hdc,30,141,"Status: start ...");
	gui.textout(hdc,2,120,"'esc' to stop,'ok' to start");

    gui.releasedc(hdc);
}

function page2(){
	var hdc = gui.getclientdc();
	gui.fillbox(hdc,0,0,159,159);
	gui.rectangle(hdc,0,0,159,159);

	gui.releasedc(hdc);
}

var stack = {};
stack.pointer = 0;
stack.push = function(data){
	if(pointer<15){
		stack[pointer] = data;
	    pointer++;
	}else{
		console.log('err: stack full~~~~');
	}
}
stack.pop = function(){
	if(pointer>0){
		pointer--;
	    return stack[pointer];
	}else{
		console.log('err: stack empty~~~~');
	}
}
//var pages = {index:1, draw: {page1,page2}};