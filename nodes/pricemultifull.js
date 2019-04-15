var request = require('request');

module.exports = function(RED) {
  "use strict";
  function PriceNode(config) {
    RED.nodes.createNode(this,config);

    this.apiUrl = "https://min-api.cryptocompare.com/data/pricemultifull";

    this.fsyms = config.fsyms;
    this.tsyms = config.tsyms;
    this.e = config.e;
    this.extraParams = config.extraParams;
    this.sign = config.sign;
    this.tryConversion = config.tryConversion;

    var node = this;
    this.on('input', function(msg) {

    	var urlParams = [];

    	// verify params
      // required fields
      // fsyms
    	if(msg.params && msg.params.fsyms){
        urlParams.push("fsyms="+msg.params.fsyms);
      }else{
        if(node.fsyms && node.fsyms!=""){
          urlParams.push("fsyms="+ node.fsyms);
        }else{
    		  var errMsg = "Error: required fsyms parameter is missing";
    		  node.status({
		        fill: 'red',
		        shape: 'ring',
		        text: errMsg
		      });
		      node.error(errMsg, msg);
		      return false;
    		}
      }
      // tsyms
      if(msg.params && msg.params.tsyms){
        urlParams.push("tsyms="+msg.params.tsyms);
      }else{
        if(node.tsyms && node.tsyms!=""){
          urlParams.push("tsyms="+ node.tsyms);
        }else{
          var errMsg = "Error: required tsyms parameter is missing";
          node.status({
            fill: 'red',
            shape: 'ring',
            text: errMsg
          });
          node.error(errMsg, msg);
          return false;
        }
      }
      // optional fields
      // e
      if(msg.params && msg.params.e){
        urlParams.push("e="+msg.params.e);
      }else{
        if(node.e || node.e!=""){
          urlParams.push("e="+ node.e);
        }
      }
      // extraParams
      if(msg.params && msg.params.extraParams){
        urlParams.push("extraParams="+msg.params.extraParams);
      }else{
        if(node.extraParams || node.extraParams!=""){
          urlParams.push("extraParams="+ node.extraParams);
        }
      }
      // sign
      if(msg.params && msg.params.sign){
        urlParams.push("sign="+msg.params.sign);
      }else{
        if(node.sign || node.sign!=""){
          urlParams.push("sign="+ node.sign);
        }
      }
      // tryConversion
      if(msg.params && msg.params.tryConversion){
        urlParams.push("tryConversion="+msg.params.tryConversion);
      }else{
        if(node.tryConversion || node.tryConversion!=""){
          urlParams.push("tryConversion="+ node.tryConversion);
        }
      }

      urlParams = urlParams.join("&");
      console.log("urlParams:"+urlParams);

    	var opts = {
        method: "GET",
        url: this.apiUrl+"?"+urlParams,
        timeout: node.reqTimeout,
        headers: {},
        encoding: null,
      };

  		request(opts, function (error, response, body) {
        node.status({});
        if(error) { 
          node.error(error, msg);
          node.status({
            fill: "red",
            shape: "ring",
            text: error.code
          });
          msg.payload = error.toString() + " : " + url;
          msg.statusCode = error.code;
        } else {
          try { 
          	msg.payload = body.toString('utf8');
          	msg.payload = JSON.parse(msg.payload); 
          } catch(e) { 
          	node.warn(RED._("httpin.errors.json-error")); 
       	  }
          msg.headers = response.headers;
          msg.statusCode = response.statusCode;        
        }
        node.send(msg);
      });

    });
  }
  RED.nodes.registerType("pricemultifull", PriceNode);
}