/* Copyright 2015 Samsung Electronics Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var assert = require('assert');
var gui = require('gui');

gui.on('onCreate', function() {
  console.log("Hi to onCreate ~");
});

gui.on('onPaint', function(hdc) {
  console.log('Hi to onPaint ~');
//  gui.textout(hdc, 0, 0, "iotjs for test!!!");
  gui.drawtext(hdc, 0, 0, 200, 200, "iotjs for test!!!",
  gui.drawtext.DT_LEFT | gui.drawtext.DT_WORDBREAK);
});

gui.on('onKeydown', function(key) {
	var hdc = gui.getclientdc();
	switch(key){
		case 62: 
       // var hdc = gui.getclientdc();
       // gui.textout(hdc,40,40,"Scan");
       // gui.releasedc(hdc);
        gui.textout(hdc,40,40,"Scan");
		//console.log("Scan");
		break;
		
		case 1:
		gui.textout(hdc,40,40,"ESC");
		break;
        
        case 59:
        gui.textout(hdc,40,40,"ok");
        break;

        case 103:
        gui.textout(hdc,40,40,"up");
        break;

        case 108:
        gui.textout(hdc,40,40,"down");
        break;

        case 105:
        gui.textout(hdc,40,40,"left");
        break;

        case 106:
        gui.textout(hdc,40,40,"right");
        break;

        case 8:
        gui.textout(hdc,40,40,"7");
        break;

        case 9:
        gui.textout(hdc,40,40,"8");
        break;

        case 10:
        gui.textout(hdc,40,40,"9");
        break;

        case 5:
        gui.textout(hdc,40,40,"4");
        break;

        case 6:
        gui.textout(hdc,40,40,"5");
        break;

        case 7:
        gui.textout(hdc,40,40,"6");
        break;

        case 2:
        gui.textout(hdc,40,40,"1");
        break;

        case 3:
        gui.textout(hdc,40,40,"2");
        break;
        
        case 4:
        gui.textout(hdc,40,40,"3");
        break;

        case 11:
        gui.textout(hdc,40,40,"0");
        break;

        case 28:
        gui.textout(hdc,40,40,"ENTER");
        break;

        case 14:
        console.log("Backspace");
        break;

        case 57:
        console.log("Space");
        break;

        case 88:
        console.log("Shift");
        break;

        case 60:
        console.log("Func");
        break;

        case 66:
        console.log("Alpha");
        break;

        case 68:
        console.log("Power");
        break;

		default:
		console.log(key);

	}
  
});

gui.on('onKeyup', function(key) {
	switch(key){
		case 62: 
		console.log("Scan");
		break;
		
		case 1:
		console.log("Esc");
		break;
        
        case 59:
        console.log("OK");
        break;

        case 103:
        console.log("up");
        break;

        case 108:
        console.log("down");
        break;

        case 105:
        console.log("left");
        break;

        case 106:
        console.log("right");
        break;

        case 8:
        console.log("7");
        break;

        case 9:
        console.log("8");
        break;

        case 10:
        console.log("9");
        break;

        case 5:
        console.log("4");
        break;

        case 6:
        console.log("5");
        break;

        case 7:
        console.log("6");
        break;

        case 2:
        console.log("1");
        break;

        case 3:
        console.log("2");
        break;
        
        case 4:
        console.log("3");
        break;

        case 11:
        console.log("0");
        break;

        case 28:
        console.log("Enter");
        break;

        case 14:
        console.log("Backspace");
        break;

        case 57:
        console.log("Space");
        break;

        case 88:
        console.log("Shift");
        break;

        case 60:
        console.log("Func");
        break;

        case 66:
        console.log("Alpha");
        break;

        case 68:
        console.log("Power");
        break;

		default:
		console.log(key);

	}
});

gui.initialize();
