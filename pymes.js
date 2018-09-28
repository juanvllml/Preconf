//PYMES CONFIGURAR ENRUTAMIENTO SOBRE PROTOCOLO EXISTENTE
let pymesprueba1 = async () => {
	let datos = {};			
	datos.pe = $("#pymes_selpe_chk1 option:selected").text();
	
	//PYMES INTERNET
	if (($("#selecttiposervicio").val() == 3) || ($("#selecttiposervicio").val() == 5)){
		datos.subinterfaz = $("#pymes_selsubinterfaz_chk1 option:selected").text();
		datos.ipwan = $("#pymes_selipwan_chk1 option:selected").text();
		datos.maskwan = $("#pymes_maskwan_chk1").val();
		datos.iplan0 = $('#pymes_iplan0_chk1').val();
		datos.iplan1 = $('#pymes_iplan1_chk1').val();
		datos.iplan2 = $('#pymes_iplan2_chk1').val();
		datos.iplan3 = $('#pymes_iplan3_chk1').val();
		datos.mask0 = $('#pymes_masklan0_chk1').val();
		datos.mask1 = $('#pymes_masklan1_chk1').val();
		datos.mask2 = $('#pymes_masklan2_chk1').val();
		datos.mask3 = $('#pymes_masklan3_chk1').val();
		datos.vrf = $("#pymes_vrf_chk1").val();
	}

	//PYMES TELEFONÍA
	if (($("#selecttiposervicio").val() == 4) || ($("#selecttiposervicio").val() == 5)){
		datos.subinterfaztelefonia = $("#pymes_selsubinterfaztelefonia_chk1 option:selected").text();
		datos.ipwantelefonia = $("#pymes_selipwantelefonia_chk1 option:selected").text();
		datos.maskwantelefonia = $("#pymes_maskwantelefonia_chk1").val();
		datos.vrftelefonia = $("#pymes_vrftelefonia_chk1").val();
	}

	datos.tipoenrutamiento = $("#pymes_tipoenrutamiento_chk1 option:selected").text();
	datos.descripcion = $("#pymes_descripcion_chk1").val();			
	datos.titulo = $("#labelchk6").text();
	datos.tiposervicio = $("#selecttiposervicio").val();

	console.log("DATOS PYMES PRUEBA 1");
	console.log(datos);
	let x = await juan(datos,'pymesprueba1');
	console.log("DATA FROM SERVER",x);
	return x;
}

//VIEW PYMES CONFIGURAR ENRUTAMIENTO SOBRE PROTOCOLO EXISTENTE
async function view_pymesprueba1() {
	console.log("PYMES PRUEBA 1")
	limpiarpruebas();			
	let x = await pymesprueba1();			
	$("#titulo1").append('<h3 class="pruebaheader">'+x.titulo+'</h3>');		  
  listadopruebas("#prueba1",x.nodo1,x.comando1,'PYM-A');
  
  if (($("#selecttiposervicio").val() == 3) || ($("#selecttiposervicio").val() == 5)){
	  listadopruebas("#prueba1",x.nodo2,x.comando2,'PYM-B');
		listadopruebas("#prueba1",x.nodo3,x.comando3,'PYM-C');
		//listadopruebas("#prueba1",x.nodo4,x.comando4,'PYM-D');
		//listadopruebas("#prueba1",x.nodo5,x.comando5,'PYM-E');
		listadopruebas("#prueba1",x.nodo6,x.comando6,'PYM-F');
	}
  cajapruebas("#resultadodiv1",1);
  console.log(x);
}


/*PYMES - Configurar enrutamiento sobre protocolo existente */
async function execpymesprueba1(input) {
	console.log("ENTRADA PYMES PRUEBA 1",input);
	let output = "#caja1";
	let texto = '';
	try {	  		
		const ejecuta1 = await exec_cmd(data={nodo:input.nodo1, comando:input.comando1},"PYM-A");		  		
		validaresultado(input.nodo1,ejecuta1,input.comando1,input.cond1,'#testPYM-A');
		texto = $(output).val()+'\n\n';
		$(output).text(texto + ejecuta1.toString().trim());	  
	  
		if (($("#selecttiposervicio").val() == 3) || ($("#selecttiposervicio").val() == 5)){
		  const ejecuta2 = await exec_cmd(data={nodo:input.nodo2, comando:input.comando2},"PYM-B");
		  validaresultado(input.nodo2,ejecuta2,input.comando2,input.cond2,'#testPYM-B');
		  texto = $(output).val()+'\n\n';
		  $(output).text(texto + ejecuta2.toString().trim());				  
		  const ejecuta3 = await exec_cmd(data={nodo:input.nodo3, comando:input.comando3},"PYM-C");			  
		  validaresultado(input.nodo3,ejecuta3,input.comando3,input.cond3,'#testPYM-C');
		  texto = $(output).val()+'\n\n';
		  $(output).text(texto + ejecuta3.toString().trim());				  
		  
		  /*const ejecuta4 = await exec_cmd(data={nodo:input.nodo4, comando:input.comando4},"PYM-D");
		  validaresultado(input.nodo4,ejecuta4,input.comando4,input.cond4,'#testPYM-D');
		  texto = $(output).val()+'\n\n';
		  $(output).text(texto + ejecuta4.toString().trim());	  
		  const ejecuta5 = await exec_cmd(data={nodo:input.nodo5, comando:input.comando5},"PYM-E");
		  validaresultado(input.nodo5,ejecuta5,input.comando5,input.cond5,'#testPYM-E');
		  texto = $(output).val()+'\n\n';
		  $(output).text(texto + ejecuta5.toString().trim());*/
		  
		  const ejecuta6 = await exec_cmd(data={nodo:input.nodo6, comando:input.comando6},"PYM-F");
		  validaresultado(input.nodo6,ejecuta6,input.comando6,input.cond6,'#testPYM-F');
		  texto = $(output).val()+'\n\n';
		  $(output).text(texto + ejecuta6.toString().trim());
		 }
	  console.log("RESULTADO: PYMES Configurar enrutamiento sobre protocolo existente");			  	

 		//OPCIONAL HACER DE NUEVO UN TRIM A TODO EL TEXTO
 		$(output).text($(output).text().toString().trim());
 		$("#resultadodiv1").prop("hidden",false);
  	
  } catch (error) {
    console.error(error);	      
    swal({
		  type: 'error',
		  title: 'Error',
		  text: error.message
		})
  }
}

//PYMES CONFIGURAR PUERTO CAPA 2 - GPON ZTE
let pymesprueba2 = async () => {
	let datos = {};			
	datos.equipo = $("#pymes_equipo_chk2 option:selected").val();
	datos.equiponame = $("#pymes_equipo_chk2 option:selected").text();
	/*datos.gponolt0 = $('#pymes_olt0_chk2').val();
	datos.gponolt1 = $('#pymes_olt1_chk2').val();
	datos.gponolt2 = $('#pymes_olt2_chk2').val();*/
	datos.gponolt = $("#pymes_gponolt_chk2 option:selected").text();
	datos.onuid = $("#pymes_selonuid_chk2 option:selected").text(); //$('#pymes_onuid_chk2').val();
	datos.vlan = $('#pymes_vlan_chk2').val();
	datos.tipoont = $("#pymes_tipodeont_chk2 option:selected").text();
	datos.serial = $('#pymes_serial_chk2').val();
	datos.cliente = $('#pymes_cliente_chk2').val();
	datos.idinternet = $('#pymes_idinternet_chk2').val();
	datos.idtelefonia = $('#pymes_telefonia_chk2').val();
	datos.cossi = $('#pymes_cossi_chk2').is(':checked');
	datos.cosno = $('#pymes_cosno_chk2').is(':checked');
	datos.perfilbwup = document.getElementById("perfilbwup_chk2").value;
	datos.perfilbwdown = document.getElementById("perfilbwdown_chk2").value;
	datos.nomenclatura = document.getElementById("pymes_marcacion_chk2").value;
	datos.codpinternet = document.getElementById("pymes_codpinternet_chk2").value;
	datos.codptelefonia = document.getElementById("pymes_codptelefonia_chk2").value;
	datos.descripcion = document.getElementById("pymes_descripcion_chk2").value;
	datos.interfazethont = $("#pymes_interfazethont_chk2 option:selected").text();
	datos.titulo = $("#labelchk7").text();
	console.log("DATOS PYMES CAPA 2");
	console.log(datos);
	let x = await juan(datos,'pymesprueba2');
	console.log("DATA FROM SERVER",x);
	//datosprueba2 = x;
	return x;
}

//VIEW PYMES - Configurar puerto capa 2
async function view_pymesprueba2() {
	console.log("PYMES PRUEBA 2")
	limpiarpruebas();			
	let x = await pymesprueba2();
	$("#titulo2").append('<h3 class="pruebaheader">'+x.titulo+'</h3>');		  
  //listadopruebas("#prueba2",x.nodo1,x.comando1,'PYM-G');  	
  listadopruebas("#prueba2",x.equiponame,x.comando1,'PYM-G');
  cajapruebas("#resultadodiv2",2);
  console.log(x);
}

/*PYMES - Configurar puerto capa 2 */
async function execpymesprueba2(input) {
	console.log("ENTRADA PYMES PRUEBA 2",input);
	let output = "#caja2";
	let texto = '';
	try {	  		
		const ejecuta1 = await exec_cmdzte(data={nodo:input.nodo1, comando:input.comando1},"PYM-G");		  		
		validareszte(input.equiponame,ejecuta1,input.comando1,input.cond1,'#testPYM-G');
		//validaresultado(input.nodo1,ejecuta1,input.comando1,input.cond1,'#testPYM-G');
		texto = $(output).val()+'\n\n';
		$(output).text(texto + ejecuta1.toString().trim());	   
	  console.log("RESULTADO: PYMES Configurar puerto capa 2");			  	

 		//OPCIONAL HACER DE NUEVO UN TRIM A TODO EL TEXTO
 		$(output).text($(output).text().toString().trim());
 		$("#resultadodiv2").prop("hidden",false);
  	
  } catch (error) {
    console.error(error);	      
    swal({
		  type: 'error',
		  title: 'Error',
		  text: error.message
		})
  }
}


let validareszte = (nodo,datainput,prueba,cond,test) => {
	//console.log("NODO: "+nodo+" INPUT: "+datainput+" PRUEBA: "+prueba+" COND: "+cond+" TEST: "+test);		  
  let lines = datainput.split(`${nodo}#`); 
 
  /*console.log('%c ARRAY ','background: black; color: white; display: block');	 
  console.log(lines); //ARRAY
  for (let i=0; i<lines.length; i++){
		console.log(lines[i]);
		console.log("--------------------------------");				
	}
	console.log('%c END ARRAY ','background: black; color: white; display: block');*/

	for (let j=0; j<Object.keys(cond).length; j++){
		for (let i=0; i<lines.length; i++){
			console.log(cond["condicion"+j][0]+" "+cond["condicion"+j][1]);
			//SI CONDICION ES TRUE
			if (cond["condicion"+j][1]){ //PASA SI CUMPLE
				if (							
					(lines[i].toString().includes(prueba[j]) && lines[i].toString().includes(cond["condicion"+j][0])) && (lines[i].toString().includes("Command authorization failed") === false )
				){
					
					$(test+j).removeClass('fas fa-minus-circle vacio').addClass('far fa-check-circle testok');

				}else if (
					(lines[i].toString().includes(prueba[j]) && (lines[i].toString().includes(cond["condicion"+j][0]) === false)) ||							
					(lines[i].toString().includes(prueba[j]) && lines[i].toString().includes("Command authorization failed"))

				){
					$(test+j).removeClass('fas fa-minus-circle vacio').addClass('far fa-times-circle testfail');							
				}
			}else if (cond["condicion"+j][1] === false){ //NO PASA SI CUMPLE (CONDICION INVERSA)
				if (
					(lines[i].toString().includes(prueba[j]) && lines[i].toString().includes(cond["condicion"+j][0])) ||							
					(lines[i].toString().includes(prueba[j]) && lines[i].toString().includes("Command authorization failed"))
				){
					$(test+j).removeClass('fas fa-minus-circle vacio').addClass('far fa-times-circle testfail');							

					//CERRADO
					//Command authorization failed
					if (lines[i].toString().includes("show running-config banner") && lines[i].toString().includes("CERRADO")){
			  		swal({
					  	type: 'error',
					  	title: 'Error',
					  	text: '!!!!!EQUIPO CERRADO, NO CONFIGURAR NUEVOS SERVICIOS!!!!!'
						})
					}
					if (lines[i].toString().includes("show configuration | begin banner") && lines[i].toString().includes("CERRADO")){
			  		swal({
					  	type: 'error',
					  	title: 'Error',
					  	text: '!!!!!EQUIPO CERRADO, NO CONFIGURAR NUEVOS SERVICIOS!!!!!'
						})
					}
				}else if (							
					(lines[i].toString().includes(prueba[j]) && (lines[i].toString().includes(cond["condicion"+j][0]) === false)) && (lines[i].toString().includes("Command authorization failed") === false)
				){
					$(test+j).removeClass('fas fa-minus-circle vacio').addClass('far fa-check-circle testok');				
				}
			}
		}
	}
} //fin validaresultado	ZTE