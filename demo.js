/*module required*/
var net = require("net");
var fs = require("fs");
var constants = require("constants");
var gui = require("gui");
var assert = require("assert");

//var timer = require("timers");
//var emitter = require("events").EventEmitter;

var port = 5500;
var socket = new net.Socket();
var barcode = "";
var scan_start = 1;
var scan_stop = 2;
var status = false;

/* pagestack */
var pagestack = new Array();
var pageindex = 1;
pagestack.push(pageindex);
console.log("push success");

/*key code*/
var BARCODE_LENGTH = 3;
var ESC = 1;
var OK = 59;
var ALPHA = 66;
var BACKSPACE = 14;
var UP = 103;
var DOWM = 108;
var LEFT = 105;
var RIGHT = 106;

var result = socket.connect(port,"127.0.0.1");

var date = new Date();
var today = date.toLocaleDateString();
console.log(today);
var fd = fs.openSync("/datafs/data/"+today+".dat","a");

socket.on("data",function(data){
	//var length = new Buffer(1);
	//if(data.toString() == "end")
	//	socket.end();
	if(status)
		return;
    var hdc = gui.getclientdc();
	gui.fillbox(hdc,1,30,149,20);
	gui.drawtext(hdc,1,30,159,50,data.toString(),gui.drawtext.DT_CENTER);
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

})

socket.on("end",function(){
	
})

gui.on('onPaint',function(hdc){

    pageindex = pagestack[pagestack.length-1];
    console.log(pageindex);
    switch(pageindex){
    	case 1:
    	  page1();
    	  //pagestack.push(1);
    	  break;
    	case 2:
    	  page2();
    	  //pagestack.push(2);
    	  break;
        
    }
})

gui.on('onKeydown',function(key){
	//switch(pageindex){
		//case 1:
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

	            var hdc = gui.getclientdc();
		        gui.textout(hdc, 30, 141, "Status: stop ...");
		        gui.fillbox(hdc,1,30,149,20);
                gui.releasedc(hdc);
		    }
		    break;

	        case OK:
	        if(fd == null){
	    	    fd = fs.openSync("/datafs/data/"+today+".dat","a");
		        socket.resume();
		        status = false;

		        var hdc = gui.getclientdc();
                gui.textout(hdc,30,141,"Status: start ...");
                gui.releasedc(hdc);
	        }
		    break;

		    case ALPHA:
		    if(pageindex != 2){
		    	page2();
		        pagestack.push(2);
		        pageindex = 2;
		    }
		   // pageindex = 2;
		    break;

	        case BACKSPACE:
	        if(pagestack.length > 1){
	        	pagestack.pop();
	        }
	        gui.emit('onPaint');
            break;

            case UP:
            case LEFT:


            case DOWN:
            case RIGHT:
            
          }
       // break;
	//}
})

gui.on('onKeyup',function(key){

})

gui.initialize();

/* gui page1*/
function page1(){
    var hdc = gui.getclientdc();

    gui.fillbox(hdc,0,0,159,159);
    
	gui.rectangle(hdc,0,0,159,159);
	gui.rectangle(hdc,0,0,159,20);
	gui.rectangle(hdc,0,139,159,159);
	gui.button(hdc,10,90,74,110,"Function");

    gui.textout(hdc, 30, 2, "Scan Barcode");
	gui.textout(hdc,30,141,"Status: start ...");
	gui.textout(hdc,2,120,"'esc' to stop,'ok' to start");

    gui.releasedc(hdc);
}

/*gui page2*/
function page2(){
	var hdc = gui.getclientdc();
	gui.fillbox(hdc,0,0,159,159);
	gui.rectangle(hdc,0,0,159,159);

	gui.releasedc(hdc);
}

/* Button */
gui.button = function Button(hdc,x0,y0,x1,y1,str){
	gui.rectangle(hdc,x0,y0,x1,y1);
	gui.drawtext(hdc,x0,y0+2,x1,y1,str,gui.drawtext.DT_CENTER);
}
var buttonstack = new Array();
var buttonnum = 1;

/* selected button*/
gui.selectbutton = function(hdc,x0,y0,x1,y1){
	gui.moveto(hdc,x0,y0);
	gui.lineto(hdc,x1,y1);
	gui.moveto(hdc,x0,y1);
	gui.lineto(hdc,x1,y0);
}
