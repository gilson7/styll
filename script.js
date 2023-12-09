/* <div class="pub">
<div class="image"></div>
<div class="title"></div>
</div> */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore ,getDocs,collection} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyAEvLDOFgYQUSMKqUA0BnqIJghFZS8Ztd0",
    authDomain: "still-afd7d.firebaseapp.com",
    projectId: "still-afd7d",
    storageBucket: "still-afd7d.appspot.com",
    messagingSenderId: "603290036800",
    appId: "1:603290036800:web:7f0a98db0e6e4c366f4da5",
    measurementId: "G-4LDR6GBR2C"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const produtosColec = collection(db, "produtos");
function html(type,className){
    const elemento = document.createElement(type)
    elemento.className = className
    return elemento
}
async function obterProdutos() {
    try {
        const snapshot = await getDocs(produtosColec);
        snapshot.forEach((doc) => {
            

            const ele = doc.data()
            var isRender = false
            //checando estoque antes de renderizar
            ele.variacoes.map(ele=>{
                ele.tamanhos.map(e=>{
                    if(parseFloat(e.estoque)){
                        isRender = true
                    }
                })
            })
            if(!isRender){
                return
            }
            const divPub = document.createElement("div");
            divPub.classList.add("pub");
        
            const divImage = document.createElement("div");
            divImage.classList.add("image");
            const img = document.createElement("img");
            img.src = ele.variacoes[0].fotos[0];
            img.alt = `${ele.title} image file`;
            divImage.appendChild(img);
        
            const divInfos = document.createElement("div");
            divInfos.classList.add("infos");
        
            const divTitle = document.createElement("div");
            divTitle.classList.add("title");
            divTitle.textContent = ele.title;
        

           

            const divPrice = document.createElement("div");
            divPrice.classList.add("price");

            const descInfo = html('span','desconto')
            const oldPrecoInfo = html('span','oldPreco')
            const precoInfo = html('span','precoInfo')

            if(parseFloat(ele.desconto)){
                let desconto  = parseFloat(ele.desconto / 100)
                let precobruto = parseFloat(ele.preco)
                let precofinal = precobruto - precobruto*desconto
            
                precoInfo.innerHTML = parseFloat(precofinal,2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                oldPrecoInfo.innerHTML = parseFloat(ele.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                descInfo.innerHTML = ele.desconto+"% "+" OFF"
        
                divPrice.appendChild(oldPrecoInfo)
                divPrice.appendChild(precoInfo)
                divPrice.appendChild(descInfo)
            }else{
                precoInfo.innerHTML = parseFloat(ele.preco,2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                divPrice.appendChild(precoInfo)
            }

 
        
            divInfos.appendChild(divTitle);
            divInfos.appendChild(divPrice);
        
            divPub.appendChild(divImage);
            divPub.appendChild(divInfos);
        
            content.appendChild(divPub);
            divPub.onclick=function(){
                window.location.href=`./prod.html?id=${doc.id}`
            }
      })
      removeLoad()
    }catch{
        removeLoad()
        alert("Infelismente Ocorreu um erro ao carregar o conteudo volte mais tarde enquanto resolvemos por aqui")
    }
}

const content = document.getElementById("content");
function removeLoad(){
    document.getElementById("load").style.display = "none"
}
obterProdutos()

function sharePopup(){

    const buttonClose = html("div","close-share-popup")
    const sharePopupDiv = html("div","sharePopup")
    const buttonWpp = html("div","share-btt-wpp")
    const linkInput = html("input","share-link")
    const copyLink = html("div","share-button")
    buttonClose.textContent = "+"
    copyLink.textContent = "Copiar"
    linkInput.type = "text"
    linkInput.value = window.location.href
    buttonWpp.textContent = "Enviar pelo whatsApp"
    buttonWpp.onclick = ()=>{
        window.open(`https://api.whatsapp.com/send/?text=${window.location.href}`)
    }
    sharePopupDiv.appendChild(buttonClose)
    
    sharePopupDiv.appendChild(linkInput)
    sharePopupDiv.appendChild(copyLink)
    sharePopupDiv.appendChild(buttonWpp)
    document.body.appendChild(sharePopupDiv)
    buttonClose.onclick = ()=>{
        sharePopupDiv.remove()
    }
    copyLink.onclick = ()=>{
        linkInput.select()
        document.execCommand('copy')
        copyLink.textContent = "copiado"
        setTimeout(()=>{
            copyLink.textContent = "Copiar"
        },3000)

    }
}
document.getElementById("share").onclick = sharePopup