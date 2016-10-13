
var net = require("net");
var fs = require("fs");
var constants = require("constants");
var gui = require("gui");
var timer = require("timers");
var emitter = require("events").EventEmitter;

var port = 5500;
var socket = new net.Socket();
var barcode = "";
var scan_start = 1;
var scan_stop = 2;
var status = false;
//var COUNTS = 5;
//var index = 0;
var BARCODE_LENGTH = 3;
var ESC = 1;
var OK = 59;

//console.log(socket);
var result = socket.connect(port,"127.0.0.1");
//console.log(result);

var fd = fs.openSync("/datafs/barcode.dat","a");

//console.log("data file has opened~~");
//console.log("waiting scan barcode ...");

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
	//gui.setetpixelrgb(hdc,0,0,4);
	//gui.lineto(hdc,10,10);
	gui.rectangle(hdc,0,0,159,159);
	gui.rectangle(hdc,0,0,159,20);
	gui.rectangle(hdc,0,139,159,159);
	//gui.circle(hdc,50,50,10);
	gui.textout(hdc, 30, 2, "Scan Barcode");
	gui.textout(hdc,30,141,"Status: start ...");
	gui.textout(hdc,2,120,"'esc' to stop,'ok' to start");

	//var rgb = {r:0,g:0,b:0};
    //gui.setpixelrgb(hdc,80,80,rgb);
	//gui.moveto(hdc,80,80);
	//gui.lineto(hdc,160,160);

    //console.log(rgb.r);
    //console.log(rgb.g);
    //console.log(rgb.b);
    //gui.fillbox(hdc,80,80,20,20);

	gui.releasedc(hdc);
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
	    	  fd = fs.openSync("/datafs/barcode.dat","a");
		      socket.resume();
		      status = false;
	      }
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

