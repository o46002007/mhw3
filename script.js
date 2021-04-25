function viewMore(event){
	const div=event.currentTarget.parentNode;
	const index=div.dataset.index;
	
	const descrizione=MAP[index].descrizione;
	const mq=MAP[index].mq;
	const prezzo=MAP[index].prezzo;
	const città=MAP[index].città;
	
	const h6=document.createElement("h6");
	const p=document.createElement("p");
	const h5=document.createElement("h5");
	const h3=document.createElement("h3");
	
	div.querySelector("div").appendChild(h6);
	div.querySelector("div").appendChild(p);
	div.querySelector("div").appendChild(h5);
	div.querySelector("div").appendChild(h3);
	
	div.querySelector("h6").textContent=descrizione;
	div.querySelector("p").textContent=mq;
	div.querySelector("h5").textContent="Città: "+città;
	div.querySelector("h3").textContent=prezzo;
	
	event.currentTarget.textContent="View less";
	
	event.currentTarget.removeEventListener("click", viewMore);
	event.currentTarget.addEventListener("click", viewLess);
}

function viewLess(event){
	const div=event.currentTarget.parentNode;
	const children=div.childNodes;
	div.querySelector("div").innerHTML="";
	const a=div.querySelector("a");
	a.textContent="View more";
	event.currentTarget.removeEventListener("click", viewLess);
	event.currentTarget.addEventListener("click", viewMore);
}





function search(){
	event.preventDefault();
	const input=document.querySelector("#searchbar");
	const text=input.value.toUpperCase();
	const divs=document.querySelectorAll(".flex-item");
	
	for(let i=0; i<divs.length; i++){
		const div=divs[i];
		const span=div.querySelector("span");
		const h4=span.querySelector("h4");
		for(let j=0; j<span.childNodes.length; j++){
			const titolo=h4.textContent;
			if(titolo.toUpperCase().indexOf(text)>-1){
				div.classList.remove("hidden");
			}
			else{
				div.classList.add("hidden");
			}
		}
	}
	
	const tantidiv=document.querySelectorAll(".flex-container .hidden");
	const footer=document.querySelector("footer");
	if((divs.length-tantidiv.length)<4){
		footer.classList.add("hidden");
	}else{
		footer.classList.remove("hidden");
	}
	
	const h1=document.querySelector("#case-scritta");
	if((divs.length-tantidiv.length)<1){
		h1.classList.add("hidden");
	}else{
		h1.classList.remove("hidden");
	}
	
	if(text!==""){
		const newText=encodeURIComponent("casa "+text);
		
		const img_request=img_endpoint+"/search?query="+newText;
			fetch(img_request,
			{
				headers:	
				{
					'Authorization': key_img,
				}
			}
			).then(onResponse).then(onJSONImg);
	}else{
		const section=document.querySelector("#altro-container");
		section.innerHTML="";
		const h1=document.querySelector("#altro").classList.add("hidden");
	}
}

function onResponse(response){
	return response.json();
}

function onJSONImg(json){
	const section=document.querySelector("#altro-container");
	console.log(json);
	
	let n=json.total_results;
	if(n>=3){
		n=3;
	}
	
	if(section.childNodes.length>0){
		section.innerHTML="";
	}
	
	for(let i=0; i<n; i++){
		const immagine=json.photos[i].src.medium;
		const div=document.createElement("div");
		div.classList.add("item-altro");
		section.appendChild(div);
		const img=document.createElement("img");
		img.src=immagine;
		div.appendChild(img);
	}
	
	const h1=document.querySelector("#altro");
	if(section.childNodes.length>0){
		h1.classList.remove("hidden");
	}else{
		h1.classList.add("hidden");
	}
}





function addPreferiti(event){
	const section=document.querySelector(".preferiti-container");
	const divset=event.currentTarget.parentNode.parentNode;
	const index=divset.dataset.index;
	
	const div=document.createElement("div");
	section.appendChild(div);
	div.classList.add('item-preferiti');
	div.setAttribute("data-index",index);
	
	const span=document.createElement("span");
	span.classList.add('preferiti-sopra');
	
	div.appendChild(span);
	
	const h5=document.createElement("h5");
	const imgs=document.createElement("img");
	const img=document.createElement("img");
	
	h5.textContent=MAP[index].titolo;
	imgs.src=MAP[index].spreferiti;
	img.src=MAP[index].immagine;
	a.textContent=MAP[index].bottone;
	
	div.querySelector("span").appendChild(h5);
	div.querySelector("span").appendChild(imgs);
	div.appendChild(img);
	
	event.currentTarget.removeEventListener("click", addPreferiti);
	imgs.addEventListener("click", removePreferiti);
	
	if(section.childNodes.length==1){
		const h1=document.querySelector("#preferiti");
		h1.classList.remove("hidden");
	}

	città(index);
}

function removePreferiti(event){
	const section=document.querySelector(".preferiti-container");
	const div=event.currentTarget.parentNode.parentNode;
	const index=div.dataset.index;
	
	section.removeChild(div);
	
	const section1=document.querySelector("#container-items");
	const div1=section1.querySelector("[data-index='"+index+"']");
	const img=div1.querySelector("span img");
	img.addEventListener("click", addPreferiti);
	
	const h1=document.querySelector("#preferiti");
	if(section.childNodes.length==0){
		h1.classList.add("hidden");
	}
	
	const section2=document.querySelector("#container-città");
	const divs=document.querySelectorAll(".divItems");
	for(let i=0; i<divs.length; i++){
		if(divs[i].getAttribute("data-index")===index){
			section2.removeChild(divs[i]);
		}
	}
	
	if(section2.childNodes.length==0){
		const h1=document.querySelector("#case-hotel");
		h1.classList.add("hidden");
	}
}

function città(index){	
	const city=MAP[index].città;
	fetch(endpoint+"/v2/shopping/hotel-offers?cityCode="+city,
	{
		headers: {
			"Authorization":"Bearer "+token
		}
	}).then(onResponse).then(onJSON);
}

function onResponse(response){
	return response.json();
}

function onJSON(json){
	console.log(json);
	const section=document.querySelector("#container-città");
	const othersection=document.querySelector(".preferiti-container");
	
	const n_divs_preferiti=othersection.childNodes.length;
	const specific_div_preferito=othersection.children[n_divs_preferiti-1];
	const index=specific_div_preferito.getAttribute("data-index");
	
	const div=document.createElement("div");
	section.appendChild(div);
	div.setAttribute("data-index",index);
	div.classList.add("divItems");
	
	const h5=document.createElement("h5");
	h5.textContent="Hotel vicini alla città: "+json.data[0].hotel.cityCode;
	div.appendChild(h5);
	
	let n=json.data.length;
	if(n>=3){
		n=3;
	}
	
	for(let i=0; i<n; i++){
		const nome=json.data[i].hotel.name;
		const h6=document.createElement("h6");
		h6.textContent=nome;
		div.appendChild(h6);
	}
	
	if(section.childNodes.length>0){
		const h1=document.querySelector("#case-hotel");
		h1.classList.remove("hidden");
	}
}





const article=document.querySelector("article");

const section1=document.createElement("section");
article.appendChild(section1);
const h1sec1=document.createElement("h1");
section1.appendChild(h1sec1);
h1sec1.classList.add("hidden");
h1sec1.setAttribute("id","preferiti");
h1sec1.textContent="Preferiti";
const section11=document.createElement("section");
section1.appendChild(section11);
section11.classList.add("preferiti-container");

const section4=document.createElement("section");
article.appendChild(section4);
const h1sec4=document.createElement("h1");
section4.appendChild(h1sec4);
h1sec4.textContent="Hotel vicini";
h1sec4.setAttribute("id","case-hotel");
h1sec4.classList.add("hidden");
const section41=document.createElement("section");
section41.setAttribute("id","container-città");
section4.appendChild(section41);

const section2=document.createElement("section");
section2.setAttribute("id","container-items");
article.appendChild(section2);
const h1sec2=document.createElement("h1");
section2.appendChild(h1sec2);
h1sec2.textContent="Tutte le case";
h1sec2.setAttribute("id","case-scritta");
const section21=document.createElement("section");
section21.classList.add("flex-container");
section2.appendChild(section21);

const section3=document.createElement("section");
article.appendChild(section3);
const h1sec3=document.createElement("h1");
section3.appendChild(h1sec3);
h1sec3.classList.add("hidden");
h1sec3.setAttribute("id","altro");
h1sec3.textContent="Vedi altro";
const section31=document.createElement("section");
section3.appendChild(section31);
section31.setAttribute("id","altro-container");

const section5=document.createElement("section");
article.appendChild(section5);
section5.setAttribute("id","modale");
section5.classList.add("hidden");





for(let index in MAP){
	const div=document.createElement("div");
	div.setAttribute("data-index",index);
	section21.appendChild(div);
	div.classList.add("flex-item");
	
	const span=document.createElement("span");
	span.classList.add('preferiti');
	const divb=document.createElement("div");
	
	div.appendChild(span);
	
	const h4=document.createElement("h4");
	const imgp=document.createElement("img");
	const img=document.createElement("img");
	const a=document.createElement("a");
	
	h4.textContent=MAP[index].titolo;
	imgp.src=MAP[index].preferiti;
	img.src=MAP[index].immagine;
	a.textContent=MAP[index].bottone;
	
	div.querySelector("span").appendChild(h4);
	div.querySelector("span").appendChild(imgp);
	div.appendChild(img);
	div.appendChild(divb);
	div.appendChild(a);
	a.classList.add('button');
	img.addEventListener("click", apriModale);
}

const as=document.querySelectorAll(".button");
for(a of as){
	a.addEventListener("click", viewMore);
}

const preferitis=document.querySelectorAll(".preferiti img");
for(preferiti of preferitis){
	preferiti.addEventListener("click", addPreferiti);
}

const input=document.querySelector("#search");
input.addEventListener("submit", search);

const numResults=10;
const key_img="563492ad6f9170000100000170d0c687a38046c6bcbf0edaae6d419d";
const img_endpoint="https://api.pexels.com/v1";





const client_id="WcoA3EPYVPOxXptWsXj79Q3Mkaku1oNq";
const client_secret="BffGHSlaqQS5OkQI";
const endpoint="https://test.api.amadeus.com";

let token_data;
let token;
fetch(endpoint+"/v1/security/oauth2/token",
{
	method: "POST",
	body: "grant_type=client_credentials&client_id="+client_id+"&client_secret="+client_secret,
	headers: {
		"Content-Type":"application/x-www-form-urlencoded"
	}
}).then(onTokenResponse).then(getToken);

function onTokenResponse(response){
	return response.json();
}

function getToken(json){
	token_data=json;
	token=json.access_token;
}





window.addEventListener("keydown", chiudiModale);

function apriModale(event){
	const img=document.createElement("img");
	img.src=event.currentTarget.src;
	const modale=document.querySelector("#modale");
	modale.appendChild(img);
	modale.classList.remove("hidden");
	const body=document.querySelector("body");
	body.classList.add("no-scroll");
}

function chiudiModale(event){
	if(event.keyCode==27){
		const modale=document.querySelector("#modale");
		const img=modale.querySelector("img");
		img.remove();
		modale.classList.add("hidden");
		const body=document.querySelector("body");
		body.classList.remove("no-scroll");
	}
}