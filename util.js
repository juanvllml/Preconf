/*****LEER PUERTOS*****/
let fetchports = async (nodo) => {
	//let nodo = $("#selectpe option:selected").text();
	let e = {nodo:nodo, comando:["show interfaces description | inc 8021Q"]}
	let x = await cmdgeneric(e);
	console.log("PORTS");
	console.log(x);
	let linea = x.split('\n');
	let interfaces = [];
	//let descripciones = [];
	for (let i=0; i<linea.length;i++){					
		if (linea[i].toString().startsWith("Gi") || linea[i].toString().startsWith("Fa") || linea[i].toString().startsWith("Te")){
			interfaces.push(linea[i].toString().substring(0,linea[i].toString().indexOf(' ')));					
			global_descripciones.push(linea[i].toString().substring(linea[i].toString().indexOf('TRUNK'),linea[i].toString().length));
		}
	}
	return interfaces;
	//return {interfaces,descripciones};
}

async function printports(pe,out) {			
	let nodo = $(`#${pe} option:selected`).text();
	let interfaces = await fetchports(nodo);
	console.log("Interfaces");
	console.log(interfaces);
	let seleccionado = '<option value="0" selected>Seleccione...</option>';
	let html = interfaces.map(function(elem,index){					
		return(`<option value="${index+1}">${elem}</option>`)
	}).join(" ");
	//document.getElementById('selectinterfazf').innerHTML = seleccionado+html;
	document.getElementById(out).innerHTML = seleccionado+html;
}
/*****FIN LEER PUERTOS*****/



/*****LEER VLAN*****/

let fetchvlan = async (nodo, interfaz) => {
	let e = {nodo:nodo, comando:[`show interface brief | inc ${interfaz}.'[0-9]\{1,4\}' | exclude ${interfaz}.'[0-9]\{5\}'`,`show interface brief | inc ${interfaz}.'[0-9]\{5\}'`]};
	let x = await cmdgeneric(e);
	console.log("VLANS");
	console.log(x);
	
	let vlans = [];
	let vlansqinq = [];
	
	if (x.length > 0){
		let nodotemp = nodo.replace(/_|-/g,'');
		let lineanodo = x.split(`${nodotemp}#`); //ARRAY				
		//console.log("LINEA NODO");
		//console.log(lineanodo);				
		lineanodo.forEach(async (lineanodoelem,i) => {					
			//FOR VLAN
			if (lineanodoelem.trim().toString().indexOf("exclude") > -1){
				let sublinea = lineanodoelem.split('\n'); //ARRAY						
				sublinea.forEach(async (sublineaelem,j) => {							
					if (sublineaelem.toString().trim().startsWith("Gi") || sublineaelem.toString().trim().startsWith("Fa") || sublineaelem.toString().trim().startsWith("Te")){
						vlans.push(Number(sublineaelem.toString().trim().substring(sublineaelem.toString().trim().indexOf(".")+1,sublineaelem.toString().trim().indexOf(" "))));
					}
				});
			}
			//FOR VLAN QinQ
			if (lineanodoelem.trim().toString().indexOf("exclude") === -1){
				let sublinea2 = lineanodoelem.split('\n'); //ARRAY						
				sublinea2.forEach(async (sublineaelem,j) => {							
					if (sublineaelem.toString().trim().startsWith("Gi") || sublineaelem.toString().trim().startsWith("Fa") || sublineaelem.toString().trim().startsWith("Te")){
						vlansqinq.push(Number(sublineaelem.toString().trim().substring(sublineaelem.toString().trim().indexOf(".")+1,sublineaelem.toString().trim().indexOf(" "))));
					}
				});
			}
		});
	}
	return {vlans,vlansqinq}
	//return vlans;
}

let vlandisp = async (vlans) => {
	let min = 2 , max = 4094;
	let newvlans = [];
	if (vlans.length > 0){			
		for(let i=min; i<=max; i++) {
		  if(vlans.indexOf(i) === -1){
		    newvlans.push(i);
		  }
		}	
	}
	return newvlans;
}

async function printvlan(pe, int, vlandom, vlanqinqdom) {
	let nodo = $(`#${pe} option:selected`).text();
	let interfaz = $(`#${int} option:selected`).text();

	let { vlans , vlansqinq } = await fetchvlan(nodo, interfaz);
	//let vlans = await fetchvlan(nodo, interfaz);
	console.log("PRINTVLAN");
	console.log(vlans);
	let newvlans = await vlandisp(vlans);
	let seleccionado = '<option value="0" selected>Seleccione...</option>';
	//FILL VLAN
	let html = newvlans.map(function(elem,index){					
		return(`<option value="${index+1}">${elem}</option>`)
	}).join(" ");
	document.getElementById(vlandom).innerHTML = seleccionado+html;
	//FILL VLANQinQ
	let html2 = vlansqinq.map(function(elem,index){					
		return(`<option value="${index+1}">${elem}</option>`)
	}).join(" ");
	document.getElementById(vlanqinqdom).innerHTML = seleccionado+html2;
}

/*****FIN LEER VLAN*****/


let alertespere = () =>{
	swal({
    title: "Consultando",
    text: "Por favor espere...",
    position: "center",
    //backdrop: "linear-gradient(yellow, orange)",
    //background: "white",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    showCancelButton: false,
    //timer: 3000,
    onOpen: () => {
			swal.showLoading()
		}
  });
}

/***** CMD GENERIC *****/
async function cmdgeneric(inputdata) {			
	let result;
	alertespere();
	/*let startTime, interval;
	var cuenta;			
	start();
	function start(){
	  startTime = Date.now();
	  interval = setInterval(function(){
	  	cuenta = Date.now() - startTime;
	    $('.sweet-alert > p').text('Por favor espere...', cuenta);
	  });
	}*/	
	try {
    result = await $.ajax({
		type: 'POST',
		url: '/ejecutar/send',	      	
		data: JSON.stringify(inputdata),
		contentType: "application/json; charset=utf-8",		      
		success: function (data,status) {	        
      console.log("Ajax success!");
      swal.close();	        
		},
    error: function (data,status,err){
      console.log("Ajax error :(");
      swal.close();	        
    },
    complete: function(){
    	console.log("Ajax complete!");
    }
  });
  return result;
  } catch (error) {
    console.error(error);
    swal({
			  type: 'error',
			  title: 'Error',
			  text: 'Ha ocurrido un error'						  
		})
  }
}


/***** EJECUTAR COMANDOS EN EL SERVIDOR *****/
//https://petetasker.com/using-async-await-jquerys-ajax/
async function exec_cmd(inputdata,idnodo) {
	//console.log(inputdata);
	let result;
	$("#nodo"+idnodo).removeClass('alert-dark').addClass('alert-warning');
	$("#spinner"+idnodo).removeClass('spinnerhidden');

	//$(divnodo)[0].scrollIntoView(true);
	//$(divnodo)[0].scrollIntoView({block: "end", behavior: "smooth"});
	//$(divnodo)[0].scrollIntoView({block: "center", behavior: "smooth", inline: "center"});    	
	$("#nodo"+idnodo)[0].scrollIntoView({block: "center", behavior: "smooth", inline: "center"});
  try {
      result = await $.ajax({
    		type: 'POST',
    		url: '/ejecutar/send',	      	
    		data: JSON.stringify(inputdata),
    		contentType: "application/json; charset=utf-8",		      
    		success: function (data,status) {
	        //console.log(data);
	        console.log("Ajax success!");
	        //$(divnodo).removeClass('alert-warning').addClass('alert-success');
	        //$("#nodo"+idnodo).removeClass('alert-warning').addClass('alert-success');
	        $("#nodo"+idnodo).removeClass('alert-warning alert-danger').addClass('alert-success');
	        $("#spinner"+idnodo).addClass('spinnerhidden');
    		},
	      error: function (data,status,err){
	        console.log("Ajax error :(");
	        //$(divnodo).removeClass('alert-warning').addClass('alert-danger');
	        $("#nodo"+idnodo).removeClass('alert-warning').addClass('alert-danger');
	        $("#spinner"+idnodo).addClass('spinnerhidden');
	        //console.log(data);		        	
	      },
	      complete: function(){
	      	console.log("Ajax complete!");	      	
	      }
	    });
      return result;
  } catch (error) {
      console.error(error);
      //console.error(error.responseText);
      if (error.responseText){
      	//alert(error.responseText);

      	swal({
				  type: 'error',
				  title: 'Error',
				  text: error.responseText						  
				})

      }else{
      	//alert("Ha ocurrido un error");
      	swal({
				  type: 'error',
				  title: 'Error',
				  text: 'Ha ocurrido un error'						  
				})
      }	        
  }
}

/***** ENVIAR PARAMETROS(USUARIO) Y RECIBIR COMANDOS Y PRUEBAS *****/
async function juan(input,endpoint) {
	//console.log(inputdata);
	let result;
  try {
    result = await $.ajax({
  		type: 'POST',
  		//url: '/ejecutar/postjuan',
  		url: `/ejecutar/${endpoint}`,
  		data: JSON.stringify(input),
  		contentType: "application/json; charset=utf-8",		      
  		success: function (data,status) {
        //console.log(data);
        console.log("Ajax success!")
  		},
      error: function (data,status,err){
        console.log("Ajax error :(");		        
      },
      complete: function(){
      	console.log("Ajax complete!");	      	
      }
    });
    return result;
  } catch (error) {
    console.error(error);
  }
}





/************** PYMES ******************/


/*****LEER PUERTOS*****/
async function pymesprintports(pe,out,comando,descripcion) {			
	let nodo = $(`#${pe} option:selected`).text();
	let interfaces = await pymesfetchports(nodo,comando,descripcion);
	console.log("Interfaces");
	console.log(interfaces);
	if (interfaces.length <= 0){
		interfaces = await pymesfetchports(nodo,comando,descripcion);
		console.log("PYMES FETCH PORTS RETRY");
		console.log(interfaces);
	}
	let seleccionado = '<option value="0" selected>Seleccione...</option>';
	let html = interfaces.map(function(elem,index){					
		return(`<option value="${index+1}">${elem}</option>`)
	}).join(" ");
	//document.getElementById('selectinterfazf').innerHTML = seleccionado+html;
	document.getElementById(out).innerHTML = seleccionado+html;
}
let pymesfetchports = async (nodo,comando,descripcion) => {	
	let e = {nodo:nodo, comando:comando}
	let x = await cmdgeneric(e);
	console.log("PYMES PORTS");
	console.log(x);
	if (x.length <= 0){
		x = await cmdgeneric(e);
		console.log("PYMES PORTS RETRY");
		console.log(x);
	}
	let linea = x.split('\n');
	let interfaces = [];
	//let descripciones = [];
	for (let i=0; i<linea.length;i++){					
		if (linea[i].toString().startsWith("Gi") || linea[i].toString().startsWith("Fa") || linea[i].toString().startsWith("Te")){
			interfaces.push(linea[i].toString().substring(0,linea[i].toString().indexOf(' ')));					
			//global_pymesdescripciones.push(linea[i].toString().substring(linea[i].toString().indexOf('TRUNK'),linea[i].toString().length));
			descripcion.push(linea[i].toString().substring(linea[i].toString().indexOf('TRUNK'),linea[i].toString().length));
		}
	}
	return interfaces;
	//return {interfaces,descripciones};
}
/*****FIN LEER PUERTOS*****/


/***** CMD ZTE *****/
async function cmdzte(inputdata) {			
	let result;
	alertespere();	
	try {
    result = await $.ajax({
		type: 'POST',
		url: '/ejecutarz/send',	      	
		data: JSON.stringify(inputdata),
		contentType: "application/json; charset=utf-8",		      
		success: function (data,status) {	        
      console.log("Ajax success!");
      swal.close();	        
		},
    error: function (data,status,err){
      console.log("Ajax error :(");
      swal.close();	        
    },
    complete: function(){
    	console.log("Ajax complete!");
    }
  });
  return result;
  } catch (error) {
    console.error(error);
    swal({
			  type: 'error',
			  title: 'Error',
			  text: 'Ha ocurrido un error'						  
		})
  }
}

async function exec_cmdzte(inputdata,idnodo) {
	let result;
	$("#nodo"+idnodo).removeClass('alert-dark').addClass('alert-warning');
	$("#spinner"+idnodo).removeClass('spinnerhidden');
	
	//try{
		$("#nodo"+idnodo)[0].scrollIntoView({block: "center", behavior: "smooth", inline: "center"});
	//	}
  try {
      result = await $.ajax({
    		type: 'POST',
    		url: '/ejecutarz/send',	      	
    		data: JSON.stringify(inputdata),
    		contentType: "application/json; charset=utf-8",		      
    		success: function (data,status) {	        
	        console.log("Ajax success!");	        
	        $("#nodo"+idnodo).removeClass('alert-warning alert-danger').addClass('alert-success');
	        $("#spinner"+idnodo).addClass('spinnerhidden');
    		},
	      error: function (data,status,err){
	        console.log("Ajax error :(");	        
	        $("#nodo"+idnodo).removeClass('alert-warning').addClass('alert-danger');
	        $("#spinner"+idnodo).addClass('spinnerhidden');	        	
	      },
	      complete: function(){
	      	console.log("Ajax complete!");	      	
	      }
	    });
      return result;
  } catch (error) {
      console.error(error);
      if (error.responseText){
      	swal({
				  type: 'error',
				  title: 'Error',
				  text: error.responseText						  
				})

      }else{
      	swal({
				  type: 'error',
				  title: 'Error',
				  text: 'Ha ocurrido un error'						  
				})
      }	        
  }
}