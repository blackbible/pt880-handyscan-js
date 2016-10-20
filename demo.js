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
var result = socket.connect(port,"127.0.0.1");
var barcode = "";
var scan_start = 1;
var scan_stop = 2;
var status = false;
var BUTTONNUM = 1;

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
var ENTER = 28;

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
	switch(pageindex){
		case 1:
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

		    /*case ALPHA:
		    if(pageindex != 2){
		    	page2();
		        pagestack.push(2);
		        pageindex = 2;
		    }
		   // pageindex = 2;
		    break; */

	        case BACKSPACE:
	        {
	        	if(pagestack.length > 1){
	        		pagestack.pop();
	        	}
	        	gui.emit('onPaint');
            	break;
	        }
	        

            //case UP:
            case LEFT:
            {
            	if(buttonnum > 0)
            		buttonnum--;
            	var hdc = gui.getclientdc();
            	if(buttonnum > 0){
            		gui.selectbutton(hdc);
            	}else{
            		console.log("left button select");
            		for(var i =1; i<=BUTTONNUM; i++){
            	        var x0 = buttonstack[i].x0;
            	        var y0 = buttonstack[i].y0;
            	        var x1 = buttonstack[i].x1;
            	        var y1 = buttonstack[i].y1;
            	    	gui.fillbox(hdc,x0,y0-15,x1-x0,y1-y0-5);       
            		}
            		console.log("left button select end");
            	}
            	gui.releasedc(hdc);
            	break;
            }

            //case DOWN:
            case RIGHT:
            {
            	if(buttonnum < BUTTONNUM)
            		buttonnum++;
                var hdc = gui.getclientdc();
                gui.selectbutton(hdc,x0,y0,x1,y1);
            	gui.releasedc(hdc);
            	break;
            }

            case ENTER:
            {
            	if(buttonnum == 1){
            		if(pageindex != 2){
		    			page2();
		        		pagestack.push(2);
		        		pageindex = 2;
		    		}
            	}
            	break;
            }
          }
    	break;

    	case 2:
    		switch(key){
    			case BACKSPACE:
	        	{
	        		if(pagestack.length > 1){
	        			pagestack.pop();
	        		}
	        		gui.emit('onPaint');
            		break;
	        	}
	        	case UP:
	        	{
	        		if(page2_itemnum > 0){
	        			page2_itemnum--;
	        			var hdc = gui.getclientdc();
	        			gui.page2_select_item(hdc);
	        			gui.releasedc(hdc);
	        		}
	        		break;
	        	}
	        	case DOWN:
	        	{
	        		if(page2_itemnum <= PAGE2_ITEM_NUM){
	        			page2_itemnum++;
	        			var hdc = gui.getclientdc();
	        			gui.page2_select_item(hdc);
	        			gui.releasedc(hdc);
	        		}
	        		break;
	        	}
    		}
    		break;

	}
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
	gui.selectbutton(hdc);

    gui.drawtext(hdc,0,1,159,20,"- - - Scan Barcode - - -",gui.drawtext.DT_CENTER);
	gui.textout(hdc,30,141,"Status: start ...");
	gui.textout(hdc,2,120,"'esc' to stop,'ok' to start");

    gui.releasedc(hdc);
}

/* page1 Button */
gui.button = function Button(hdc,x0,y0,x1,y1,str){
	gui.rectangle(hdc,x0,y0,x1,y1);
	gui.drawtext(hdc,x0,y0+2,x1,y1,str,gui.drawtext.DT_CENTER);
}
var buttonstack = new Array();
buttonstack[1] = {x0:10,y0:90,x1:74,y1:110};
var buttonnum = 0;

/* selected button*/
gui.selectbutton = function(hdc/*,x0,y0,x1,y1*/){
	for(var i =1; i<=BUTTONNUM; i++){
        var x0 = buttonstack[i].x0;
        var y0 = buttonstack[i].y0;
        var x1 = buttonstack[i].x1;
        var y1 = buttonstack[i].y1;
        if(i == buttonnum){
            gui.drawtext(hdc,x0,y0-15,x1,y1-20,"***",gui.drawtext.DT_CENTER);
        }else{
			gui.fillbox(hdc,x0,y0-15,x1-x0,y1-y0-5);
        }
    }
}

/*gui page2*/
function page2(){
	var hdc = gui.getclientdc();
	gui.fillbox(hdc,0,0,159,159);
	gui.rectangle(hdc,0,0,159,159);
	gui.rectangle(hdc,0,0,159,20);
	gui.rectangle(hdc,0,20,159,40);
	gui.rectangle(hdc,0,40,159,60);
	gui.rectangle(hdc,0,60,159,80);
	gui.rectangle(hdc,0,80,159,100);
	gui.drawtext(hdc,0,1,159,20,"- - - Function - - -",gui.drawtext.DT_CENTER);
	gui.drawtext(hdc,0,21,159,40,"1.show data",gui.drawtext.DT_CENTER);
	gui.drawtext(hdc,0,41,159,60,"2.format set",gui.drawtext.DT_CENTER);

	gui.releasedc(hdc);
}

/* page2 Items*/
var page2_item_stack2 = new Array();
var page2_itemnum = 0;
var PAGE2_ITEM_NUM = 2;
page2_item_stack2[1] = {x0:0,y0:21};
page2_item_stack2[2] = {x0:0,y0:41};

/* page2 selected item*/
gui.page2_select_item = function(hdc/*,x0,y0,x1,y1*/){
	for(var i =1; i<=PAGE2_ITEM_NUM; i++){
        var x0 = page2_item_stack2[i].x0;
        var y0 = page2_item_stack2[i].y0;
        //var x1 = page2_item_stack2[i].x1;
        //var y1 = page2_item_stack2[i].y1;
        if(i == page2_itemnum){
            gui.drawtext(hdc,x0+3,y0+2,x1+15,y1+20,">>>",gui.drawtext.DT_LEFT);
        }else{
			gui.fillbox(hdc,x0+3,y0+2,x1-x0+12,y1-y0+18);
        }
    }
}

/* gui page3*/
function page3(){
	var hdc = gui.getclientdc()

	gui.releasedc(hdc);
}